import { validateKadenaAddress } from "../utils/validation";
import PropTypes from 'prop-types';

const PayeeInput = ({ payees, setPayees, errors, setErrors }) => {

  const handleWalletValidation = (value) => {
    // Splits the textarea input into lines to validate each address
    const addresses = value.split('\n');
    const invalidAddresses = addresses.filter(address => address && !validateKadenaAddress(address));

    if (invalidAddresses.length > 0) {
      // If there are any invalid addresses, set an error
      setErrors({
        ...errors,
        payees: "Some addresses are invalid.",
      });
    } else {
      // If all addresses are valid, remove the error if it exists
      const newErrors = {...errors};
      delete newErrors.payees;
      setErrors(newErrors);
    }

    // Update the state with the new value whether it's valid or not
    setPayees(value);
  };

  return (
    <>
      <label htmlFor="payees">Enter payees (one per line):</label>
      <br />
      <textarea
        id="payees"
        rows="5"
        cols="30"
        value={payees}
        onChange={(e) => handleWalletValidation(e.target.value)}
        className={`w-full h-24 px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-2 mt-4 ${
          errors.payees
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      ></textarea>
      {errors.payees && (
        <p className="text-red-500 text-sm mt-1">{errors.payees}</p>
      )}
      <br />
    </>
  );
};

PayeeInput.propTypes = {
  payees: PropTypes.string.isRequired,
  setPayees: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default PayeeInput;
