import { twMerge } from "tailwind-merge";
import Image from "next/image";

interface ButtonInterface {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: string;
  icon?: string;
  children: React.ReactNode;
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
    "bg-slate-100 hover:bg-slate-200 text-slate-900 focus:bg-slate-300 font-medium rounded-sm text-sm px-5 py-1 text-center inline-flex items-center space-x-2",
    className
  );
  console.log(buttonClasses);

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
