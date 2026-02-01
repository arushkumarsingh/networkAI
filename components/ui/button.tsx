import * as React from "react";

type Variant = "default" | "outline";
type Size = "sm" | "lg" | "md";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base"
};

const variantStyles: Record<Variant, string> = {
  default: "bg-ink text-white hover:bg-black",
  outline: "border border-black/20 bg-white hover:bg-black/5"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", asChild, ...props }, ref) => {
    if (asChild) {
      return (
        <span
          className={`inline-flex items-center justify-center rounded-full font-semibold transition ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        >
          {props.children}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-full font-semibold transition ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
