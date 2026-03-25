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
    
    // Check if there is already a profile that matches this hostname (or exact match, but hostname/username is safe)
    const isSaved = profiles.some(p => p.hostname === existingConfig.hostname && p.username === existingConfig.username);

    if (!isSaved) {
        const result = await vscode.window.showInformationMessage(
            'Found an existing dw.json configuration. Would you like to save it to your DW Profiles?',
            'Yes', 'No'
        );

        if (result === 'Yes') {
            const name = await vscode.window.showInputBox({ 
                prompt: 'Enter a name for this profile (e.g., Current Project)', 
                value: 'Recovered Profile' 
            });

            if (name) {
                // If the user picked a name that exists, do a quick check
                if (profiles.find(p => p.name === name)) {
                    vscode.window.showErrorMessage(`Profile '${name}' already exists. Please create it manually with a different name.`);
                    return;
                }

                profiles.push({
                    name,
                    hostname: existingConfig.hostname,
                    username: existingConfig.username,
                    password: existingConfig.password,
                    "code-version": existingConfig["code-version"]
                });
                await Config.saveProfiles(profiles);
                vscode.window.showInformationMessage(`DW Profile '${name}' saved successfully!`);
                StatusBarManager.update();
            }
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('DW Profiles extension activated');

    StatusBarManager.initialize(context);
    
    // Check for existing dw.json not tracked by profiles
    checkForExistingDWJson();

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
