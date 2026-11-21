

<p align="center">
  <img src="https://res.cloudinary.com/dt6cmsuoe/image/upload/v1775039208/icon_vok2gc.png" alt="DW Profiles icon" width="96" />
</p>

<h1 align="center">DW Profiles Extension for VS Code</h1>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=dharmeshgurnani.sfcc-dw-profile-config"><img src="https://img.shields.io/visual-studio-marketplace/v/dharmeshgurnani.sfcc-dw-profile-config" alt="Marketplace version" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=dharmeshgurnani.sfcc-dw-profile-config"><img src="https://img.shields.io/visual-studio-marketplace/i/dharmeshgurnani.sfcc-dw-profile-config" alt="Marketplace installs" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

![DW Profiles Extension for VS Code Banner](https://res.cloudinary.com/dt6cmsuoe/image/upload/v1775038487/dw_profiles_banner_qgns3k.png)

Ever wanted to manage multiple `dw.json` profiles for your Salesforce Commerce Cloud (SFCC) projects (e.g., Development and Sandbox environments) and switch between them easily? This extension allows you to maintain different SFCC connection details in named profiles and seamlessly apply them to your workspace's `dw.json` file.

## Key Features

- **Unified Profile Editor** - Edit all profile fields at once in a modern, full-form Webview instead of sequential prompts.
- **Environment-Specific Icons** - Instantly recognize your environment in the sidebar with icons based on the profile hostname (production, development, staging).
- **Extended dw.json Support** - Full support for `hostname`, `username`, `password`, `code-version`, plus `cartridge` and `cartridgePath` (Prophet compatible). Unknown fields are preserved on save.
- **Easy Profile Management** - Create, edit, apply, and delete multiple `dw.json` profiles via a dedicated Sidebar view or the Command Palette.
- **Profiles Live in User Settings** - Profile definitions (including passwords) and workspace selections are stored in your user `settings.json`, not in the repository. See [Where your credentials are stored](#where-your-credentials-are-stored).
- **Sidebar Integration** - A custom DW Profiles section in the Activity Bar to manage all your profiles at a glance with environment-specific icons.
- **Status Bar Integration** - Quick access to the active profile from the status bar for fast environment switching.
- **Per-Workspace Selection** - Each workspace remembers its own selected profile. In a multi-root workspace, `dw.json` is read from and written to the first workspace folder only.

## Install

- In VS Code, open the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`), search for **SFCC DW Profile Config**, and click **Install**.
- Or from a terminal:

  ```sh
  code --install-extension dharmeshgurnani.sfcc-dw-profile-config
  ```

## Usage

### Managing Profiles

![Manage Profile](https://res.cloudinary.com/dt6cmsuoe/image/upload/v1775039208/dw_profiles_manage_profiles_gzuglu.png)

Once you install the extension, you'll see a new "DW Profiles" icon in the Activity Bar. Click on it to open the Profiles view.

From here, you can:
- **Create a Profile:** Click the `+` icon or use the Command Palette `DW Profiles: Create Profile`.
- **Edit a Profile:** Hover over a profile and click the pencil icon.
- **Delete a Profile:** Hover over a profile and click the trash icon.
- **Apply a Profile:** Hover over a profile and click the checkmark icon, or click the current profile in the Status Bar to select a different one.

### Applying Profiles (Status Bar)

![Apply Profile](https://res.cloudinary.com/dt6cmsuoe/image/upload/v1775039208/dw_profiles_select_profile_tb5zd7.png)
The extension adds an item to your Status Bar indicating your currently applied DW Profile. 

1. Click on the DW Profile indicator in the Status Bar.
2. A quick pick dropdown will appear showing all your configured profiles.
3. Select the desired profile (e.g., `Sandbox`).
4. The extension will automatically overwrite your workspace's `dw.json` with the connection details of the selected profile.
5. The Status Bar will update to show the newly selected profile.

### Unified Profile Editor
When editing a profile, a modern Webview form opens, allowing you to update all fields (including cartridges and custom data) in one place.

### Environment-Specific Icons
The sidebar picks an icon from keywords in the profile's hostname (case-insensitive, checked in this order):
- hostname contains `production`: Shield (`$(shield)`)
- hostname contains `development`: Tools (`$(tools)`)
- hostname contains `staging`: Package (`$(package)`)
- anything else (including sandboxes): Cloud (`$(cloud)`)

## Configuration

The extension stores your configured `dw.json` profiles in your VS Code user (global) settings.
You can manually edit them in your user `settings.json`:

```json
{
  "dwProfiles.profiles": [
    {
      "name": "Development Sandbox 1",
      "hostname": "development-1-xxx.demandware.net",
      "username": "myuser",
      "password": "mypassword",
      "code-version": "version1"
    },
    {
      "name": "Development Sandbox 2",
      "hostname": "development-2-xxx.demandware.net",
      "username": "myuser",
      "password": "mypassword",
      "code-version": "version2"
    }
  ]
}
```

The selected profile for each workspace is stored independently to allow separate projects to use different profiles simultaneously.

The `dwProfiles.profiles` setting is application-scoped, so it can only be set in your user settings. A workspace's committed `.vscode/settings.json` cannot define or override profiles.

### Where your credentials are stored

Profiles, including passwords, are stored **in plain text** in your user VS Code `settings.json`. They are not written to your repository, except that applying a profile writes its values to the workspace's `dw.json`. Keep `dw.json` in your `.gitignore`.

If you use VS Code Settings Sync, your profiles (and their passwords) may be synced to your other machines along with the rest of your settings. Exclude `dwProfiles.profiles` via `settingsSync.ignoredSettings` if you do not want that.

## Example `dw.json`

See [`dw.json.example`](dw.json.example) for the fields the extension reads. Never commit your real `dw.json`: it holds sandbox credentials and is already in `.gitignore`.

## Support

This extension is free. If it saves you time, you can [sponsor its development on GitHub](https://github.com/sponsors/dharmeshgurnani).

- **Bugs and feature requests**: [open an issue](https://github.com/dharmeshgurnani/sfcc-dw-profile-config/issues). Pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).
- **Security issues**: please report privately, see [SECURITY.md](SECURITY.md).
- **Email**: [hello@dharmeshgurnani.com](mailto:hello@dharmeshgurnani.com)
- **Website**: [www.dharmeshgurnani.com](https://www.dharmeshgurnani.com/?utm_campaign=dw-profiles-extension&utm_source=vs-code-marketplace)

## License

[MIT](LICENSE) © Dharmesh Gurnani
