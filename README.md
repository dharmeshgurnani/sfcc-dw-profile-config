# DW Profiles Extension for VS Code

Ever wanted to manage multiple `dw.json` profiles for your Salesforce Commerce Cloud (SFCC) projects (e.g., Development, Staging, Production) and switch between them easily? This extension allows you to maintain different SFCC connection details in named profiles and seamlessly apply them to your workspace's `dw.json` file.

## Key Features

- ✅ **Easy Profile Management** - Create, edit, apply, and delete multiple `dw.json` profiles via a dedicated Sidebar view or the Command Palette.
- ✅ **Private Profile Selections** - Profile definitions and workspace selections are stored in user settings (local to your machine), not shared with your team or committed to git.
- ✅ **Sidebar Integration** - A custom DW Profiles section in the Activity Bar to view and manage all your profiles at a glance.
- ✅ **Status Bar Integration** - Quick access to the active profile directly from the status bar, allowing fast switching between environments.
- ✅ **Visual Environment Indicators** - Instantly recognize which environment you are connected to. The status bar changes color based on the environment (e.g., Green for Development, Blue for Staging).
- ✅ **Auto-Detection** - Automatically detects your existing `dw.json` on startup and will prompt you to import it as a profile if it's not already defined.
- ✅ **Multi-Root Workspace Support** - Store different profile selections for each workspace folder.

## Usage

### Managing Profiles

Once you install the extension, you'll see a new "DW Profiles" icon in the Activity Bar. Click on it to open the Profiles view.

From here, you can:
- **Create a Profile:** Click the `+` icon or use the Command Palette `DW Profiles: Create Profile`.
- **Edit a Profile:** Hover over a profile and click the pencil icon.
- **Delete a Profile:** Hover over a profile and click the trash icon.
- **Apply a Profile:** Hover over a profile and click the checkmark icon, or click the current profile in the Status Bar to select a different one.

### Applying Profiles (Status Bar)

The extension adds an item to your Status Bar indicating your currently applied DW Profile. 

1. Click on the DW Profile indicator in the Status Bar.
2. A quick pick dropdown will appear showing all your configured profiles.
3. Select the desired profile (e.g., `Staging`).
4. The extension will automatically overwrite your workspace's `dw.json` with the connection details of the selected profile.
5. The Status Bar will update to show the newly selected profile.

### Visual Sync Indicators
If your applied profile has the name containing `Development` or `Staging`, the background color of the status bar item will reflect this, giving you an immediate visual cue of the environment you are currently targeting.

## Configuration

The extension stores your configured `.dw` profiles in your VS Code Global Settings.
You can manually edit them in your `settings.json`:

```json
{
  "dwProfiles.profiles": [
    {
      "name": "Development",
      "hostname": "development-xxx.demandware.net",
      "username": "myuser",
      "password": "mypassword",
      "code-version": "version1"
    },
    {
      "name": "Staging",
      "hostname": "staging-xxx.demandware.net",
      "username": "myuser",
      "password": "mypassword",
      "code-version": "version2"
    }
  ]
}
```

The selected profile for each workspace is stored independently to allow separate projects to use different profiles simultaneously.

## Issues and Feature Requests

If you encounter any bugs or have feature requests, please report them!
