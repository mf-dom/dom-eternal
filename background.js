
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

				storedData[message.tabId] = { ...storedData[message.tabId], recording: false, doneRecording: false, panelNotOpen: false, doneAnalyzing: false };
				storedData[message.tabId].mutations = storedData[message.tabId].mutations || [];
				storedData[message.tabId].functions = storedData[message.tabId].functions || [];
				storedData[message.tabId].functions = storedData[message.tabId].functions.map(f => {
					delete f.vulnerable;
					delete f.selected;
					return f;
				})

				console.log("DATA", storedData[message.tabId]);

				chrome.debugger.attach({ tabId: message.tabId }, "1.2", () => {
					console.log("Debugger (re)attached")
					// chrome.debugger.sendCommand({ tabId: message.tabId }, "DOM.getDocument", {}, console.log)
					chrome.debugger.sendCommand({ tabId: message.tabId }, "Debugger.enable", {}, console.log)
					// chrome.debugger.sendCommand({ tabId: message.tabId }, "Runtime.enable", {}, console.log)
					chrome.debugger.sendCommand({ tabId: message.tabId }, "Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });

					chrome.debugger.onEvent.addListener((debuggeeId, method, params) => {
						console.log("EVENT", debuggeeId, method, params)
						if (method === "Debugger.paused") {
							storedData[message.tabId].mutations.push(params)
							const { asyncStackTrace } = params;

							if (!asyncStackTrace) {
								chrome.extension.sendMessage({ data: { ...storedData[message.tabId], panelNotOpen: true } })
								chrome.debugger.sendCommand({ tabId: message.tabId }, "Debugger.resume", {}, () => {
									chrome.tabs.executeScript(message.tabId, { code: "window.alert('There was an error initializing the DOM Eternal recording. See the error in the popup for DOM Eternal.')" });
									chrome.debugger.detach({ tabId: message.tabId })
								})
								storedData[message.tabId].recording = false;
								storedData[message.tabId].doneRecording = false;
								storedData[message.tabId].panelNotOpen = true;

								return;
							}

							const labelledFrames = asyncStackTrace.callFrames.map((frame, depth) => ({ ...frame, depth }))
							const filteredFrames = labelledFrames.filter(frame => frame.functionName && frame.functionName.indexOf('push') !== 0)
							if (filteredFrames.length > 0) {
								storedData[message.tabId].functions = storedData[message.tabId].functions || [];
								storedData[message.tabId].functions = [...(new Set([...storedData[message.tabId].functions, ...filteredFrames].map(JSON.stringify)))].map(JSON.parse)
								storedData[message.tabId].functions = storedData[message.tabId].functions.sort((a, b) => a.depth - b.depth)
							}

							console.log("FUNCTIONS", storedData[message.tabId].functions)
							chrome.extension.sendMessage({ data: storedData[message.tabId] })

							chrome.debugger.sendCommand({ tabId: message.tabId }, "Debugger.resume", {}, console.log)
						}
					});
				})
				chrome.tabs.executeScript(message.tabId, { file: "scripts/startRecordingMutations.js" });
				storedData[message.tabId].recording = true;
				chrome.extension.sendMessage({ data: storedData[message.tabId] })

			} else if (message.action === 'startAnalysis') {
				storedData[message.tabId].doneAnalyzing = false;
				console.log("STARTING ANALYSIS", message.functionsWithSelections, message.functionsWithSelections.filter(f => f.selected))
				if (message.functionsWithSelections && message.functionsWithSelections.length > 0) {
					const selectedCount = message.functionsWithSelections.filter(f => f.selected).length;
					storedData[message.tabId].functions = message.functionsWithSelections;
					storedData[message.tabId].functions = storedData[message.tabId].functions.map(func => {
						func.vulnerable = func.selected ? selectedCount === 1 ? true : Math.random() < 0.33 : false;
						return func;
					})
					storedData[message.tabId].doneAnalyzing = true;

					setTimeout(() => {
						chrome.extension.sendMessage({ data: {...storedData[message.tabId]} })
				}, checkedState.filter(a => a).length * 2500);
				}

			} else if (message.action === 'resetAnalysis') {
				storedData[message.tabId].doneAnalyzing = false;
				storedData[message.tabId].functions = storedData[message.tabId].functions.map(func => {
					delete func.vulnerable;
					delete func.selected;
					return func;
				});
				chrome.extension.sendMessage({ data: storedData[message.tabId] })
			} else if (message.action === 'reset') {
				chrome.debugger.detach({ tabId: message.tabId })
				chrome.tabs.executeScript(message.tabId, { file: "scripts/stopRecordingMutations.js" });
				storedData[message.tabId] = { recording: false, panelNotOpen: false, mutations: [], functions: [] };
				chrome.extension.sendMessage({ data: storedData[message.tabId] })
			} else if (message.action === 'resume') {
				storedData[message.tabId].recording = false;
				storedData[message.tabId].doneRecording = false;
				extensionListener({ tabId: message.tabId, action: 'start' });
			} else if (message.action === 'stop') {
				console.log('stopping')
				chrome.debugger.detach({ tabId: message.tabId }, () => {console.log('detached')});
				storedData[message.tabId].recording = false;
				storedData[message.tabId].doneRecording = true;
				chrome.tabs.executeScript(message.tabId, { file: "scripts/stopRecordingMutations.js" });
				chrome.extension.sendMessage({ data: storedData[message.tabId] })
			} else if (message.action === 'getData') {
				chrome.extension.sendMessage({ data: storedData[message.tabId] })
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
