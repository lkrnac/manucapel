# Manucap Desktop

Desktop application wrapper for the manucap library.

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## Building

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux

# Build for all platforms
npm run build:all
```

## Distribution

This project is configured for multi-platform distribution using electron-builder:

- **Windows**: NSIS installer (.exe), AppX (.appx)
- **macOS**: DMG (.dmg), ZIP (.zip)
- **Linux**: AppImage (.AppImage), DEB (.deb), RPM (.rpm)

### GitHub Releases

The release workflow automatically builds and creates GitHub releases when merging to main.

### Homebrew

To distribute via Homebrew, create a tap repository and add a formula:

```ruby
# Formula template for Homebrew
class Manucap < Formula
  desc "Desktop application for manucap"
  homepage "https://github.com/YOUR_ORG/manucap-desktop"
  url "https://github.com/YOUR_ORG/manucap-desktop/releases/download/v1.0.0/manucap-desktop-1.0.0-mac.zip"
  sha256 "..."
  license "MIT"

  def install
    bin.install "manucap-desktop"
  end
end
```

### Windows Package Manager (winget)

Create a manifest for winget-pkgs repository:

```yaml
# manifest.yaml
Id: YourOrg.Manucap
Version: 1.0.0
Name: Manucap
Publisher: YourOrg
License: MIT
Installers:
  - Architecture: x64
    InstallerUrl: https://github.com/YOUR_ORG/manucap-desktop/releases/download/v1.0.0/Manucap-1.0.0 Setup.exe
    InstallerType: nsis
```

### APT (Linux)

DEB packages are automatically built. For a dedicated APT repository, consider using:
- [Debian Repository](https://github.com/dear-github/debianizing-electron)
- Or host your own APT repo with reprepro

## Auto-Updates

The application uses electron-updater for automatic updates. Updates are downloaded from GitHub releases.

## Project Structure

```
├── electron/           # Electron main process
│   ├── main.ts       # Main process entry
│   └── preload.ts    # Preload script (IPC bridge)
├── src/              # React renderer
│   ├── store/        # Redux store
│   │   └── slices/  # Redux slices
│   ├── hooks/       # Custom React hooks
│   ├── App.tsx      # Main app component
│   └── main.tsx     # React entry point
├── build/            # Build resources (icons)
├── release/          # Built applications
└── .github/workflows/ # CI/CD workflows
```
