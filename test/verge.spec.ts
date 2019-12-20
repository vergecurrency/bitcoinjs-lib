import * as assert from 'assert';
import { describe, it } from 'mocha';

import { address, Transaction, networks, ECPair, Psbt } from '..';

describe.only('Verge-Base Tests', () => {
  it('Address to OuputScript', () => {
    const outputScript = address
      .toOutputScript('D7FXSGTRvVRCP2TMzSWnYMnzammDLLLSLU')
      .toString('hex');

    assert.strictEqual(
      outputScript,
      '76a914172787b20b8fafba9e2aa7cff742218a400a314188ac',
    );
  });

  it('Address hash matches', () => {
    const base58Check = address.fromBase58Check(
      'D7FXSGTRvVRCP2TMzSWnYMnzammDLLLSLU',
    );

    assert.strictEqual(base58Check.version, 30);
  });

  it('Decode raw transaction', () => {
    const transaction = Transaction.fromHex(
      '01000000df6bfb5d066dd3ddf80c179223f76d986c7fe406e78c5bb8e1cdecd2599a059a8922fdfb290000000049483045022100b11777645cf8b60e1c257c5cac2ecb6f09cb660d578203ab2ea0aaa0e876ce9a022030e8d2f22e6f7421396853a91f4345bb2b74e969ef8d53efffb3feb6d04d17ff01fefffffff98ee5976bcd3e82be5bd30c147aee2a49d117598d37ba8c216277be83119365000000006a47304402204a724ff83394c3f408b8eba3b50b1c816529e5b94d4a0d488b2f0736ae5efc05022057ad6b453c91e9a010bf89046241af035c0bb060d831d87b0a3a0b4c72df959b0121038557abca01fbe488630fab3b54ae9e07bcfb8251cee932498e00788fa61582f3fefffffff9f9775a2087c8764cae1312e0d11620866b82931b7663f062e41abf4ad4a129010000006a473044022019e1b0277f8bbedb6ec6604af760da489a59b9e12251c6301d12ba47353eb369022035f54c6232ad603e9d6c348717ecbcbf6d58ee91856e8589a8b83197e0cdbe30012102c2fb66659ae21b2662fc8173af096b7e60690ffebcd24bcc5050666230042badfeffffff73c5a29b562e4ad4944b444e73c3dac8bd644c3268feeb1e3416e4d5e33dc9ce010000006a47304402206180cc61a526da236d98274022c242a8ff5800cc6d00fc3af9199cda04b9bd6a022051813891a34c5c36924ffb08dc21f7413fd9c9dfd2232a883faf8ce52998bc2b0121028d428d5724c31d8503992976d902533d27bb84a0cfe0e2c62d467152a6aaa4acfeffffff01b513eda509eb28ca30070312b3ac8160da6a6ce7c75cc5cfbaf8362089dd63000000006b483045022100ec91994021d331a89cfbfeea098650abaf1dda501e9226dfe653b7543d539ce40220205209e00c6a8ddab0d58d3992dc6894baf55160b69f8740f02d9c90e87d69fa012102c2fb66659ae21b2662fc8173af096b7e60690ffebcd24bcc5050666230042badfeffffffc3f2cb726aff6172f63bab7c5347ccb66407d0408223699f063c58b97dfe7997000000006a47304402200569fc811282f2280d8d036a73b91072871f6631f7e1385ce6636c48526d083f022066439822975e008d4a0ca0f69f3281c4f92f72f35cfed2d7a3202600e3a1886b0121037d509e953fac99b0ae510b3f5a0adb2713e98bda0e91496de24fc1237c73ea53feffffff020308d7fc010000001976a914cc0c396bdb6a6d8fde975e2fba50dfa515bdf73588acc4ee1300000000001976a9149342b78ef6f7be8b5130272fa58b8fdb6d58d61b88ac823d3800',
      networks.verge,
    );

    assert.strictEqual(transaction.version, 1);
    assert.strictEqual(transaction.time, 1576758239);
    assert.strictEqual(transaction.ins.length, 6);

    assert.strictEqual(
      transaction.ins[3].script.toString('hex'),
      '47304402206180cc61a526da236d98274022c242a8ff5800cc6d00fc3af9199cda04b9bd6a022051813891a34c5c36924ffb08dc21f7413fd9c9dfd2232a883faf8ce52998bc2b0121028d428d5724c31d8503992976d902533d27bb84a0cfe0e2c62d467152a6aaa4ac',
    );
    assert.strictEqual(transaction.ins[3].sequence, 4294967294);
    assert.strictEqual(transaction.ins[3].index, 1);

    assert.strictEqual(transaction.outs[0].value, 8536918019);
    assert.strictEqual(transaction.outs[1].value, 1306308);

    assert.strictEqual(transaction.outs.length, 2);
    assert.strictEqual(
      transaction.outs[0].script.toString('hex'),
      '76a914cc0c396bdb6a6d8fde975e2fba50dfa515bdf73588ac',
    );
    assert.strictEqual(
      transaction.outs[1].script.toString('hex'),
      '76a9149342b78ef6f7be8b5130272fa58b8fdb6d58d61b88ac',
    );
  });

  it('create valid transaction', () => {
    const testpair = ECPair.fromWIF(
      'QWqJYMNPckFAGjGuJvdvHBj2jYTQa6MktEr4mafgUhGfTZM85AaP',
    );

    const psbt = new Psbt({ network: networks.verge });

    psbt.setVersion(1); // These are defaults. This line is not needed.
    psbt.setLocktime(0); // These are defaults. This line is not needed.

    psbt.addInput({
      // if hash is string, txid, if hash is Buffer, is reversed compared to txid
      hash: 'bf00a1320ad9ee25e1272ff2245cbe5bc8f9183c1051c207163232e568866e5a',
      index: 0,
      sequence: 0xffffffff, // These are defaults. This line is not needed.

      // non-segwit inputs now require passing the whole previous tx as Buffer
      nonWitnessUtxo: Buffer.from(
        '010000002d8afb5d01a719ad33518d703dd7748e79199915dad' +
          '77d61ea2c4303d6c8d15938b4fd87c1000000006a4730440220' +
          '1e148f3ff7b8e751f38658c73e61f286417c35a6b0cc0212b1d0' +
          '88ffecfbcc45022023ed5db56d2093d00f422809e6e120e3e253' +
          '157564f01e30025f94f02e957bae012102950a2e3602453ce715' +
          '7141066997e11b7f64bcfa69e7209ad361bbe99d9fc5f3feffff' +
          'ff02e00f9700000000001976a914172787b20b8fafba9e2aa7cf' +
          'f742218a400a314188acac93c700000000001976a9142d66a972' +
          '843ad03f956d13c44f04edab334340c188ac7f3e3800',
        'hex',
      ),
    });

    psbt.addOutput({
      address: 'DRb2DjF3g7Rbkix1Gu4p8KZajq3PSiyhvm',
      value: 9800000,
    });

    psbt.signInput(0, testpair);
    psbt.validateSignaturesOfInput(0);

    psbt.finalizeAllInputs();

    const finalHexTransaction = psbt.extractTransaction().toHex();
    const finalTransaction = Transaction.fromHex(
      finalHexTransaction,
      networks.verge,
    );

    assert.strictEqual(finalTransaction.version, 1);
    assert.strictEqual(finalTransaction.ins.length, 1);
    assert.strictEqual(finalTransaction.outs.length, 1);
    assert.strictEqual(
      finalTransaction.outs[0].script.toString('hex'),
      '76a914e049b99798042926706af6f8073e0cf8b7feaf6988ac',
    );
    assert.strictEqual(finalTransaction.outs[0].value, 9800000);
  });
});
