const messege = "I like to eat apples"
const key = "key value"

const encrypted = CryptoJS.AES.encrypt(messege, key).toString()
console.log(encrypted)

const encryptedMessage = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8)
console.log(encryptedMessage)

const encryptedMessage2 = CryptoJS.AES.decrypt(encrypted, "Key value").toString(CryptoJS.enc.Utf8)
console.log(encryptedMessage2)

document.body.innerHTML = encryptedMessage + "<br>" + encrypted