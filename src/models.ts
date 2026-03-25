export interface DWProfile {
    name: string;
    hostname?: string;
    username?: string;
    password?: string;
    "code-version"?: string;
}

export interface WorkspaceSelection {
    [workspaceUri: string]: string;
}
