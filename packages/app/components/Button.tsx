import { memo, MouseEventHandler } from "react";
import classNames from "classnames"

interface ButtonInterface {
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: string;
    children: React.ReactNode;
}

const Button = ({ onClick, className, disabled, type, children }: ButtonInterface) => {
    const buttonClasses = classNames("rounded-md px-3 pb-1 border-2 bg-slate-400", className)
    console.log({ disabled });

    return (
        <button className={buttonClasses} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}

export default memo(Button);
