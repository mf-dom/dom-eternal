
chrome.devtools.panels.create("MF-DOM",
"../assets/tmp_logo16.png",
"index.html",
function(panel) {
    // code invoked on panel creation
    panel.set
  }
);

chrome.devtools.panels.elements.createSidebarPane("My Sidebar",
function(sidebar) {
    // sidebar initialization code here
    sidebar.setPage("panel.html")
});
