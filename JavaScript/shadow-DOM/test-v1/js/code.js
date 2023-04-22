const shadowOpen = document.querySelector("div").attachShadow({ mode: "open" });

shadowOpen.innerHTML = `
	<style>
		:host {
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			display: inline-block;
			border: 1px solid red;
			padding: 10px;
		}
		#test {
			color: red;
		}
	</style>
	<div id="test">This is a test</div>
`;

setTimeout(e => {
	const div = document.querySelector("div");
	div.innerHTML = div.innerHTML
	console.log(div.innerHTML)
	console.log("shadow root can't be removed")
	console.log(document.querySelector("div").shadowRoot);
}, 500);