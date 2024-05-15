import PropTypes from 'prop-types';
import { useState } from 'react';

const UnsignedTransaction = ({
  transaction,
  copiedTransactions,
  setCopiedTransactions,
}) => {
  const [txLink, setTxLink] = useState("");
  const [linkClicked, setLinkClicked] = useState(false);

  if (!transaction) {
    return null;
  }

  // Copy the transaction to the clipboard and update the state
  const copyTransaction = () => {
    const transactionString = JSON.stringify(transaction, null, 2);
    navigator.clipboard.writeText(transactionString);
    setCopiedTransactions([...copiedTransactions, transaction]);
  };

  // Create the transaction explorer link, copy it to the clipboard, and show user feedback
  const createLink = () => {
    if (transaction) {
      const t = transaction.hash;
      const cmdObj = JSON.parse(transaction.cmd);
          const apiUrl = cmdObj.networkId === "testnet04"
        ? "https://explorer.chainweb.com/testnet"
        : "https://explorer.chainweb.com/mainnet";
      const link = `${apiUrl}/tx/${t}`;
      setTxLink(link);
      navigator.clipboard.writeText(link);
      setLinkClicked(true);

      // Revert the button text after a short delay
      setTimeout(() => setLinkClicked(false), 2000);
    }
  };

  return (
    <div className="">
      <h3 className="text-xl font-bold mb-3">Simple Transfers TX</h3>
      <p>Click to copy</p>
      <div className="mb-4 gap-4 grid grid-cols-2">
        <button
          className={`w-full px-4 py-2 mt-2 text-white rounded ${
            copiedTransactions.includes(transaction)
              ? "bg-green-500"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={copyTransaction}
        >
          {copiedTransactions.includes(transaction) ? "Copied!" : "Copy Transaction"}
        </button>
        <button
          className={`w-full px-4 py-2 mt-2 text-white rounded bg-blue-500 hover:bg-blue-600`}
          onClick={createLink}
        >
          {linkClicked ? "Link Copied!" : "Explorer Link"}
        </button>
      </div>
    </div>
  );
};

UnsignedTransaction.propTypes = {
  transaction: PropTypes.object,
  copiedTransactions: PropTypes.array,
  setCopiedTransactions: PropTypes.func.isRequired,
};

export default UnsignedTransaction;
