import { useState } from "react";
import { generateTransaction, generateSafeTransferTransactions } from "./transactionUtils";
import PaymentForm from "./PaymentForm";
import UnsignedTransaction from "./UnsignedTransaction";
// import WalletConnectButton from "./WalletConnectButton";
import SafeTransferTransactions from "./SafeTransferTransactions";

const PaymentSplitter = () => {
  const [unsignedTransaction, setUnsignedTransaction] = useState(null);
  const [safeTransferTransactions, setSafeTransferTransactions] = useState(null);
  const [copiedTransactions, setCopiedTransactions] = useState([]);

  const resetCopiedTransactions = () => {
    setCopiedTransactions([]);
  };

  const handleSafeTransferSubmit = async (formData) => {
    const transactions = await generateSafeTransferTransactions(formData);
    setSafeTransferTransactions(transactions);
    resetCopiedTransactions();
  };

  const handleSubmit = async (formData) => {

    const transaction = await generateTransaction(formData);
    setUnsignedTransaction(transaction);
    resetCopiedTransactions();
  };

  return (
    <div className="lg:max-w-2xl md:max-w-lg w-full mx-auto px-4  bg-gray-200 shadow-lg rounded-lg mt-4 mb-8">
      <div className="mb-3 px-1 text-right mt-2">
        {/* <WalletConnectButton /> */}
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6 mt-4">
          Kadena Payment Splitter
        </h2>
      </div>
      <div className="form-container w-full mx-auto">
        <PaymentForm
          onSubmit={handleSubmit}
          onSafeTransferSubmit={handleSafeTransferSubmit}
        />
        <UnsignedTransaction
          transaction={unsignedTransaction}
          copiedTransactions={copiedTransactions}
          setCopiedTransactions={setCopiedTransactions}
        />
        <SafeTransferTransactions
          transactions={safeTransferTransactions}
          copiedTransactions={copiedTransactions}
          setCopiedTransactions={setCopiedTransactions}
        />
      </div>
    </div>
  );
};

export default PaymentSplitter;