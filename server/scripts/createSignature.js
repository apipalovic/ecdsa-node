///// RUN WITH VALUES FROM APPLICATION
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");


const PRIVATE_KEY = "0x1 private";
const AMOUNT = "x";
const RECIPIENT = "0x2 public"


const MESSAGE = `${AMOUNT} to ${RECIPIENT}`;
const messageHash = toHex(utf8ToBytes(MESSAGE));
const signature = secp256k1.sign(messageHash, PRIVATE_KEY);
console.log("Paste this value into signature field in the APP:", signature.toDERHex())