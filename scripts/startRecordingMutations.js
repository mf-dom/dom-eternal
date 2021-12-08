function cb(e) {
    console.log(e);
    debugger;
}

window.mfdom_mutobs = window.mfdom_mutobs || new MutationObserver(cb);
window.mfdom_mutobs.observe(document.body, {childList: true, subtree: true});

console.log("Mutation observer started");

