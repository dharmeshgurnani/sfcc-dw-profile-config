import * as vscode from 'vscode';
import { Config } from './config';
import { DWProfile } from './models';

export class DWProfileTreeItem extends vscode.TreeItem {
    constructor(
        public readonly profile: DWProfile,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(profile.name, collapsibleState);
        this.tooltip = `Hostname: ${profile.hostname || 'N/A'}\nUsername: ${profile.username || 'N/A'}`;
        this.description = profile.hostname || '';
        this.contextValue = 'dwProfile';
        this.iconPath = new vscode.ThemeIcon('server');
    }
}

export class DWProfilesProvider implements vscode.TreeDataProvider<DWProfileTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DWProfileTreeItem | undefined | null | void> = new vscode.EventEmitter<DWProfileTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DWProfileTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DWProfileTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DWProfileTreeItem): Thenable<DWProfileTreeItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            const profiles = Config.getProfiles();
            const items = profiles.map(p => new DWProfileTreeItem(p, vscode.TreeItemCollapsibleState.None));
            return Promise.resolve(items);
        }
    }
}
