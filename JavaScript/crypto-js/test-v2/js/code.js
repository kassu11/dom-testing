const password = "e3820c3ee7eeab0c7af7c44e85b2dd4f80a8d1d6bae429f3fdd47d24a764254d89ffc6c891e66c75e87606d43727e2236d656c6e18f0e088562980d51e144ad6" // sha512 hash
const hintHash = "U2FsdGVkX1/dKbQSQIFnrUuh3UsKvdnwYKOoTqkPE6c=" // Message encrypted with AES
const input = prompt("Enter your password")

const hash = sha512.update(input).hex()

if (hash === password) {
	const hint = CryptoJS.AES.decrypt(hintHash, input).toString(CryptoJS.enc.Utf8);
	const h1 = document.createElement("h1");
	h1.textContent = hint;
	document.body.appendChild(h1);
}