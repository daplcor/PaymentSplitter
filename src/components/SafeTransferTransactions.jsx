import PropTypes from 'prop-types';

const SafeTransferTransactions = ({ transactions, copiedTransactions, setCopiedTransactions }) => {

  if (!transactions || transactions.length === 0) {
    return null;
  }

  const copyTransaction = (transactionData, index) => {
    navigator.clipboard.writeText(JSON.stringify(transactionData, null, 2));
    setCopiedTransactions((prevCopied) => [...prevCopied, index]);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-3">Safe Transfers TX</h3>
      <p>Click to copy</p>
      <div className="grid grid-cols-2 gap-4 mb- mt-1">
        {transactions.map((transaction, index) => {
          const { payee, ...transactionData } = transaction;
          return (
            <div key={index} data-index={index} className="mb-1">
              Transaction {index + 1} <br />
              <button
                className={`w-full px-4 py-2 mt-2 text-white rounded ${
                  copiedTransactions.includes(index)
                    ? "bg-green-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => copyTransaction(transactionData, index)}
              >
                {copiedTransactions.includes(index)
                  ? "Copied!"
                  : `Payee: ${payee.slice(0, 14)}...`}
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