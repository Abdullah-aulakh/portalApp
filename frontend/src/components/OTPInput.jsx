import { useState, useEffect, useRef } from "react";

const OTPInput = ({ value = "", onChange, isInvalid = false, length = 6 }) => {
  const [otp, setOtp] = useState(
    value.split("").concat(Array(length - value.length).fill(""))
  );

  const inputsRef = useRef([]);

  useEffect(() => {
    const valArr = value.split("").concat(Array(length - value.length).fill(""));
    setOtp(valArr);
  }, [value, length]);

  const handleChange = (index, inputValue) => {
    if (inputValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = inputValue;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (inputValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`w-12 h-12 text-center text-xl rounded-xl
                      border-2 
                      ${isInvalid ? "border-red-500" : "border-[#4880FF]"} 
                      bg-gray-50 text-gray-800
                      focus:outline-none focus:ring-0`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
