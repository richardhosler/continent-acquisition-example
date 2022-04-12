import { twMerge } from "tailwind-merge";
import Image from "next/image";

interface ButtonInterface {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: string;
  icon?: string;
  children?: React.ReactNode;
  iconClassName?: string;
  iconWidth?: number;
  iconHeight?: number;
}

export const Button = ({
  onClick,
  className,
  disabled,
  type,
  children,
  icon,
  iconClassName,
  iconWidth = 18,
  iconHeight = 18,
}: ButtonInterface): JSX.Element => {
  const buttonClasses = twMerge(
    "inline-flex text-slate-100 bg-slate-700 hover:bg-slate-600 focus:bg-slate-500 font-medium rounded-sm text-sm px-3 py-2 space-x-2",
    className
  );

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {icon && (
        <Image
          width={iconWidth}
          height={iconHeight}
          className={iconClassName}
          src={icon}
          alt="Button Icon"
        />
      )}
      <div>{children}</div>
    </button>
  );
};
