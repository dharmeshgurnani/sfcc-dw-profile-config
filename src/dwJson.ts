import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DWProfile } from './models';

export class DWJsonManager {
    static getWorkspaceUri(): string | undefined {
        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            return undefined;
        }
        return vscode.workspace.workspaceFolders[0].uri.toString();
    }

    static getWorkspaceFsPath(): string | undefined {
        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            return undefined;
        }
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

    static readDWJson(): Partial<DWProfile> | undefined {
        const workspacePath = this.getWorkspaceFsPath();
        if (!workspacePath) return undefined;

        const dwJsonPath = path.join(workspacePath, 'dw.json');
        if (!fs.existsSync(dwJsonPath)) return undefined;

        try {
            const content = fs.readFileSync(dwJsonPath, 'utf8');
            return JSON.parse(content);
        } catch (e) {
            return undefined;
        }
    }

    static writeDWJson(profile: DWProfile): void {
        const workspacePath = this.getWorkspaceFsPath();
        if (!workspacePath) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }

        const dwJsonPath = path.join(workspacePath, 'dw.json');
        
        // Exclude the internally used 'name' property from the written dw.json
        const { name, ...configData } = profile;
        
        const dwJsonContent = JSON.stringify(configData, null, 2);
        
        try {
            fs.writeFileSync(dwJsonPath, dwJsonContent, 'utf8');
            vscode.window.showInformationMessage(`Applied profile '${profile.name}' to dw.json successfully.`);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to write dw.json: ${error.message}`);
        }
    }
}
