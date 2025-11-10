const CustomDropDown = ({
  options,
  selectedOption,
  onChange,
  isInvalid = false,
  validationMsg,
  label,
}) => {
  return (
    <div className="relative w-full">
      <select
        className={`block w-full py-3 px-4 pr-8 rounded-lg transition duration-150 ease-in-out
          ${isInvalid
            ? "border-2 border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 text-red-700"
            : "border-2 border-[var(--color-primary)] bg-white text-gray-800 focus:ring-2 focus:ring-[var(--color-primary)]"
          }`}
        onChange={(e) => onChange(e.target.value)}
        value={selectedOption}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option?.value} value={option?.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Arrow Icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg
          className={`h-5 w-5 ${isInvalid ? "text-red-400" : "text-[var(--color-primary)]"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>

      {isInvalid && validationMsg && (
        <p className="text-red-500 text-xs mt-1">{validationMsg}</p>
      )}
    </div>
  );
};

export default CustomDropDown;
