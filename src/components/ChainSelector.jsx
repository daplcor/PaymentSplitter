import PropTypes from "prop-types";

const ChainSelector = ({ chain, setChain, balances }) => {

  const formatBalance = (balance) => {
    if (balance === undefined || balance === null || isNaN(balance)) {
      return "0.00";
    }

    // Convert the balance to a string
    const balanceString = balance.toString();

    // Check if the balance has a decimal point
    if (balanceString.includes(".")) {
      // Split the balance into integer and decimal parts
      const [integerPart, decimalPart] = balanceString.split(".");

      // Truncate or pad the decimal part to four digits
      const formattedDecimalPart = decimalPart.slice(0, 4).padEnd(2, "0");

      // Combine the integer and formatted decimal parts
      return `${integerPart}.${formattedDecimalPart}`;
    }

    // If the balance doesn't have a decimal point, add ".00"
    return `${balanceString}.00`;
  };

  const getBalanceValue = (chainId) => {
    const balance = balances[chainId];
    if (typeof balance === "object" && balance !== null && "decimal" in balance) {
      return balance.decimal;
    }
    return balance;
  };

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
            {chainId} ({formatBalance(getBalanceValue(chainId))})
          </option>
        ))}
      </select>
    </div>
  );
};

ChainSelector.propTypes = {
  chain: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setChain: PropTypes.func.isRequired,
  balances: PropTypes.shape({
    [PropTypes.oneOfType([PropTypes.string, PropTypes.number])]: PropTypes.oneOfType([
      PropTypes.shape({
        decimal: PropTypes.string,
      }),
      PropTypes.number,
    ]),
  }),
};

ChainSelector.defaultProps = {
  balances: {},
};

export default ChainSelector;