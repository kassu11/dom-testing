const divContainer = document.querySelector("div") as HTMLDivElement;
let x = 0, y = 0;

divContainer.addEventListener("mousedown", async () => {
  // @ts-ignore
  divContainer.requestPointerLock({
    unadjustedMovement: true
  });
});

divContainer.addEventListener("mouseup", e => {
  document.exitPointerLock()
})

document.addEventListener('pointerlockerror', (event) => {
  console.log('Error locking pointer');
});

document.addEventListener("pointerlockchange", () => {
  if(document.pointerLockElement === divContainer) {
    document.addEventListener("mousemove", updatePosition);
  } else document.removeEventListener("mousemove", updatePosition);
});

function updatePosition(event: MouseEvent) {
  x += event.movementX;
  y += event.movementY;

  document.querySelector("#xValue code")!.textContent = x.toString();
  document.querySelector("#yValue code")!.textContent = y.toString();
}