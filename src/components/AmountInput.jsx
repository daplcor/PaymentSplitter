import PropTypes from 'prop-types';

const AmountInput = ({ splitOption, amount, setAmount, errors, fungible, setFungible }) => {
  return (
    <>
      <div className="flex items-start space-x-4">
        <div className="flex flex-col flex-1">
          <label htmlFor="amount" className="mb-1">
            {splitOption === "equal" ? "Enter Total Amount:" : "Enter Amounts (one per line, matching payees):"}
          </label>
          {splitOption === "equal" ? (
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full h-12 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.amount ? "border-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          ) : (
            <textarea
              id="amount"
              rows="5"
              cols="30"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="fungible" className="mb-1">Token Type:</label>
          <select
            id="fungible"
            value={fungible}
            onChange={(e) => setFungible(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none h-12 focus:ring-2 focus:ring-blue-500"
          >
            <option value="coin">KDA</option>
            <option value="kaddex.kdx">KDX</option>
            <option value="kdlaunch.kdswap-token">KDS</option>
            <option value="n_e309f0fa7cf3a13f93a8da5325cdad32790d2070.heron">HERON</option>
            <option value="free.wiza">WIZA</option>
            <option value="arkade.token">ARKD</option>
            <option value="free.kishu-ken">KISHK</option>
            <option value="hypercent.prod-hype-coin">HYPE</option>
            <option value="kdlaunch.token">KDL</option>
          </select>
        </div>
      </div>

      {errors.amount && (
        <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
      )}
      <br />
    </>
  );
};

AmountInput.propTypes = {
  splitOption: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  fungible: PropTypes.string.isRequired,
  setFungible: PropTypes.func.isRequired,
};

export default AmountInput;
