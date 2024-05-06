import React from "react";
import KeySelector from "./KeySelector";

const SenderDetails = ({ senderDetails, selectedKeys, setSelectedKeys }) => {
  if (!senderDetails) {
    return null;
  }

  const { guard, account } = senderDetails;
  const keys = guard.keys;

  return (
    <div className="mt-2">
      {account && !account.startsWith("k:") && (
        <KeySelector
          keys={keys}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
      )}
    </div>
  );
};

export default SenderDetails;