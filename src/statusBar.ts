import * as vscode from 'vscode';
import { Config } from './config';
import { DWJsonManager } from './dwJson';

export class StatusBarManager {
    private static statusBarItem: vscode.StatusBarItem;

    static initialize(context: vscode.ExtensionContext) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'dw-profiles.pickProfile';
        context.subscriptions.push(this.statusBarItem);
        this.update();
    }

    static update() {
        const workspaceUri = DWJsonManager.getWorkspaceUri();
        if (!workspaceUri) {
            this.statusBarItem.hide();
            return;
        }

        const selections = Config.getWorkspaceProfileSelections();
        const selectedProfileName = selections[workspaceUri];

        if (!selectedProfileName) {
            this.statusBarItem.text = `$(cloud) DW: Pick Profile`;
            this.statusBarItem.tooltip = 'Click to select a DW profile';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            const format = Config.getStatusBarFormat();
            const profiles = Config.getProfiles();
            const activeProfile = profiles.find(p => p.name === selectedProfileName);
            
            const text = format === 'full' ? `$(cloud) DW > ${selectedProfileName}` : `$(cloud) ${selectedProfileName}`;
            this.statusBarItem.text = text;
            this.statusBarItem.tooltip = `Currently using DW Profile: ${selectedProfileName}`;
            
            this.statusBarItem.backgroundColor = undefined;
            if (activeProfile && activeProfile.hostname) {
                const hn = activeProfile.hostname.toLowerCase();
                if (hn.includes('development')) {
                    // Provide a standard option if custom fails, but we'll try our custom one first
                    this.statusBarItem.backgroundColor = new vscode.ThemeColor('dwProfiles.devBackground');
                } else if (hn.includes('staging')) {
                    // Try our custom one first, fallback to prominent
                    this.statusBarItem.backgroundColor = new vscode.ThemeColor('dwProfiles.stagingBackground');
                }
            }
        }
        
        this.statusBarItem.show();
    }
}
