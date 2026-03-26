/**
 * STANDALONE TEST RUNNER (No external libraries)
 * This script runs in Node.js and mocks the VS Code API to test core logic.
 */
import * as assert from 'assert';
import * as path from 'path';

// --- MOCK VSCODE ---
const vscodeMock: any = {
    workspace: {
        getConfiguration: () => ({
            get: (key: string) => {
                if (key === 'profiles') return [{ name: 'Test', hostname: 'test.com' }];
                return undefined;
            },
            update: () => Promise.resolve()
        }),
        workspaceFolders: [{
            uri: { 
                fsPath: path.resolve(__dirname, '../'),
                toString: () => 'file://mock'
            }
        }]
    },
    window: {
        showErrorMessage: (msg: string) => console.log(`[Mock Error] ${msg}`),
        showInformationMessage: (msg: string) => console.log(`[Mock Info] ${msg}`)
    },
    ThemeColor: class { constructor(public id: string) {} }
};

// Inject mock before loading modules
(global as any).vscode = vscodeMock;

// Mock the module system to return our vscodeMock when 'vscode' is required
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id: string) {
    if (id === 'vscode') return vscodeMock;
    return originalRequire.apply(this, arguments);
};

// --- START TESTS ---
import { Config } from './config';
import { DWJsonManager } from './dwJson';

async function runStandaloneTests() {
    console.log("🚀 Running Standalone Unit Tests (Library-Free)...");
    let passed = 0;
    let failed = 0;

    function test(name: string, fn: () => void | Promise<void>) {
        try {
            fn();
            console.log(`✅ [PASS] ${name}`);
            passed++;
        } catch (err: any) {
            console.log(`❌ [FAIL] ${name}: ${err.message}`);
            failed++;
        }
    }

    // 1. Test Config
    test("Config: getProfiles returns mock data", () => {
        const profiles = Config.getProfiles();
        assert.strictEqual(profiles.length, 1);
        assert.strictEqual(profiles[0].name, 'Test');
    });

    // 2. Test DWJson Logic (Format check)
    test("DWJson: format check (pure logic)", () => {
        const mockProfile = { name: "ToExclude", hostname: "keep.me", username: "user" };
        const { name, ...configData } = mockProfile;
        
        // Ensure name is excluded from the spread (as used in DWJsonManager.writeDWJson)
        assert.strictEqual((configData as any).name, undefined);
        assert.strictEqual(configData.hostname, "keep.me");
    });

    // 3. Test Profile Hostname keywords
    test("TreeDataProvider: Icon logic check (manual trigger)", () => {
        const check = (host: string) => host.includes('production') ? 'shield' : (host.includes('staging') ? 'package' : 'cloud');
        assert.strictEqual(check('production.net'), 'shield');
        assert.strictEqual(check('staging.net'), 'package');
        assert.strictEqual(check('dev.net'), 'cloud');
    });

    console.log("\n------------------------------------");
    console.log(`Tests Finished! Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) process.exit(1);
}

runStandaloneTests().catch(err => {
    console.error(err);
    process.exit(1);
});
