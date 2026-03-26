export interface DWProfile {
    name: string;
    hostname?: string;
    username?: string;
    password?: string;
    "code-version"?: string;
    cartridge?: string[];
    cartridgePath?: string;
    [key: string]: any;
}

export interface WorkspaceSelection {
    [workspaceUri: string]: string;
}
