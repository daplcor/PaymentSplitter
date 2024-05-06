import React from "react";

const ChainSelector = ({ chain, setChain, balances }) => {
  return (
    <div className="flex-1">
      <label htmlFor="chain">Select Chain (balance):</label>
      <br />
      <select
        id="chain"
        value={chain}
        onChange={(e) => setChain(e.target.value)}
        className="w-full h-12 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      >
        {Array.from({ length: 20 }, (_, i) => i).map((chainId) => (
          <option key={chainId} value={chainId}>
            {chainId} (
            {balances[chainId] === undefined ||
            balances[chainId] === null ||
            balances[chainId] === 0 ||
            isNaN(balances[chainId])
              ? "0.00"
              : balances[chainId]?.toFixed(2)}
            )
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChainSelector;