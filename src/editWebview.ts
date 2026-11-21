import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { DWProfile } from './models';
import { Config } from './config';

export function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getNonce(): string {
    return crypto.randomBytes(16).toString('base64');
}

export class EditWebviewProvider {
    public static currentPanel: EditWebviewProvider | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, profile: DWProfile, onSave: (updatedProfile: DWProfile) => void) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._update(profile);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'save':
                        onSave(message.profile);
                        this._panel.dispose();
                        return;
                    case 'cancel':
                        this._panel.dispose();
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static show(extensionUri: vscode.Uri, profile: DWProfile, onSave: (updatedProfile: DWProfile) => void) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (EditWebviewProvider.currentPanel) {
            EditWebviewProvider.currentPanel._panel.reveal(column);
            EditWebviewProvider.currentPanel._update(profile);
            return;
        }

        const title = profile.name ? `Edit Profile: ${profile.name}` : 'Create New Profile';

        const panel = vscode.window.createWebviewPanel(
            'editDWProfile',
            title,
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [extensionUri]
            }
        );

        EditWebviewProvider.currentPanel = new EditWebviewProvider(panel, extensionUri, profile, onSave);
    }

    public dispose() {
        EditWebviewProvider.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update(profile: DWProfile) {
        const title = profile.name ? `Edit Profile: ${profile.name}` : 'Create New Profile';
        this._panel.title = title;
        this._panel.webview.html = this._getHtmlForWebview(profile);
    }

    private _getHtmlForWebview(profile: DWProfile) {
        const webview = this._panel.webview;
        const nonce = getNonce();
        const csp = `default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}';`;

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="${csp}">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Edit DW Profile</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 20px;
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-editor-background);
                    }
                    .form-container {
                        max-width: 500px;
                        margin: 0 auto;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        background: var(--vscode-sideBar-background);
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    }
                    h2 {
                        margin-top: 0;
                        color: var(--vscode-button-background);
                        font-weight: 500;
                    }
                    .field {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                    }
                    label {
                        font-size: 0.9em;
                        opacity: 0.8;
                    }
                    input {
                        padding: 8px 12px;
                        background: var(--vscode-input-background);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 4px;
                        outline: none;
                    }
                    input:focus {
                        border-color: var(--vscode-focusBorder);
                    }
                    .actions {
                        display: flex;
                        gap: 10px;
                        margin-top: 10px;
                    }
                    button {
                        padding: 8px 20px;
                        cursor: pointer;
                        border: none;
                        border-radius: 4px;
                        font-weight: 500;
                        transition: opacity 0.2s;
                    }
                    button:hover {
                        opacity: 0.9;
                    }
                    #save-btn {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        flex: 2;
                    }
                    #cancel-btn {
                        background-color: var(--vscode-button-secondaryBackground);
                        color: var(--vscode-button-secondaryForeground);
                        flex: 1;
                    }
                </style>
            </head>
            <body>
                <div class="form-container">
                    <h2>${profile.name ? 'Edit Profile' : 'Create New Profile'}</h2>
                    <p style="margin-top: -10px; opacity: 0.7; font-size: 0.9em; margin-bottom: 20px;">
                        ${profile.name ? 'Update your environment connection details.' : 'Define a new environment connection for your dw.json.'}
                    </p>
                    <div class="field">
                        <label>Profile Name <span style="color: var(--vscode-errorForeground)">*</span></label>
                        <input type="text" id="name" value="${escapeHtml(profile.name)}" placeholder="e.g. Staging or Development">
                    </div>
                    <div class="field">
                        <label>Hostname</label>
                        <input type="text" id="hostname" value="${escapeHtml(profile.hostname)}" placeholder="development-xxx.demandware.net">
                    </div>
                    <div class="field">
                        <label>Username</label>
                        <input type="text" id="username" value="${escapeHtml(profile.username)}" placeholder="e.g. jdoe">
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input type="password" id="password" value="${escapeHtml(profile.password)}">
                    </div>
                    <div class="field">
                        <label>Code Version</label>
                        <input type="text" id="code-version" value="${escapeHtml(profile['code-version'])}" placeholder="version1">
                    </div>
                    <div class="field">
                        <label>Cartridges (comma separated list)</label>
                        <input type="text" id="cartridge" value="${escapeHtml((profile.cartridge || []).join(', '))}" placeholder="cartridgeA, cartridgeB">
                    </div>
                    <div class="field">
                        <label>Cartridge Path (colon separated)</label>
                        <input type="text" id="cartridgePath" value="${escapeHtml(profile.cartridgePath)}" placeholder="cartridgeA:cartridgeB">
                    </div>
                    <div class="actions">
                        <button id="save-btn">${profile.name ? 'Save Changes' : 'Create Profile'}</button>
                        <button id="cancel-btn">Cancel</button>
                    </div>
                    <div id="error-msg" style="color: var(--vscode-errorForeground); font-size: 0.85em; margin-top: 10px; display: none;">
                        Profile Name is required.
                    </div>
                </div>

                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                    
                    document.getElementById('save-btn').addEventListener('click', () => {
                        const name = document.getElementById('name').value;
                        if (!name) {
                            document.getElementById('error-msg').style.display = 'block';
                            return;
                        }

                        const cartridgeValue = document.getElementById('cartridge').value;
                        const cartridges = cartridgeValue ? cartridgeValue.split(',').map(s => s.trim()).filter(s => s.length > 0) : undefined;
                        
                        const profileUpdate = {
                            name: name,
                            hostname: document.getElementById('hostname').value,
                            username: document.getElementById('username').value,
                            password: document.getElementById('password').value,
                            'code-version': document.getElementById('code-version').value,
                            'cartridge': cartridges,
                            'cartridgePath': document.getElementById('cartridgePath').value
                        };
                        vscode.postMessage({ command: 'save', profile: profileUpdate });
                    });

                    document.getElementById('cancel-btn').addEventListener('click', () => {
                        vscode.postMessage({ command: 'cancel' });
                    });
                </script>
            </body>
            </html>`;
    }
}
