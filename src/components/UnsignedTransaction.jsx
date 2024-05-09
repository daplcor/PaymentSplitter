import PropTypes from 'prop-types';

const UnsignedTransaction = ({
  transaction,
  copiedTransactions,
  setCopiedTransactions,
}) => {
  if (!transaction) {
    return null;
  }
console.log("transaction", transaction.hash)
  const copyTransaction = () => {
    // This will convert the transaction object into a string with proper formatting
    const transactionString = JSON.stringify(transaction, null, 2); // Pretty prints the object
    navigator.clipboard.writeText(transactionString);
    setCopiedTransactions([...copiedTransactions, transaction]);
  };

  const downloadTransaction = () => {
    const element = document.createElement("a");
    const file = new Blob([transaction.cmd], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "unsigned_transaction.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          {copiedTransactions.includes(transaction)
            ? "Copied!"
            : "Copy Transaction"}
        </button>
        <button
          className="w-full px-4 py-2 mt-2 text-white rounded bg-blue-500 hover:bg-blue-600"
          onClick={downloadTransaction}
        >
          Download Transaction
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
