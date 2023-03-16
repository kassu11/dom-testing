"use strict";
function autoCorrectCallback(mutationList) {
    for (const mutation of mutationList) {
        const addedNodes = mutation.addedNodes;
        const removedNodes = mutation.removedNodes;
        addedNodes.forEach(emptyAutoCorrect);
        removedNodes.forEach(removedAutoCorrect);
    }
    function emptyAutoCorrect(node) {
        if (!node.classList?.contains("autocorrect"))
            return;
        if (node.textContent?.length !== 0)
            return;
        tooltip.textContent = "";
    }
    function removedAutoCorrect(node) {
        if (!node.classList?.contains("autocorrect"))
            return;
        if (commandHighlight.querySelector(".autocorrect"))
            return;
        tooltip.textContent = "";
    }
}
const autoCorrectObserver = new MutationObserver(autoCorrectCallback);
autoCorrectObserver.observe(commandHighlight, { attributes: false, childList: true, subtree: false });
function tooltipCallback(mutationList) {
    for (const mutation of mutationList) {
        const autoCorrectElement = commandHighlight.querySelector(".autocorrect");
        const autoCorrectLength = autoCorrectElement?.textContent?.length ?? 0;
        if (mutation.addedNodes.length && autoCorrectLength === 0) {
            tooltip.textContent = "";
        }
    }
}
const tooltipObserver = new MutationObserver(tooltipCallback);
tooltipObserver.observe(tooltip, { attributes: false, childList: true, subtree: false });
//# sourceMappingURL=tooltip.js.map