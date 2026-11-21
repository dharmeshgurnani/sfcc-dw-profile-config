import test = require('node:test');
import assert = require('node:assert/strict');
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { clearModuleCache, createMockState, installVscodeMock } from './testUtils/mockVscode';

function createWorkspaceFolder(rootPath: string) {
    return {
        uri: {
            fsPath: rootPath,
            toString: () => `file://${rootPath.replace(/\\/g, '/')}`
        }
    };
}

test('Config reads and writes profile settings', async () => {
    const state = createMockState({
        configuration: {
            profiles: [{ name: 'Sandbox A', hostname: 'sandbox-a.demandware.net' }],
            workspaceProfileSelections: {},
            statusBarFormat: 'compact'
        }
    });

    const { restore } = installVscodeMock(state);
    clearModuleCache(['../config']);

    try {
        const { Config } = require('./config') as typeof import('./config');

        assert.deepEqual(Config.getProfiles(), [{ name: 'Sandbox A', hostname: 'sandbox-a.demandware.net' }]);
        assert.equal(Config.getStatusBarFormat(), 'compact');

        await Config.saveProfiles([{ name: 'Sandbox B', hostname: 'sandbox-b.demandware.net' }]);
        await Config.saveWorkspaceProfileSelection('file://workspace', 'Sandbox B');

        assert.deepEqual(state.configuration.profiles, [{ name: 'Sandbox B', hostname: 'sandbox-b.demandware.net' }]);
        assert.deepEqual(state.configuration.workspaceProfileSelections, { 'file://workspace': 'Sandbox B' });
    } finally {
        restore();
        clearModuleCache(['../config']);
    }
});

test('DWJsonManager writes dw.json without persisting profile name', async () => {
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dw-profiles-test-'));
    const state = createMockState({
        workspaceFolders: [createWorkspaceFolder(workspaceRoot)]
    });

    const { restore } = installVscodeMock(state);
    clearModuleCache(['../dwJson']);

    try {
        const { DWJsonManager } = require('./dwJson') as typeof import('./dwJson');

        DWJsonManager.writeDWJson({
            name: 'Sandbox A',
            hostname: 'sandbox-a.demandware.net',
            username: 'user@example.com',
            password: 'secret',
            'code-version': 'version1',
            cartridgePath: 'app_storefront_base:int_custom'
        });

        const fileContent = fs.readFileSync(path.join(workspaceRoot, 'dw.json'), 'utf8');
        const writtenConfig = JSON.parse(fileContent);

        assert.equal(writtenConfig.name, undefined);
        assert.equal(writtenConfig.hostname, 'sandbox-a.demandware.net');
        assert.equal(writtenConfig.cartridgePath, 'app_storefront_base:int_custom');
        assert.match(state.infoMessages[0] ?? '', /Applied profile 'Sandbox A'/);

        await new Promise(resolve => setTimeout(resolve, 550));
        assert.equal(DWJsonManager.isInternalWriting, false);
        assert.deepEqual(DWJsonManager.readDWJson(), writtenConfig);
    } finally {
        restore();
        clearModuleCache(['../dwJson']);
        fs.rmSync(workspaceRoot, { recursive: true, force: true });
    }
});

test('StatusBarManager reflects the selected profile for the active workspace', () => {
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dw-profiles-status-'));
    const workspaceUri = `file://${workspaceRoot.replace(/\\/g, '/')}`;
    const state = createMockState({
        configuration: {
            workspaceProfileSelections: {},
            statusBarFormat: 'full'
        },
        workspaceFolders: [createWorkspaceFolder(workspaceRoot)]
    });

    const { restore } = installVscodeMock(state);
    clearModuleCache(['../config', '../dwJson', '../statusBar']);

    try {
        const { StatusBarManager } = require('./statusBar') as typeof import('./statusBar');

        StatusBarManager.initialize({ subscriptions: [] } as unknown as import('vscode').ExtensionContext);

        const item = state.statusBarItems[0];
        assert.equal(item.visible, true);
        assert.equal(item.text, '$(cloud) DW: Pick Profile');
        assert.equal(item.backgroundColor?.id, 'statusBarItem.warningBackground');

        state.configuration.workspaceProfileSelections = { [workspaceUri]: 'Sandbox A' };
        StatusBarManager.update();

        assert.equal(item.text, '$(cloud) DW > Sandbox A');
        assert.equal(item.tooltip, 'Currently using DW Profile: Sandbox A');
        assert.equal(item.backgroundColor, undefined);
    } finally {
        restore();
        clearModuleCache(['../config', '../dwJson', '../statusBar']);
        fs.rmSync(workspaceRoot, { recursive: true, force: true });
    }
});

test('DWProfileTreeItem chooses icons from hostname keywords', () => {
    const state = createMockState();
    const { restore } = installVscodeMock(state);
    clearModuleCache(['../treeDataProvider']);

    try {
        const { DWProfileTreeItem } = require('./treeDataProvider') as typeof import('./treeDataProvider');

        const development = new DWProfileTreeItem(
            { name: 'Dev', hostname: 'development-01.demandware.net' },
            0
        );
        const fallback = new DWProfileTreeItem(
            { name: 'Custom', hostname: 'sandbox-01.demandware.net' },
            0
        );

        assert.equal((development.iconPath as { id: string }).id, 'tools');
        assert.equal((fallback.iconPath as { id: string }).id, 'cloud');
    } finally {
        restore();
        clearModuleCache(['../treeDataProvider']);
    }
});

test('escapeHtml escapes characters that could break out of HTML attributes', () => {
    const state = createMockState();
    const { restore } = installVscodeMock(state);
    clearModuleCache(['../editWebview']);

    try {
        const { escapeHtml } = require('./editWebview') as typeof import('./editWebview');

        assert.equal(escapeHtml(`"><script>alert('x')</script>&`), '&quot;&gt;&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;&amp;');
        assert.equal(escapeHtml(undefined), '');
        assert.equal(escapeHtml(null), '');
    } finally {
        restore();
        clearModuleCache(['../editWebview']);
    }
});
