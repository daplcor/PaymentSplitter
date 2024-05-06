import PropTypes from 'prop-types';

const NetworkSelector = ({ network, setNetwork }) => {
  return (
    <div className="flex-1">
      <label htmlFor="network">Select Network:</label>
      <br />
      <select
        id="network"
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        className="w-full h-12 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      >
        <option value="devnet">Devnet</option>
        <option value="testnet04">Testnet</option>
        <option value="mainnet01">Mainnet</option>
      </select>
    </div>
  );
};

NetworkSelector.propTypes = {
  network: PropTypes.string.isRequired,
  setNetwork: PropTypes.func.isRequired,
};

export default NetworkSelector;