import React from "react";
import SenderDetails from "./SenderDetails";

const SenderInput = ({
  sender,
  handleSenderChange,
  errors,
  senderDetails,
  selectedKeys,
  setSelectedKeys,
}) => {
  return (
    <div className="mb-4 mt-3">
      <label htmlFor="sender">Enter sender account:</label>
      <br />
      <input
        type="text"
        id="sender"
        value={sender}
        onChange={handleSenderChange}
        className={`w-full h-12 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 mt-4 ${
          errors.sender ? "border-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {errors.sender && (
        <p className="text-red-500 text-sm mt-1">{errors.sender}</p>
      )}
      <SenderDetails
        senderDetails={senderDetails}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />
    </div>
  );
};

export default SenderInput;