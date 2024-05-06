import React from "react";
import { Button } from "./Buttons";

const SplitOptionSelector = ({ splitOption, setSplitOption }) => {
  return (
    <div className="mb-4 mt-4">
      <label>Split Option:</label>
      <div className="flex mt-4 space-x-4">
        <Button
          type="button"
          onClick={() => setSplitOption("equal")}
          className={`w-1/2 ${
            splitOption === "equal"
              ? "bg-blue-500 text-white"
              : "text-gray-700 border-gray-300 border"
          }`}
        >
          Equal Split
        </Button>
        <Button
          type="button"
          onClick={() => setSplitOption("custom")}
          className={`w-1/2 ${
            splitOption === "custom"
              ? "bg-blue-500 text-white"
              : "text-gray-700 border-gray-300 border"
          }`}
        >
          Custom Amounts
        </Button>
      </div>
    </div>
  );
};

export default SplitOptionSelector;