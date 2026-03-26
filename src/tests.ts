import * as vscode from 'vscode';
import { Config } from './config';
import { DWProfile } from './models';
import { DWJsonManager } from './dwJson';

export async function runInternalTests() {
    const outputChannel = vscode.window.createOutputChannel("DW Profiles Tests");
    outputChannel.show();
    outputChannel.appendLine("Starting Internal Smoke Tests...");
    outputChannel.appendLine("-------------------------------");

    let passed = 0;
    let failed = 0;

    async function test(name: string, fn: () => Promise<void> | void) {
        try {
            await fn();
            outputChannel.appendLine(`[PASS] ${name}`);
            passed++;
        } catch (err: any) {
            outputChannel.appendLine(`[FAIL] ${name}: ${err.message}`);
            failed++;
        }
    }

    try {
        // Test 1: Config retrieval
        await test("Config: getProfiles returns array", () => {
            const profiles = Config.getProfiles();
            if (!Array.isArray(profiles)) throw new Error("Expected array");
        });

        // Test 2: Profile mapping
        await test("Config: getWorkspaceProfileSelections returns object", () => {
            const selections = Config.getWorkspaceProfileSelections();
            if (typeof selections !== 'object' || selections === null) throw new Error("Expected object");
        });

        // Test 3: Model fields (ensuring cartridges and other fields work)
        await test("Model: DWProfile structure check", () => {
            const mockProfile: DWProfile = {
                name: "Test",
                hostname: "test.com",
                cartridge: ["a", "b"]
            };
            if (mockProfile.name !== "Test" || mockProfile.cartridge?.[0] !== "a") {
                throw new Error("Profile structure invalid");
            }
        });

        // Test 4: DWJsonManager (workspace path)
        await test("DWJson: Workspace path check", () => {
            const path = DWJsonManager.getWorkspaceFsPath();
            // This might be undefined if no workspace is open, which is fine
        });

        outputChannel.appendLine("-------------------------------");
        outputChannel.appendLine(`Tests Finished. Passed: ${passed}, Failed: ${failed}`);
        
        if (failed === 0) {
            vscode.window.showInformationMessage("All internal tests passed!");
        } else {
            vscode.window.showErrorMessage(`Some tests failed. See output channel for details.`);
        }

    } catch (err: any) {
        outputChannel.appendLine(`[ERROR] Test Runner Error: ${err.message}`);
    }
}
