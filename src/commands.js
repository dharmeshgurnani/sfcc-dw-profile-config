"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickProfile = pickProfile;
exports.createProfile = createProfile;
exports.editProfile = editProfile;
exports.deleteProfile = deleteProfile;
var vscode = require("vscode");
var config_1 = require("./config");
var dwJson_1 = require("./dwJson");
var statusBar_1 = require("./statusBar");
function pickProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var profiles, items, selected, profile, workspaceUri;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profiles = config_1.Config.getProfiles();
                    if (profiles.length === 0) {
                        vscode.window.showInformationMessage('No DW Profiles found. Please create one first.');
                        return [2 /*return*/];
                    }
                    items = profiles.map(function (p) { return ({
                        label: p.name,
                        description: p.hostname || ''
                    }); });
                    return [4 /*yield*/, vscode.window.showQuickPick(items, {
                            placeHolder: 'Select a DW Profile'
                        })];
                case 1:
                    selected = _a.sent();
                    if (!selected) return [3 /*break*/, 3];
                    profile = profiles.find(function (p) { return p.name === selected.label; });
                    if (!profile) return [3 /*break*/, 3];
                    dwJson_1.DWJsonManager.writeDWJson(profile);
                    workspaceUri = dwJson_1.DWJsonManager.getWorkspaceUri();
                    if (!workspaceUri) return [3 /*break*/, 3];
                    return [4 /*yield*/, config_1.Config.saveWorkspaceProfileSelection(workspaceUri, profile.name)];
                case 2:
                    _a.sent();
                    statusBar_1.StatusBarManager.update();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var name, hostname, username, password, codeVersion, profiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Profile Name (e.g., Staging)' })];
                case 1:
                    name = _a.sent();
                    if (!name)
                        return [2 /*return*/];
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Hostname (e.g., development-xxx.demandware.net)' })];
                case 2:
                    hostname = _a.sent();
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Username' })];
                case 3:
                    username = _a.sent();
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Password', password: true })];
                case 4:
                    password = _a.sent();
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Code Version (default: version1)', value: 'version1' })];
                case 5:
                    codeVersion = _a.sent();
                    profiles = config_1.Config.getProfiles();
                    if (profiles.find(function (p) { return p.name === name; })) {
                        vscode.window.showErrorMessage("Profile '".concat(name, "' already exists."));
                        return [2 /*return*/];
                    }
                    profiles.push({
                        name: name,
                        hostname: hostname || undefined,
                        username: username || undefined,
                        password: password || undefined,
                        "code-version": codeVersion || undefined
                    });
                    return [4 /*yield*/, config_1.Config.saveProfiles(profiles)];
                case 6:
                    _a.sent();
                    vscode.window.showInformationMessage("DW Profile '".concat(name, "' created successfully."));
                    return [2 /*return*/];
            }
        });
    });
}
function editProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var profiles, items, selected, profileIndex, p, hostname, username, password, codeVersion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profiles = config_1.Config.getProfiles();
                    if (profiles.length === 0) {
                        vscode.window.showInformationMessage('No DW Profiles found.');
                        return [2 /*return*/];
                    }
                    items = profiles.map(function (p) { return ({ label: p.name, description: p.hostname || '' }); });
                    return [4 /*yield*/, vscode.window.showQuickPick(items, { placeHolder: 'Select a DW Profile to edit' })];
                case 1:
                    selected = _a.sent();
                    if (!selected) return [3 /*break*/, 7];
                    profileIndex = profiles.findIndex(function (p) { return p.name === selected.label; });
                    if (profileIndex === -1)
                        return [2 /*return*/];
                    p = profiles[profileIndex];
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Hostname', value: p.hostname })];
                case 2:
                    hostname = _a.sent();
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Username', value: p.username })];
                case 3:
                    username = _a.sent();
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Password', password: true, value: p.password })];
                case 4:
                    password = _a.sent();
                    return [4 /*yield*/, vscode.window.showInputBox({ prompt: 'Enter Code Version', value: p["code-version"] })];
                case 5:
                    codeVersion = _a.sent();
                    profiles[profileIndex] = {
                        name: p.name,
                        hostname: hostname || undefined,
                        username: username || undefined,
                        password: password || undefined,
                        "code-version": codeVersion || undefined
                    };
                    return [4 /*yield*/, config_1.Config.saveProfiles(profiles)];
                case 6:
                    _a.sent();
                    vscode.window.showInformationMessage("DW Profile '".concat(p.name, "' updated successfully."));
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function deleteProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var profiles, items, selected, updatedProfiles, workspaceUri, selections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profiles = config_1.Config.getProfiles();
                    if (profiles.length === 0) {
                        vscode.window.showInformationMessage('No DW Profiles found.');
                        return [2 /*return*/];
                    }
                    items = profiles.map(function (p) { return ({ label: p.name, description: p.hostname || '' }); });
                    return [4 /*yield*/, vscode.window.showQuickPick(items, { placeHolder: 'Select a DW Profile to delete' })];
                case 1:
                    selected = _a.sent();
                    if (!selected) return [3 /*break*/, 4];
                    updatedProfiles = profiles.filter(function (p) { return p.name !== selected.label; });
                    return [4 /*yield*/, config_1.Config.saveProfiles(updatedProfiles)];
                case 2:
                    _a.sent();
                    vscode.window.showInformationMessage("DW Profile '".concat(selected.label, "' deleted."));
                    workspaceUri = dwJson_1.DWJsonManager.getWorkspaceUri();
                    if (!workspaceUri) return [3 /*break*/, 4];
                    selections = config_1.Config.getWorkspaceProfileSelections();
                    if (!(selections[workspaceUri] === selected.label)) return [3 /*break*/, 4];
                    return [4 /*yield*/, config_1.Config.saveWorkspaceProfileSelection(workspaceUri, '')];
                case 3:
                    _a.sent();
                    statusBar_1.StatusBarManager.update();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
