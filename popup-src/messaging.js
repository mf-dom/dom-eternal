(function createChannel() {
	//Create a port with background page for continous message communication
	var port = chrome.extension.connect({
			name: "General"
	});

	// Listen to messages from the background page
	// port.onMessage.addListener(function (message) {
	// 	port.postMessage(message);
	// });

}());

// This sends an object to the background page
// where it can be relayed to the inspected page
function sendObjectFromDevTools(message) {
	message.tabId = chrome.devtools.inspectedWindow.tabId;
	chrome.extension.sendMessage(message);
}

function sendObjectFromPopup(message) {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			message.tabId = tabs[0].id;
			chrome.extension.sendMessage(message);
	});
}

document.title = "DOM Eternal";
