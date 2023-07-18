console.log(sha512)

const hash = sha512.update("I like to eat apples").hex()

console.log(hash === "34a644030e628fde270863c43b08e445db7c3697e416ea24ce219cce9eb0ffb10f1404bf1f7b427b67d6b730d5ed5bf8334b06a29c97e96bba35d318bb995acc")


const key = "moi"