import React, { useState, useEffect, useCallback } from "react";
import { pactCalls } from "../utils/kadena";

const ReceiverDetails = ({ receiver, chain, network, onReceiverKeysChange }) => {
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [selectedReceiverKey, setSelectedReceiverKey] = useState("");

  useEffect(() => {
    const fetchReceiverDetails = async () => {
      if (receiver && !receiver.startsWith("k:")) {
        const code = `(coin.details "${receiver}")`;
        const result = await pactCalls(code, chain, network);
        setReceiverDetails(result);
      } else {
        setReceiverDetails(null);
      }
    };

    fetchReceiverDetails();
  }, [receiver, chain, network]);

  const handleReceiverKeysChange = useCallback(() => {
    if (selectedReceiverKey) {
      onReceiverKeysChange(receiver, [selectedReceiverKey]);
    } else {
      onReceiverKeysChange(receiver, []);
    }
  }, [selectedReceiverKey, receiver, onReceiverKeysChange]);

  useEffect(() => {
    handleReceiverKeysChange();
  }, [handleReceiverKeysChange]);

  if (!receiverDetails || receiver.startsWith("k:")) {
    return null;
  }

  const { guard } = receiverDetails;
  const keys = guard.keys;

  return (
    <div>
      <label htmlFor={`keySelector-${receiver}`}>Select key to sign with:</label>
      <select
        id={`keySelector-${receiver}`}
        value={selectedReceiverKey}
        onChange={(e) => setSelectedReceiverKey(e.target.value)}
        className="w-full h-12 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 mt-2"
      >
        <option value="">Select a key</option>
        {keys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReceiverDetails;