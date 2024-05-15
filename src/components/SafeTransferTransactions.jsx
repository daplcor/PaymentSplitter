import PropTypes from 'prop-types';
import { useState } from 'react';

const SafeTransferTransactions = ({ transactions, copiedTransactions, setCopiedTransactions }) => {
  const [linkClicked, setLinkClicked] = useState({});

  if (!transactions || transactions.length === 0) {
    return null;
  }

  // Copy the transaction to the clipboard and update the state
  const copyTransaction = (transactionData, index) => {
    navigator.clipboard.writeText(JSON.stringify(transactionData, null, 2));
    setCopiedTransactions((prevCopied) => [...prevCopied, index]);
  };

  // Create the transaction explorer link, copy it to the clipboard, and show user feedback
  const createLink = (transaction, index) => {
    const t = transaction.hash;
    const cmdObj = JSON.parse(transaction.cmd);
          const apiUrl = cmdObj.networkId === "testnet04"
        ? "https://explorer.chainweb.com/testnet"
        : "https://explorer.chainweb.com/mainnet";
    const link = `${apiUrl}/tx/${t}`;
    navigator.clipboard.writeText(link);

    setLinkClicked((prevState) => ({
      ...prevState,
      [index]: true
    }));

    // Revert the button text after a short delay
    setTimeout(() => {
      setLinkClicked((prevState) => ({
        ...prevState,
        [index]: false
      }));
    }, 2000);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-3">Safe Transfers TX</h3>
      <p>Click to copy</p>
      <div className="grid gap-4 mb-4 mt-1">
        {transactions.map((transaction, index) => {
          const { payee, ...transactionData } = transaction;
          return (
            <div key={index} data-index={index} className="mb-1 grid grid-cols-3 items-center gap-4">
              <span className="col-span-1">
                Transaction {index + 1}: Payee: {payee.slice(0, 14)}...
              </span>
              <button
                className={`col-span-1 w-full px-4 py-2 text-white rounded ${
                  copiedTransactions.includes(index)
                    ? "bg-green-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => copyTransaction(transactionData, index)}
              >
                {copiedTransactions.includes(index) ? "Copied!" : "Copy Transaction"}
              </button>
              <button
                className={`col-span-1 w-full px-4 py-2 text-white rounded ${
                  linkClicked[index] ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => createLink(transaction, index)}
              >
                {linkClicked[index] ? "Link Copied!" : "Explorer Link"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

SafeTransferTransactions.propTypes = {
  transactions: PropTypes.array,
  copiedTransactions: PropTypes.array,
  setCopiedTransactions: PropTypes.func.isRequired,
};

export default SafeTransferTransactions;
