# DOM(Document Object Model) Eternal
---
An XSS fuzzer capable of detecting runtime XSS vulnerabilites.
# Installation

1. Clone the repository.
```
git clone https://github.com/mf-dom/dom-eternal.git
```
2. In Google Chrome, go to chrome://extensions.
3. Make sure "developer mode" is turned on
4. Click "Load unpacked" and find where you cloned the repository.
5. Choose the extension directory.
6. Done!

# Design
![System Architecture Diagram Picture](assets/system-diagram.png?raw=true "System Architecture")

## File Structure

```
dom-eternal/          # Root folder
|-extension/          # Chromium Extension Code
  |- assets/          # Assets shared by the DevTools, Popup, and the extension icons
  |- devtools-src/    # Source code for the DevTools panel
  |- popup-src/       # Popup source code.
  |- scripts/       # Scripts loaded to targets
  |- background.js    # Background script (instrumentation & backend)
|-js-input-generator/ # Source code for the JS input generator
  |- src/             # Webpack sources
  |- webpack-test/    # Webpack experimentation code
  |- cmake/           # CMake files
  |- inputgen.cpp     # Primary source
```

# "API" Specification

While this product doesn't have a formal API or specification, it does utilize what could be construed as an internal-only API, which is documented below.
Each "route" indicates the `message.action` of a message sent within the extension scope, with the direction indicating whether the message is intended for the clients or the background script, along with the input data schema and a short purpose of each "route".

| "Route" Name | Direction | Data Schema | Purpose |
|---|---|---|---|
| `"start"` | UI->BG | `{tabId: Number}` | Begins instrumentation & recording of interactions, periodically returns data to clients |
| `"startAnalysis"` | UI->BG | `{tabId: Number, functionsWithSelections: Array<Function>}` | Begins instrumentation and analysis, returns data upon completion |
| `"resetAnalysis"` | UI->BG | `{tabId: Number}` | Resets stored analysis data, allowing for future analysis |
| `"reset"` | UI->BG | `{tabId: Number}` | Resets all stored data for a tab, allowing for a clean re-evaluation |
| `"resume"` | UI->BG | `{tabId: Number}` | Resumes recording as from "start" without duplicated instrumentation |
| `"stop"` | UI->BG | `{tabId: Number}` | Stops recording & pauses instrumentation overhead |
| `"getData"` | UI->BG | `{tabId: Number}` | Requests an updated broadcast of data from the background script |
| `null` | BG->UI | `{<storedData>}` | Returns stored data from the background script to all listening clients (sent periodically and on demand) |

# Contribution Guide
Thank you for considering contributing to DOM Eternal!

See installation guide above to get started with a test environment, and refer to the file structure above to get an overview of where portions of the extension reside.

Potential future improvements include:
- Cross-browser capability (add a bundler to create WebExtension standard extension)
- Allow for a user-defined input schema for the input generation
- Allow for DOM & JS stack state save + restore
- Continue work tuning and improving the input generator

## Use a Consistent Coding Style

* 4 spaces for indentation rather than tabs
* You can try using `Shift`+`Alt`+`F` in VS Code for style unification

## License
By contributing, you agree that your contributions will be licensed under the [GPL-3.0 License](https://github.com/mf-dom/dom-eternal/blob/main/LICENSE).


# Privacy Policy

We don't store your data, period.

We physcially can't. We have nowhere to store it. We don't even have a server to store it.
DOM Eternal operates locally with no connections to any servers.
