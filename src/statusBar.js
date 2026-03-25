"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBarManager = void 0;
var vscode = require("vscode");
var config_1 = require("./config");
var dwJson_1 = require("./dwJson");
var StatusBarManager = /** @class */ (function () {
    function StatusBarManager() {
    }
    StatusBarManager.initialize = function (context) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'dw-profiles.pickProfile';
        context.subscriptions.push(this.statusBarItem);
        this.update();
    };
    StatusBarManager.update = function () {
        var workspaceUri = dwJson_1.DWJsonManager.getWorkspaceUri();
        if (!workspaceUri) {
            this.statusBarItem.hide();
            return;
        }
        var selections = config_1.Config.getWorkspaceProfileSelections();
        var selectedProfileName = selections[workspaceUri];
        if (!selectedProfileName) {
            this.statusBarItem.text = "$(cloud) DW: Pick Profile";
            this.statusBarItem.tooltip = 'Click to select a DW profile';
        }
        else {
            var format = config_1.Config.getStatusBarFormat();
            var text = format === 'full' ? "$(cloud) DW > ".concat(selectedProfileName) : "$(cloud) ".concat(selectedProfileName);
            this.statusBarItem.text = text;
            this.statusBarItem.tooltip = "Currently using DW Profile: ".concat(selectedProfileName);
        }
        this.statusBarItem.show();
    };
    return StatusBarManager;
}());
exports.StatusBarManager = StatusBarManager;
