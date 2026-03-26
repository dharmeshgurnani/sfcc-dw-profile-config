import * as vscode from 'vscode';
import { DWProfile, WorkspaceSelection } from './models';

export class Config {
    static extensionUri: vscode.Uri;

    static getProfiles(): DWProfile[] {
        const config = vscode.workspace.getConfiguration('dwProfiles');
        return config.get<DWProfile[]>('profiles') || [];
    }

    static async saveProfiles(profiles: DWProfile[]): Promise<void> {
        const config = vscode.workspace.getConfiguration('dwProfiles');
        await config.update('profiles', profiles, vscode.ConfigurationTarget.Global);
    }

    static getWorkspaceProfileSelections(): WorkspaceSelection {
        const config = vscode.workspace.getConfiguration('dwProfiles');
        return config.get<WorkspaceSelection>('workspaceProfileSelections') || {};
    }

    static async saveWorkspaceProfileSelection(workspaceUri: string, profileName: string): Promise<void> {
        const config = vscode.workspace.getConfiguration('dwProfiles');
        const selections = this.getWorkspaceProfileSelections();
        
        if (profileName) {
            selections[workspaceUri] = profileName;
        } else {
            delete selections[workspaceUri];
        }

        await config.update('workspaceProfileSelections', selections, vscode.ConfigurationTarget.Global);
    }

    static getStatusBarFormat(): 'full' | 'compact' {
        const config = vscode.workspace.getConfiguration('dwProfiles');
        return config.get<'full' | 'compact'>('statusBarFormat') || 'full';
    }
}
