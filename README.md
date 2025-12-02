# codesandbox-test

Created with CodeSandbox

## Random Interval Button Clicker Chrome Extension

This repository now includes a Chrome extension that repeatedly clicks a chosen button on the active page at random intervals between user-defined minimum and maximum values.

### Files

The extension lives in the [`extension/`](extension) directory:

- `manifest.json` – Extension manifest (Manifest V3).
- `content.js` – Injected into web pages to perform the automated clicking.
- `popup.html`, `popup.css`, `popup.js` – Popup UI for configuring the selector and interval.

### Usage

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `extension/` folder from this repository.
4. Open the popup from the extension icon, enter the CSS selector of the button to click, and provide the minimum/maximum interval values in milliseconds.
5. Press **Start** to begin random interval clicking. Use **Stop** to halt the automation.

> ⚠️ Use this tool responsibly and only on pages where automated interactions are permitted.
