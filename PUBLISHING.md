# Publishing AutoTailor CLI

This guide covers how to publish AutoTailor to npm and alternative installation methods.

---

## Table of Contents

1. [Publish to npm (Public)](#publish-to-npm-public)
2. [Publish to npm (Private/Scoped)](#publish-to-npm-privatescoped)
3. [Install Locally (Without Publishing)](#install-locally-without-publishing)
4. [Install from GitHub](#install-from-github)
5. [Distribution Options](#distribution-options)

---

## Publish to npm (Public)

This allows anyone to install your CLI globally with `npm install -g autotailor`.

### Prerequisites

1. **npm account** - Create at [npmjs.com](https://www.npmjs.com/signup)
2. **Unique package name** - Check availability at npmjs.com
3. **GitHub repository** (recommended)

### Step 1: Update package.json

The package.json is already configured, but update these fields:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/autotailor.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/autotailor/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/autotailor#readme"
}
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2: Check Package Name Availability

```bash
npm search autotailor
```

If the name is taken, choose a different name:
- `@yourusername/autotailor` (scoped package)
- `autotailor-cli`
- `cv-autotailor`

Update `name` in package.json if needed.

### Step 3: Login to npm

```bash
npm login
```

Enter your npm credentials.

### Step 4: Build and Test

```bash
# Build the project
npm run build

# Test locally first
npm link
autotailor --help

# Unlink after testing
npm unlink -g autotailor
```

### Step 5: Publish

```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish for real
npm publish
```

**Success!** Your package is now live at `https://npmjs.com/package/autotailor`

### Step 6: Install and Test

```bash
# Install globally
npm install -g autotailor

# Test it works
autotailor

# Create .env file
cd ~
mkdir .autotailor
cd .autotailor
# Add your .env file here

# Or use anywhere with .env in current directory
autotailor
```

### Publishing Updates

When you make changes:

```bash
# Update version (choose one)
npm version patch  # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor  # 1.0.0 -> 1.1.0 (new features)
npm version major  # 1.0.0 -> 2.0.0 (breaking changes)

# Publish update
npm publish
```

---

## Publish to npm (Private/Scoped)

For private use or organization packages.

### Step 1: Use Scoped Package Name

Update package.json:

```json
{
  "name": "@yourusername/autotailor",
  "private": false
}
```

### Step 2: Publish

```bash
# Public scoped package (free)
npm publish --access public

# Private scoped package (requires paid npm account)
npm publish --access restricted
```

### Installation

```bash
npm install -g @yourusername/autotailor
```

---

## Install Locally (Without Publishing)

For personal use without publishing to npm.

### Option A: Global Link

```bash
# In project directory
npm run build
npm link

# Now use anywhere
autotailor
```

**Pros:** Works globally like npm package
**Cons:** Linked to source code, not a real install

### Option B: Global Install from Directory

```bash
# Build first
npm run build

# Install globally from local directory
npm install -g .

# Use it
autotailor
```

**Pros:** Real installation, independent of source
**Cons:** Need to reinstall after updates

### Option C: npx (No Install)

```bash
# Run directly without installing
npx -p /path/to/autotailor autotailor
```

---

## Install from GitHub

Share your tool via GitHub without publishing to npm.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/autotailor.git
git push -u origin main
```

### Step 2: Users Install from GitHub

```bash
# Install directly from GitHub
npm install -g github:YOUR_USERNAME/autotailor

# Or with specific branch/tag
npm install -g github:YOUR_USERNAME/autotailor#main
npm install -g github:YOUR_USERNAME/autotailor#v1.0.0
```

**Pros:** Free, easy sharing, version control
**Cons:** Requires GitHub access, not on npm registry

---

## Distribution Options

### 1. **npm (Public)** ⭐ Recommended

**Best for:** Sharing with the world

```bash
npm publish
```

**Install:**
```bash
npm install -g autotailor
```

**Pros:**
- Easy discovery
- Automatic updates
- Professional distribution
- Version management

**Cons:**
- Name must be unique
- Public by default

---

### 2. **npm (Scoped/Private)**

**Best for:** Organizations or personal namespace

```bash
npm publish --access public
```

**Install:**
```bash
npm install -g @yourusername/autotailor
```

**Pros:**
- Own namespace
- Can be private (paid)
- Professional

**Cons:**
- More verbose name
- Private requires paid account

---

### 3. **GitHub + npm install**

**Best for:** Open source without npm

**Install:**
```bash
npm install -g github:yourusername/autotailor
```

**Pros:**
- Free
- Version control
- Easy sharing with team

**Cons:**
- Not searchable on npm
- Requires GitHub access

---

### 4. **Local Installation**

**Best for:** Personal use only

```bash
npm link
```

**Pros:**
- No publishing needed
- Quick development

**Cons:**
- Only works on your machine
- Manual setup on each machine

---

### 5. **Binary Distribution**

**Best for:** Non-technical users

Use [pkg](https://github.com/vercel/pkg) to create executables:

```bash
npm install -g pkg

# Create binaries
pkg . --targets node16-macos-x64,node16-linux-x64,node16-win-x64
```

**Pros:**
- No Node.js required for users
- Single executable file
- Easy distribution

**Cons:**
- Large file size
- Need to build for each platform

---

## Pre-Publish Checklist

Before publishing to npm:

- [ ] Update `repository` URL in package.json
- [ ] Check package name is available
- [ ] Add/update LICENSE file
- [ ] Update README with installation instructions
- [ ] Test CLI locally with `npm link`
- [ ] Check what will be published: `npm publish --dry-run`
- [ ] Build project: `npm run build`
- [ ] Test in clean environment
- [ ] Tag release in git: `git tag v1.0.0`
- [ ] Push to GitHub: `git push --tags`
- [ ] Publish: `npm publish`

---

## Post-Publish

After publishing:

1. **Test Installation**
   ```bash
   npm install -g autotailor
   autotailor --version
   ```

2. **Update README**
   Add installation instructions:
   ```markdown
   ## Installation

   ```bash
   npm install -g autotailor
   ```
   ```

3. **Create GitHub Release**
   - Go to GitHub → Releases → New Release
   - Tag version: v1.0.0
   - Add release notes

4. **Share**
   - Tweet about it
   - Post on Reddit
   - Share on LinkedIn

---

## Maintenance

### Updating the Package

```bash
# Make changes
# Test locally
npm run build
npm link
autotailor

# Update version
npm version patch  # or minor/major

# Publish update
npm publish

# Push to GitHub
git push && git push --tags
```

### Deprecating a Version

```bash
npm deprecate autotailor@1.0.0 "Critical bug, use 1.0.1+"
```

### Unpublishing (use carefully!)

```bash
# Can only unpublish within 72 hours
npm unpublish autotailor@1.0.0

# Unpublish entire package (dangerous!)
npm unpublish autotailor --force
```

---

## Recommended Workflow

### For Public Release:

1. ✅ Publish to npm (public)
2. ✅ Host on GitHub
3. ✅ Create releases with changelogs
4. ✅ Keep README updated

### For Personal/Team Use:

1. ✅ Host on GitHub (private)
2. ✅ Install with `npm install -g github:user/repo`
3. ✅ Or use `npm link` for development

### For Distribution to Non-Developers:

1. ✅ Publish to npm
2. ✅ Create binary executables with `pkg`
3. ✅ Provide download links

---

## Quick Reference

```bash
# Check what will be published
npm pack --dry-run

# Publish to npm
npm publish

# Install globally
npm install -g autotailor

# Link locally for development
npm link

# Install from GitHub
npm install -g github:user/autotailor

# Update version
npm version patch

# View package info
npm info autotailor
```

---

## Support

- **npm docs**: https://docs.npmjs.com/
- **Publishing guide**: https://docs.npmjs.com/cli/v9/commands/npm-publish
- **Scoped packages**: https://docs.npmjs.com/about-scopes

---

**Ready to publish? Choose your distribution method and go for it!** 🚀
