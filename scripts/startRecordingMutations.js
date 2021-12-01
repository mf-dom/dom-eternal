function cb(e) {
    console.log(e);
    debugger;
}

const m = new MutationObserver(cb);
m.observe(document.body, {childList: true, subtree: true});
window.mfdom_mutobs = m;

console.log("Mutation observer started");

