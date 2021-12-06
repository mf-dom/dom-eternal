
// chrome.devtools.panels.create("MF-DOM",
// "../assets/tmp_logo16.png",
// "index.html",
// function(panel) {
//     // code invoked on panel creation
//     panel.set
//   }
// );

// chrome.devtools.panels.elements.createSidebarPane("My Sidebar",
// function(sidebar) {
//     // sidebar initialization code here
//     sidebar.setPage("panel.html")
// });

const storedData = {};

chrome.extension.onConnect.addListener(function (port) {

	var extensionListener = function (message, sender, sendResponse) {
		console.log(message, sender, sendResponse);

		if (message.tabId) {
			if (message.action === 'start') {
				if (storedData[message.tabId] && storedData[message.tabId].recording) return;

        storedData[message.tabId] = {...storedData, mutations: [], recording: false};
				chrome.debugger.attach({tabId: message.tabId}, "1.2", () => {
					console.log("Debugger (re)attached")
					chrome.debugger.sendCommand({tabId: message.tabId}, "DOM.getDocument", {}, console.log)
					chrome.debugger.sendCommand({tabId: message.tabId}, "Debugger.enable", {}, console.log)
					chrome.debugger.sendCommand({tabId: message.tabId}, "Runtime.enable", {}, console.log)

					chrome.debugger.onEvent.addListener((debuggeeId, method, params) => {
						console.log("EVENT", debuggeeId, method, params)
						if (method === "Debugger.paused") {
							console.table(params)
							storedData[message.tabId].mutations.push(params)
							chrome.debugger.sendCommand({tabId: message.tabId}, "Debugger.resume", {}, console.log)
						}
					});
				})
				chrome.tabs.executeScript(message.tabId, { file: "scripts/startRecordingMutations.js" });
				storedData[message.tabId].recording = true;

			} else if (message.action === 'startAnalysis') {


			} else if (message.action === 'stop') {
				console.log('stopping')
				chrome.debugger.sendCommand({tabId: message.tabId}, "Network.emulateNetworkConditions", {offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0}, (result) => {
					console.log("For safety, network connections have been disabled", result)
				});
				storedData[message.tabId].recording = false;
				chrome.tabs.executeScript(message.tabId, { file: "scripts/stopRecordingMutations.js" });
				console.log(storedData)
			} else if (message.action === 'getData') {
				chrome.extension.sendMessage({data: storedData[message.tabId]})
			} else {
				console.log(message, sender, sendResponse)
				//Pass message to inspectedPage
				// chrome.tabs.executeScript(message.tabId, { file: message.content });
				// chrome.tabs.sendMessage(message.tabId, message, sendResponse);
			}

		} else {
			// port.postMessage(message);
		}
	}

	// Listens to messages sent from the panel
	chrome.extension.onMessage.addListener(extensionListener);

	port.onDisconnect.addListener(function (port) {
		chrome.extension.onMessage.removeListener(extensionListener);
	});

	// port.onMessage.addListener(function (message) {
	//     port.postMessage(message);
	// });

});
