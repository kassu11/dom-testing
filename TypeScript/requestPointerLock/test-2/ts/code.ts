const divContainer = document.querySelector("#box") as HTMLDivElement;
const divContent = divContainer.querySelector(".container") as HTMLDivElement;
let x: number = 0, y: number = 0, scale: number = 1;

divContainer.onmousedown = () => divContainer.requestPointerLock();
divContainer.onmouseup = () => document.exitPointerLock();

document.addEventListener("pointerlockerror", () => {
  console.log("Error locking pointer");
});

document.addEventListener("pointerlockchange", () => {
  if(document.pointerLockElement === divContainer) {
    document.addEventListener("mousemove", updatePosition);
  } else document.removeEventListener("mousemove", updatePosition);
});

document.addEventListener("wheel", (wheelEvent: WheelEvent) => {
  if(!document.pointerLockElement && !(wheelEvent.target as HTMLElement)?.closest("#box")) return;
  wheelEvent.preventDefault();

  if(wheelEvent.deltaY > 0) scale = Math.max(scale ** .9 - .1, .1)
  else scale = Math.min(scale ** 1.15 + .1, 150);

  const containerData = divContainer.getBoundingClientRect();
  const oldData = divContent.getBoundingClientRect();
  
  const mouseX = wheelEvent.x - containerData.left;
  const mouseY = wheelEvent.y - containerData.top;

  const contentLeft = oldData.left - containerData.left;
  const contentTop = oldData.top - containerData.top;

  const layerX = mouseX - contentLeft;
  const layerY = mouseY - contentTop;

  const percentageX = layerX / oldData.width;
  const percentageY = layerY / oldData.height;

  divContent.style.transform = `scale(${scale})`;

  const newData = divContent.getBoundingClientRect();

  const diffX = (oldData.width - newData.width) * percentageX;
  const diffY = (oldData.height - newData.height) * percentageY;

  x += diffX
  y += diffY

  divContent.style.left = `${x}px`;
  divContent.style.top = `${y}px`;
}, { passive: false });

function updatePosition(event: MouseEvent) {
  x += event.movementX;
  y += event.movementY;
  divContent.style.left = `${x}px`;
  divContent.style.top = `${y}px`;

  document.querySelector("#xValue code")!.textContent = x.toString();
  document.querySelector("#yValue code")!.textContent = y.toString();
}