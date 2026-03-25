"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DWJsonManager = void 0;
var vscode = require("vscode");
var fs = require("fs");
var path = require("path");
var DWJsonManager = /** @class */ (function () {
    function DWJsonManager() {
    }
    DWJsonManager.getWorkspaceUri = function () {
        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            return undefined;
        }
        return vscode.workspace.workspaceFolders[0].uri.toString();
    };
    DWJsonManager.getWorkspaceFsPath = function () {
        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            return undefined;
        }
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    };
    DWJsonManager.writeDWJson = function (profile) {
        var workspacePath = this.getWorkspaceFsPath();
        if (!workspacePath) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }
        var dwJsonPath = path.join(workspacePath, 'dw.json');
        // Exclude the internally used 'name' property from the written dw.json
        var name = profile.name, configData = __rest(profile, ["name"]);
        var dwJsonContent = JSON.stringify(configData, null, 2);
        try {
            fs.writeFileSync(dwJsonPath, dwJsonContent, 'utf8');
            vscode.window.showInformationMessage("Applied profile '".concat(profile.name, "' to dw.json successfully."));
        }
        catch (error) {
            vscode.window.showErrorMessage("Failed to write dw.json: ".concat(error.message));
        }
    };
    return DWJsonManager;
}());
exports.DWJsonManager = DWJsonManager;
