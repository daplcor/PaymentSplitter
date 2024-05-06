import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const KeySelector = ({ keys, setSelectedKeys }) => {
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    if (selectedKey) {
      setSelectedKeys([selectedKey]);
    } else {
      setSelectedKeys([]);
    }
  }, [selectedKey, setSelectedKeys]);

  const handleKeyChange = (key) => {
    setSelectedKey(key);
  };

  return (
    <div>
      <p>
        <strong>Keys:</strong>
      </p>
      {keys.map((key, index) => {
        const isKKey = key.startsWith("k:");
        const isSelected = selectedKey === key;

        if (isKKey) {
          return (
            <div key={key} className="flex items-center">
              <span className="truncate text-gray-500">{key}</span>
            </div>
          );
        }

        return (
          <div key={key} className="flex items-center">
            <label className="flex items-center">
              <input
                type="radio"
                checked={isSelected}
                onChange={() => handleKeyChange(key)}
                className="mr-2"
              />
              <span className="truncate">{key}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

KeySelector.propTypes = {
  keys: PropTypes.array.isRequired,
  selectedKeys: PropTypes.array.isRequired,
  setSelectedKeys: PropTypes.func.isRequired,
};

export default KeySelector;