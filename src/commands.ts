import * as vscode from 'vscode';
import { Config } from './config';
import { DWJsonManager } from './dwJson';
import { StatusBarManager } from './statusBar';

export async function pickProfile() {
    const profiles = Config.getProfiles();
    if (profiles.length === 0) {
        vscode.window.showInformationMessage('No DW Profiles found. Please create one first.');
        return;
    }

    const items = profiles.map(p => ({
        label: p.name,
        description: p.hostname || ''
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a DW Profile'
    });

    if (selected) {
        const profile = profiles.find(p => p.name === selected.label);
        if (profile) {
            DWJsonManager.writeDWJson(profile);
            const workspaceUri = DWJsonManager.getWorkspaceUri();
            if (workspaceUri) {
                await Config.saveWorkspaceProfileSelection(workspaceUri, profile.name);
                StatusBarManager.update();
            }
        }
    }
}

export async function createProfile() {
    const name = await vscode.window.showInputBox({ prompt: 'Enter Profile Name (e.g., Staging)' });
    if (!name) return;

    const hostname = await vscode.window.showInputBox({ prompt: 'Enter Hostname (e.g., development-xxx.demandware.net)' });
    const username = await vscode.window.showInputBox({ prompt: 'Enter Username' });
    const password = await vscode.window.showInputBox({ prompt: 'Enter Password', password: true });
    const codeVersion = await vscode.window.showInputBox({ prompt: 'Enter Code Version (default: version1)', value: 'version1' });

    const profiles = Config.getProfiles();
    if (profiles.find(p => p.name === name)) {
        vscode.window.showErrorMessage(`Profile '${name}' already exists.`);
        return;
    }

    profiles.push({
        name,
        hostname: hostname || undefined,
        username: username || undefined,
        password: password || undefined,
        "code-version": codeVersion || undefined
    });

    await Config.saveProfiles(profiles);
    vscode.window.showInformationMessage(`DW Profile '${name}' created successfully.`);
}

export async function editProfile() {
    const profiles = Config.getProfiles();
    if (profiles.length === 0) {
        vscode.window.showInformationMessage('No DW Profiles found.');
        return;
    }

    const items = profiles.map(p => ({ label: p.name, description: p.hostname || '' }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select a DW Profile to edit' });

    if (selected) {
        const profileIndex = profiles.findIndex(p => p.name === selected.label);
        if (profileIndex === -1) return;

        const p = profiles[profileIndex];
        
        const hostname = await vscode.window.showInputBox({ prompt: 'Enter Hostname', value: p.hostname });
        const username = await vscode.window.showInputBox({ prompt: 'Enter Username', value: p.username });
        const password = await vscode.window.showInputBox({ prompt: 'Enter Password', password: true, value: p.password });
        const codeVersion = await vscode.window.showInputBox({ prompt: 'Enter Code Version', value: p["code-version"] });

        profiles[profileIndex] = {
            name: p.name,
            hostname: hostname || undefined,
            username: username || undefined,
            password: password || undefined,
            "code-version": codeVersion || undefined
        };

        await Config.saveProfiles(profiles);
        vscode.window.showInformationMessage(`DW Profile '${p.name}' updated successfully.`);
    }
}

export async function deleteProfile() {
    const profiles = Config.getProfiles();
    if (profiles.length === 0) {
        vscode.window.showInformationMessage('No DW Profiles found.');
        return;
    }

    const items = profiles.map(p => ({ label: p.name, description: p.hostname || '' }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select a DW Profile to delete' });

    if (selected) {
        const updatedProfiles = profiles.filter(p => p.name !== selected.label);
        await Config.saveProfiles(updatedProfiles);
        vscode.window.showInformationMessage(`DW Profile '${selected.label}' deleted.`);

        // Also clean up selection if it was active
        const workspaceUri = DWJsonManager.getWorkspaceUri();
        if (workspaceUri) {
            const selections = Config.getWorkspaceProfileSelections();
            if (selections[workspaceUri] === selected.label) {
                await Config.saveWorkspaceProfileSelection(workspaceUri, '');
                StatusBarManager.update();
            }
        }
    }
}

export async function applyProfileNode(node: any) {
    if (node && node.profile) {
        DWJsonManager.writeDWJson(node.profile);
        const workspaceUri = DWJsonManager.getWorkspaceUri();
        if (workspaceUri) {
            await Config.saveWorkspaceProfileSelection(workspaceUri, node.profile.name);
            StatusBarManager.update();
        }
    }
}

export async function editProfileNode(node: any) {
    if (node && node.profile) {
        const profiles = Config.getProfiles();
        const profileIndex = profiles.findIndex(p => p.name === node.profile.name);
        if (profileIndex === -1) return;

        const p = profiles[profileIndex];
        
        const hostname = await vscode.window.showInputBox({ prompt: 'Enter Hostname', value: p.hostname });
        const username = await vscode.window.showInputBox({ prompt: 'Enter Username', value: p.username });
        const password = await vscode.window.showInputBox({ prompt: 'Enter Password', password: true, value: p.password });
        const codeVersion = await vscode.window.showInputBox({ prompt: 'Enter Code Version', value: p["code-version"] });

        profiles[profileIndex] = {
            name: p.name,
            hostname: hostname || undefined,
            username: username || undefined,
            password: password || undefined,
            "code-version": codeVersion || undefined
        };

        await Config.saveProfiles(profiles);
        vscode.window.showInformationMessage(`DW Profile '${p.name}' updated successfully.`);
    }
}

export async function deleteProfileNode(node: any) {
    if (node && node.profile) {
        const profiles = Config.getProfiles();
        const updatedProfiles = profiles.filter(p => p.name !== node.profile.name);
        await Config.saveProfiles(updatedProfiles);
        vscode.window.showInformationMessage(`DW Profile '${node.profile.name}' deleted.`);

        const workspaceUri = DWJsonManager.getWorkspaceUri();
        if (workspaceUri) {
            const selections = Config.getWorkspaceProfileSelections();
            if (selections[workspaceUri] === node.profile.name) {
                await Config.saveWorkspaceProfileSelection(workspaceUri, '');
                StatusBarManager.update();
            }
        }
    }
}
