import { useState, useEffect } from "react";
import { Button } from "./Buttons";
import { pactCalls } from "../utils/kadena";
import PayeeInput from "./PayeeInput";
import SenderInput from "./SenderInput";
import ChainSelector from "./ChainSelector";
import NetworkSelector from "./NetworkSelector";
import SplitOptionSelector from "./SplitOptionSelector";
import AmountInput from "./AmountInput";
import { validateKadenaAddress } from "../utils/validation";
import PropTypes from 'prop-types';

// import ReceiverDetails from "./ReceiverDetails";

const PaymentForm = ({ onSubmit, onSafeTransferSubmit }) => {
  const [payees, setPayees] = useState("");
  const [sender, setSender] = useState("");
  const [chain, setChain] = useState("0");
  const [network, setNetwork] = useState("testnet04");
  const [senderDetails, setSenderDetails] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [splitOption, setSplitOption] = useState("equal");
  const [fungible, setFungible] = useState('coin');
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState({});
  const [errors, setErrors] = useState({
    payees: "",
    sender: "",
    amount: "",
  });

  useEffect(() => {
    const fetchBalances = async () => {
      if (sender) {
        const updatedBalances = {};
        for (let i = 0; i < 20; i++) {
          const code = `(coin.get-balance "${sender}")`;
          const result = await pactCalls(code, i.toString(), network);
          updatedBalances[i] = result;
        }
        setBalances(updatedBalances);
      } else {
        setBalances({});
      }
    };

    fetchBalances();
  }, [sender, network]);

  // const handleReceiverKeysChange = (receiver, keys) => {
  //   setReceiverKeys((prevKeys) => ({
  //     ...prevKeys,
  //     [receiver]: keys,
  //   }));
  // };

  const fetchSenderDetails = async () => {
   
    if (sender) {
      const code = `(coin.details "${sender}")`;
      const result = await pactCalls(code, chain, network);
      setSenderDetails(result);
      if (result && result.guard && result.guard.keys) {
        setSelectedKeys(result.guard.keys);
      } else {
        setSelectedKeys([]);
      }
    } else {
      setSenderDetails(null);
      setSelectedKeys([]);
    }
  };


  useEffect(() => {
    fetchSenderDetails();
  }, [sender, chain, network]);

  const handleSenderChange = (e) => {
    const newSender = e.target.value;
    setSender(newSender);
    if (newSender) {
      fetchSenderDetails(newSender);
    } else {
      setSenderDetails(null);
      setSelectedKeys([]);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = {
      payees,
      sender,
      chain,
      network,
      splitOption,
      amount,
      selectedKeys,
      fungible
    };
    onSubmit(formData);
  };

  const handleSafeTransferSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = {
      payees,
      sender,
      chain,
      network,
      splitOption,
      amount,
      selectedKeys,
      fungible
      // receiverKeys,
    };
    onSafeTransferSubmit(formData);
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      payees: "",
      sender: "",
      amount: "",
    };

     // We split the payees by new line and trim each one to avoid whitespace issues
     const payeeArray = payees.split("\n").map(p => p.trim()).filter(p => p !== "");

     if (payeeArray.length === 0) {
         newErrors.payees = "Please enter at least one payee.";
         isValid = false;
     } else {
         // Validate each payee address
         const invalidPayees = payeeArray.filter(payee => !validateKadenaAddress(payee));
         if (invalidPayees.length > 0) {
             newErrors.payees = "One or more payee addresses are invalid.";
             isValid = false;
         }
     }
 
     if (sender.trim() === "") {
         newErrors.sender = "Please enter a sender account.";
         isValid = false;
     }
 
     if (amount.trim() === "") {
         newErrors.amount = "Please enter an amount.";
         isValid = false;
     }
 
     // Set the new errors state
     setErrors(newErrors);
     return isValid;
 };
 

  return (
    <form>
      <PayeeInput payees={payees} setPayees={setPayees} errors={errors} setErrors={setErrors} />
      {/* <div>
        <label>Receiver Details:</label>
        {payeeArray.map((payee) => (
          <ReceiverDetails
            key={payee}
            receiver={payee}
            chain={chain}
            network={network}
            onReceiverKeysChange={handleReceiverKeysChange}
          />
        ))}
      </div> */}
      <SenderInput
        sender={sender}
        handleSenderChange={handleSenderChange}
        errors={errors}
        senderDetails={senderDetails}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />
      <div className="flex space-x-4 mb-4 mt-4">
        <ChainSelector chain={chain} setChain={setChain} balances={balances} />
        <NetworkSelector network={network} setNetwork={setNetwork} />
      </div>
      <SplitOptionSelector
        splitOption={splitOption}
        setSplitOption={setSplitOption}
      />
      <AmountInput
        splitOption={splitOption}
        amount={amount}
        setAmount={setAmount}
        errors={errors}
        fungible={fungible}
        setFungible={setFungible}
      />
      <div className="flex space-x-4 mb-4 mt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white w-1/2"
        >
          Generate Transaction
        </Button>
        <Button
          type="button"
          onClick={handleSafeTransferSubmit}
          className="bg-blue-500 text-white w-1/2"
        >
          Safe Transfer
        </Button>
      </div>
    </form>
  );
};

PaymentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSafeTransferSubmit: PropTypes.func.isRequired,
};

export default PaymentForm;
