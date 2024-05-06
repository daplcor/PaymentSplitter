import { Pact } from "@kadena/client";

export const generateTransaction = async (formData) => {
  const { payees, sender, chain, network, splitOption, amount, selectedKeys, fungible } = formData;
  // console.log("selectedKeys", selectedKeys);
  const payeeArray = payees.split("\n");
  const numPayees = payeeArray.length;

  let splitAmount;
  if (splitOption === "equal") {
    splitAmount = parseFloat(amount) / numPayees;
  } else {
    const amountArray = amount.split("\n");
    splitAmount = amountArray.map(parseFloat);
  }

  const senderPubKeys = sender.startsWith("k:") ? [sender.slice(2)] : selectedKeys || [];

  let code = "";
  for (let i = 0; i < payeeArray.length; i++) {
    const payee = payeeArray[i];
    const pubKey = payee.startsWith("k:") ? payee.slice(2) : "";
    // const transferAmount = splitAmount[i] || splitAmount;
    code += `(${fungible}.transfer-create "${sender}" "${payee}" (read-keyset "${pubKey}") (read-decimal 'amount${i}))`;
  }

  const pactBuilder = Pact.builder.execution(code);

  // Add each payee to the keyset
  payeeArray.forEach((payee) => {
    const pubKey = payee.startsWith("k:") ? payee.slice(2) : "";
    pactBuilder.addKeyset(pubKey, "keys-all", pubKey);
  });

  // Add transfer amounts
  for (let i = 0; i < payeeArray.length; i++) {
    const transferAmount = splitAmount[i] || splitAmount;
    pactBuilder.addData(`amount${i}`, transferAmount.toString());
  }
  
  const transaction = await pactBuilder
    .addSigner(senderPubKeys, (signFor) => [
      signFor(`${fungible}.GAS`),
      ...payeeArray.map((payee, index) => {
        // const pubKey = payee.startsWith("k:") ? payee.slice(2) : "";
        return signFor(`${fungible}.TRANSFER`, sender, payee, { decimal: (splitAmount[index] || splitAmount).toString() });
      }),
    ])
    .setMeta({
      chainId: String(chain),
      gasLimit: 2000,
      gasPrice: 1.0e-6,
      ttl: 86400,
      senderAccount: sender,
    })
    .setNetworkId(network)
    .createTransaction();

 
  const sigs = {
    ...senderPubKeys.reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {}),
  };

  return { ...transaction, sigs };
};

export const generateSafeTransferTransactions = async (formData) => {
  const { payees, sender, chain, network, splitOption, amount, selectedKeys, fungible } = formData;

  const payeeArray = payees.split("\n");
  const numPayees = payeeArray.length;
  let splitAmount;

  if (splitOption === "equal") {
    splitAmount = parseFloat(amount) / numPayees;
  } else {
    const amountArray = amount.split("\n");
    splitAmount = amountArray.map(parseFloat);
  }

  const senderPubKeys = sender.startsWith("k:") ? [sender.slice(2)] : selectedKeys || [];

  const transactions = await Promise.all(
    payeeArray.map(async (payee, index) => {
      const receiverPubKey = payee.startsWith("k:") ? payee.slice(2) : "";
      let transferAmount = splitAmount[index] || splitAmount;
      transferAmount += 0.000000000001; 

      const transaction = await Pact.builder
        .execution(
          `(${fungible}.transfer-create "${sender}" "${payee}" (read-keyset 'payee) (read-decimal 'amount))
          (${fungible}.transfer "${payee}" "${sender}" 0.000000000001)`
        )
        .addSigner(senderPubKeys, (signFor) => [
          signFor(`${fungible}.GAS`),
          signFor(`${fungible}.TRANSFER`, sender, payee, { decimal: transferAmount.toString() }),
        ])
        .addSigner([receiverPubKey], (signFor) => [
          signFor(`${fungible}.TRANSFER`, payee, sender, { decimal: "0.000000000001" }),
        ])
        .addKeyset("payee", "keys-all", receiverPubKey)
        .addData("amount", transferAmount)
        .setMeta({
          chainId: chain,
          gasLimit: 2000,
          gasPrice: 1.0e-6,
          ttl: 86400,
          senderAccount: sender,
        })
        .setNetworkId(network)
        .createTransaction();

      const cmd = transaction.cmd;
      const hash = transaction.hash;
      const sigs = {
        ...senderPubKeys.reduce((acc, key) => {
          acc[key] = null;
          return acc;
        }, {}),
        [receiverPubKey]: null,
      };


      return {
        cmd,
        hash,
        sigs,
        payee,
      };
    })
  );

  return transactions;
};
