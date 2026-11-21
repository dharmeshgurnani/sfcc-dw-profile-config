import * as vscode from 'vscode';
import { pickProfile, createProfile, editProfile, deleteProfile, applyProfileNode, editProfileNode, deleteProfileNode } from './commands';
import { DWProfilesProvider } from './treeDataProvider';
import { StatusBarManager } from './statusBar';
import { DWJsonManager } from './dwJson';
import { Config } from './config';

async function checkForExistingDWJson() {
    const existingConfig = DWJsonManager.readDWJson();
    if (!existingConfig || (!existingConfig.hostname && !existingConfig.username)) {
        return;
    }

    const profiles = Config.getProfiles();
    const isSaved = profiles.some(p => p.hostname === existingConfig.hostname && p.username === existingConfig.username);

    if (!isSaved) {
        const result = await vscode.window.showInformationMessage(
            'Found an existing dw.json configuration. Would you like to save it to your DW Profiles?',
            'Update Existing Profile', 'Create New Profile', 'No'
        );

        if (result === 'Update Existing Profile') {
            await updateExistingProfileWithData(existingConfig);
        } else if (result === 'Create New Profile') {
            await createNewProfileWithData(existingConfig);
        }
    }
}

async function handleDWJsonChange() {
    if (DWJsonManager.isInternalWriting) return;

    const existingConfig = DWJsonManager.readDWJson();
    if (!existingConfig || (!existingConfig.hostname && !existingConfig.username)) return;

    // Optional: check if it already matches the current profile exactly
    const workspaceUri = DWJsonManager.getWorkspaceUri();
    if (workspaceUri) {
        const selections = Config.getWorkspaceProfileSelections();
        const currentProfileName = selections[workspaceUri];
        const profiles = Config.getProfiles();
        const currentProfile = profiles.find(p => p.name === currentProfileName);
        if (currentProfile) {
            // Compare fields (excluding name)
            const match = currentProfile.hostname === existingConfig.hostname &&
                          currentProfile.username === existingConfig.username &&
                          currentProfile.password === existingConfig.password &&
                          currentProfile["code-version"] === existingConfig["code-version"];
            if (match) return; // No change needed if it matches current selected profile
        }
    }

    const result = await vscode.window.showInformationMessage(
        'Manual change detected in dw.json. Would you like to update your DW Profiles?',
        'Update Existing', 'Create New', 'Ignore'
    );

    if (result === 'Update Existing') {
        await updateExistingProfileWithData(existingConfig);
    } else if (result === 'Create New') {
        await createNewProfileWithData(existingConfig);
    }
}

async function updateExistingProfileWithData(data: Partial<any>) {
    const profiles = Config.getProfiles();
    if (profiles.length === 0) {
        vscode.window.showInformationMessage('No DW Profiles found. Please create one first or choose "Create New Profile".');
        return;
    }

    const items = profiles.map(p => ({ label: p.name, description: p.hostname || '' }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select a DW Profile to update with current dw.json values' });

    if (selected) {
        const profileIndex = profiles.findIndex(p => p.name === selected.label);
        if (profileIndex !== -1) {
            profiles[profileIndex] = {
                ...profiles[profileIndex],
                ...data
            };
            await Config.saveProfiles(profiles);
            vscode.window.showInformationMessage(`DW Profile '${selected.label}' updated successfully.`);
            StatusBarManager.update();
        }
    }
}

async function createNewProfileWithData(data: Partial<any>) {
    const name = await vscode.window.showInputBox({ 
        prompt: 'Enter a name for this profile (e.g., Development)', 
        value: 'New Profile' 
    });

    if (name) {
        const profiles = Config.getProfiles();
        if (profiles.find(p => p.name === name)) {
            vscode.window.showErrorMessage(`Profile '${name}' already exists.`);
            return;
        }

        profiles.push({
            name,
            ...data
        });
        await Config.saveProfiles(profiles);
        vscode.window.showInformationMessage(`DW Profile '${name}' created successfully!`);
        StatusBarManager.update();
    }
}

export function activate(context: vscode.ExtensionContext) {
    Config.extensionUri = context.extensionUri;

    StatusBarManager.initialize(context);
    
    // Check for existing dw.json not tracked by profiles
    checkForExistingDWJson();

    // Set up watcher for dw.json
    const watcher = vscode.workspace.createFileSystemWatcher('**/dw.json');
    watcher.onDidChange(() => handleDWJsonChange());
    watcher.onDidCreate(() => handleDWJsonChange());
    context.subscriptions.push(watcher);

    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.pickProfile', pickProfile)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.createProfile', createProfile)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.editProfile', editProfile)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.deleteProfile', deleteProfile)
    );

    // Sidebar Node Commands
    const dwProfilesProvider = new DWProfilesProvider();
    vscode.window.registerTreeDataProvider('dw-profiles-view', dwProfilesProvider);
    
    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.refreshSidebar', () => dwProfilesProvider.refresh())
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.applyProfileNode', applyProfileNode)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.editProfileNode', editProfileNode)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('dw-profiles.deleteProfileNode', deleteProfileNode)
    );

    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('dwProfiles')) {
            StatusBarManager.update();
            dwProfilesProvider.refresh();
        }
    }, null, context.subscriptions);
    
    vscode.workspace.onDidChangeWorkspaceFolders(e => {
        StatusBarManager.update();
    }, null, context.subscriptions);
}

export function deactivate() {}
