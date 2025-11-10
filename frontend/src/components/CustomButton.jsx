import React from "react";

const baseStyles = `
  inline-flex items-center justify-center rounded-lg font-semibold
  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
`;

const variants = {
  primary: `bg-[#1e3a8a] text-white hover:bg-[#3a6de0] focus:ring-[#4880FF]`,
  secondary: `bg-white text-[#4880FF] border border-[#4880FF] hover:bg-[#4880FF] hover:text-white focus:ring-[#4880FF]`,
  danger: `bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`,
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg",
};

const CustomButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const disabledClass = disabled
    ? "opacity-60 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
