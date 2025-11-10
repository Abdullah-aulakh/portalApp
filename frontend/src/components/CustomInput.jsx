import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const CustomInput = ({
  type,
  name,
  label,
  value,
  placeholder,
  onChange,
  isInvalid,
  validationMsg,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-5 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-600 mb-2 text-sm font-medium"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type={isPassword && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full text-sm px-4 py-3 rounded-lg transition-all outline-none
     ${
       isInvalid
         ? "border-[2px] border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300"
         : "border-[2px] border-[var(--color-primary)] bg-gray-50 text-gray-800"
     }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[var(--color-primary)] text-lg focus:outline-none"
          >
            {!showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {isInvalid && (
        <p className="text-xs text-red-500 mt-1">{validationMsg}</p>
      )}
    </div>
  );
};

export default CustomInput;
