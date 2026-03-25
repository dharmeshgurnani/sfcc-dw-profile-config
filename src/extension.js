"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
var vscode = require("vscode");
var commands_1 = require("./commands");
var statusBar_1 = require("./statusBar");
function activate(context) {
    console.log('DW Profiles extension activated');
    statusBar_1.StatusBarManager.initialize(context);
    context.subscriptions.push(vscode.commands.registerCommand('dw-profiles.pickProfile', commands_1.pickProfile));
    context.subscriptions.push(vscode.commands.registerCommand('dw-profiles.createProfile', commands_1.createProfile));
    context.subscriptions.push(vscode.commands.registerCommand('dw-profiles.editProfile', commands_1.editProfile));
    context.subscriptions.push(vscode.commands.registerCommand('dw-profiles.deleteProfile', commands_1.deleteProfile));
    vscode.workspace.onDidChangeConfiguration(function (e) {
        if (e.affectsConfiguration('dwProfiles')) {
            statusBar_1.StatusBarManager.update();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeWorkspaceFolders(function (e) {
        statusBar_1.StatusBarManager.update();
    }, null, context.subscriptions);
}
function deactivate() { }
