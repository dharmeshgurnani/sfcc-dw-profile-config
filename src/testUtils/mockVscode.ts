import Module = require('module');

export interface MockWorkspaceFolder {
    uri: {
        fsPath: string;
        toString(): string;
    };
}

export interface MockStatusBarItem {
    text: string;
    tooltip?: string;
    backgroundColor?: { id: string };
    color?: { id: string };
    command?: string;
    visible: boolean;
    show(): void;
    hide(): void;
    dispose(): void;
}

export interface MockVscodeState {
    configuration: Record<string, unknown>;
    infoMessages: string[];
    errorMessages: string[];
    quickPickResult?: unknown;
    inputBoxResults: Array<string | undefined>;
    informationMessageResult?: string;
    workspaceFolders: MockWorkspaceFolder[];
    statusBarItems: MockStatusBarItem[];
}

const originalRequire = Module.prototype.require;

export function createMockState(overrides: Partial<MockVscodeState> = {}): MockVscodeState {
    return {
        configuration: {},
        infoMessages: [],
        errorMessages: [],
        inputBoxResults: [],
        workspaceFolders: [],
        statusBarItems: [],
        ...overrides
    };
}

export function installVscodeMock(state: MockVscodeState) {
    const disposable = { dispose() {} };

    class ThemeColor {
        constructor(public readonly id: string) {}
    }

    class ThemeIcon {
        constructor(public readonly id: string) {}
    }

    class TreeItem {
        public tooltip?: string;
        public description?: string;
        public contextValue?: string;
        public iconPath?: unknown;

        constructor(
            public readonly label: string,
            public readonly collapsibleState: number
        ) {}
    }

    class EventEmitter<T> {
        public readonly event = () => disposable;
        public fire(_value?: T) {}
        public dispose() {}
    }

    const vscodeMock = {
        ConfigurationTarget: {
            Global: 1
        },
        StatusBarAlignment: {
            Right: 2
        },
        TreeItemCollapsibleState: {
            None: 0
        },
        ThemeColor,
        ThemeIcon,
        TreeItem,
        EventEmitter,
        workspace: {
            workspaceFolders: state.workspaceFolders,
            getConfiguration: () => ({
                get: <T>(key: string) => state.configuration[key] as T,
                update: async (key: string, value: unknown) => {
                    state.configuration[key] = value;
                }
            }),
            createFileSystemWatcher: () => ({
                onDidChange: () => disposable,
                onDidCreate: () => disposable,
                dispose() {}
            }),
            onDidChangeConfiguration: () => disposable,
            onDidChangeWorkspaceFolders: () => disposable
        },
        window: {
            activeTextEditor: undefined,
            createStatusBarItem: () => {
                const item: MockStatusBarItem = {
                    text: '',
                    visible: false,
                    show() {
                        this.visible = true;
                    },
                    hide() {
                        this.visible = false;
                    },
                    dispose() {}
                };
                state.statusBarItems.push(item);
                return item;
            },
            showInformationMessage: async (message: string, ...items: string[]) => {
                state.infoMessages.push(message);
                if (state.informationMessageResult !== undefined) {
                    return state.informationMessageResult;
                }
                return items[0];
            },
            showErrorMessage: async (message: string) => {
                state.errorMessages.push(message);
                return undefined;
            }
        },
        commands: {
            registerCommand: () => disposable
        }
    };

    Module.prototype.require = function patchedRequire(this: unknown, id: string) {
        if (id === 'vscode') {
            return vscodeMock;
        }
        return originalRequire.apply(this, arguments as unknown as [string]);
    };

    return {
        vscodeMock,
        restore() {
            Module.prototype.require = originalRequire;
        }
    };
}

export function clearModuleCache(modulePaths: string[]) {
    for (const modulePath of modulePaths) {
        const resolved = require.resolve(modulePath);
        delete require.cache[resolved];
    }
}
