document.addEventListener("mouseup", () => {
  console.clear();
  document.querySelectorAll("*").forEach(elem => {
    elem.style.outline = null;
  });
  
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  
  console.log("Selected elements:");
  console.log(range.cloneContents())
  console.dir([...range.cloneContents().childNodes][1].parentNode)
  range.cloneContents().querySelectorAll("*").forEach(elem => {
    elem.style.outline = "2px solid red";
  });
  
  console.log("Selected text/elements parent:");
  console.log(range.commonAncestorContainer.parentNode);
});