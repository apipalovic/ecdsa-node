// POPULATE BALANCES WITH PUBLIC ADDRESSES FROM scripts\generate.js
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  const messageHash = toHex(utf8ToBytes(`${amount} to ${recipient}`));
  const recoveredKey = recoverPublicKey(messageHash, signature);
 
  if(recoveredKey !== sender) {
    res.status(403).send({ message: "Forbidden. Wrong signature" });
    return
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function recoverPublicKey(messageHash, signature) {
  let responseSignature = secp256k1.Signature.fromDER(signature);
  let newSig = new secp256k1.Signature(responseSignature.r, responseSignature.s, 0);
  
  return  newSig.recoverPublicKey(messageHash).toHex();
}
