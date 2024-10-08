import { Pact, createClient } from "@kadena/client";

export const generateTransaction = async (formData) => {
  const {
    payees,
    sender,
    chain,
    network,
    splitOption,
    amount,
    selectedKeys,
    fungible,
  } = formData;
  const apiUrl =
    network === "testnet04"
      ? "https://api.testnet.chainweb.com"
      : "https://api.chainweb.com";
  const pc = createClient(
    `${apiUrl}/chainweb/0.0/${network}/chain/${chain}/pact`
  );
  const payeeArray = payees.split("\n").filter((payee) => payee.trim() !== "");
  const numPayees = payeeArray.length;
  let splitAmount;

  if (splitOption === "equal") {
    splitAmount = parseFloat(amount) / numPayees;
  } else if (splitOption === "single") {
    splitAmount = parseFloat(amount);
  } else {
    const amountArray = amount.split("\n");
    splitAmount = amountArray.map(parseFloat);
  }

  const roundToPrecision = (num, precision) => {
    return parseFloat(num.toFixed(precision));
  };

  const senderPubKeys = selectedKeys || [];
  // const senderPubKeys = sender.startsWith("k:")
  //   ? [sender.slice(2)]
  //   : selectedKeys || [];
  let code = "";
  for (let i = 0; i < payeeArray.length; i++) {
    const payee = payeeArray[i];
    const pubKey = payee.startsWith("k:") ? payee.slice(2) : "";
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
    let transferAmount = Array.isArray(splitAmount) ? splitAmount[i] : splitAmount;
    transferAmount = roundToPrecision(transferAmount, 12);
    pactBuilder.addData(`amount${i}`, transferAmount.toString());
  }

  // Calculate the gas limit based on the number of payees
  const gasLimit = Math.min(900 * numPayees, 150000);
  const transaction = await pactBuilder
    .addSigner(senderPubKeys, (signFor) => [
      signFor(`${fungible}.GAS`),
      ...payeeArray.map((payee, index) => {
        let transferAmount = Array.isArray(splitAmount) ? splitAmount[index] : splitAmount;
        transferAmount = roundToPrecision(transferAmount, 12);
        return signFor(`${fungible}.TRANSFER`, sender, payee, {
          decimal: transferAmount.toString(),
        });
      }),
    ])
    .setMeta({
      chainId: String(chain),
      gasLimit: gasLimit,
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

  const preflightResult = await pc.dirtyRead(transaction);

  if (preflightResult.result.status === "failure") {
    alert(preflightResult.result.error.message);
    throw new Error("command failure");
  }

  return { ...transaction, sigs };
};


export const generateSafeTransferTransactions = async (formData) => {
  const {
    payees,
    sender,
    chain,
    network,
    splitOption,
    amount,
    selectedKeys,
    fungible,
  } = formData;
  const apiUrl =
    network === "testnet04"
      ? "https://api.testnet.chainweb.com"
      : "https://api.chainweb.com";
  const pc = createClient(
    `${apiUrl}/chainweb/0.0/${network}/chain/${chain}/pact`
  );
  const payeeArray = payees.split("\n").filter((payee) => payee.trim() !== "");
  const numPayees = payeeArray.length;
  let splitAmount;

  if (splitOption === "equal") {
    splitAmount = parseFloat(amount) / numPayees;
  } else {
    const amountArray = amount.split("\n");
    splitAmount = amountArray.map(parseFloat);
  }

  const senderPubKeys = sender.startsWith("k:")
    ? [sender.slice(2)]
    : selectedKeys || [];

  const transactions = await Promise.all(
    payeeArray.map(async (payee, index) => {
      const receiverPubKey = payee.startsWith("k:") ? payee.slice(2) : "";
      let transferAmount = Array.isArray(splitAmount) ? splitAmount[index] : splitAmount;

      // Round transferAmount to 12 decimal places and avoid scientific notation
      transferAmount = transferAmount.toFixed(12);
      const smallTransferAmount = (0.000000000001).toFixed(12);

      const transaction = await Pact.builder
        .execution(
          `(${fungible}.transfer-create "${sender}" "${payee}" (read-keyset 'payee) (read-decimal 'amount))
          (${fungible}.transfer "${payee}" "${sender}" ${smallTransferAmount})`
        )
        .addSigner(senderPubKeys, (signFor) => [
          signFor(`${fungible}.GAS`),
          signFor(`${fungible}.TRANSFER`, sender, payee, {
            decimal: transferAmount,
          }),
        ])
        .addSigner([receiverPubKey], (signFor) => [
          signFor(`${fungible}.TRANSFER`, payee, sender, {
            decimal: smallTransferAmount,
          }),
        ])
        .addKeyset("payee", "keys-all", receiverPubKey)
        .addData("amount", parseFloat(transferAmount))
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

      const preflightResult = await pc.dirtyRead(transaction);

      if (preflightResult.result.status === "failure") {
        alert(preflightResult.result.error.message);
        throw new Error("command failure");
      }

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
