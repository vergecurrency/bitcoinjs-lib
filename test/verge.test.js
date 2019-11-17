const bitcoin = require('..');
const axios = require('axios/index');

// outputs could be got from here https://api.vergecurrency.network/node/api/XVG/mainnet/address/DL5LtSf7wztH45VuYunL8oaQHtJbKLCHyw/txs/?unspent=true
const TEST_OUTPUT = '2913925761c42c1bf50d599f502333d93067574c0c79975e8b2af0e45220db77';
const TEST_KEY = 'Q...';
const TEST_ADDRESS = 'D...';
const TEST_ADDRESS_TO = 'D9DkHCQUULXNCni4s9qcv34W4C447PdBme';


const NETWORK = {
  messagePrefix: '\x18VERGE Signed Message:\n',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x1e,
  scriptHash: 0x21,
  wif: 0x9e,
};

const PUSH_URL = 'https://api.vergecurrency.network/node/api/XVG/mainnet/tx/send';

async function main() {
  let keyPair = bitcoin.ECPair.fromWIF(TEST_KEY, NETWORK);
  let address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK }).address;
  if (address !== TEST_ADDRESS) {
    throw new Error('not valid signing address ' + TEST_ADDRESS + ' != ' + address);
  }

  let txb = new bitcoin.TransactionBuilder(NETWORK);
  txb.setVersion(1);
  txb.addInput(TEST_OUTPUT, 0, 0xffffffff, Buffer.from("76a9142c335ebcaae7e119a97b6d0892122c834401392b88ac", 'hex'));
  txb.addOutput(TEST_ADDRESS_TO, 0.1 * 1000000);
  txb.sign({
    keyPair,
    vin: 0,
    prevOutScriptType: "p2pkh"
  });


  let hex = txb.build().toHex();
  console.log("Done: ", hex)
  // let res
  // try {
  //   res = await axios.post(PUSH_URL, { 'rawTx': hex });
  // } catch (e) {
  //   if (e.response.data) {
  //     if (typeof e.response.data.error !== 'undefined') {
  //       e.message = JSON.stringify(e.response.data.error)
  //     } else {
  //       e.message = JSON.stringify(e.response.data)
  //     }
  //   }
  //   throw e
  // }
  // console.log(res)
}

main()
