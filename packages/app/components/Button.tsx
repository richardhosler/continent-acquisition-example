import { twMerge } from "tailwind-merge"
interface ButtonInterface {
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: string;
    children: React.ReactNode;
}

export const Button = ({ onClick, className, disabled, type, children }: ButtonInterface): (JSX.Element) => {
    const buttonClasses = twMerge("rounded-md px-2 pb-1 border-2 bg-slate-200 place-items-center", className)

    return (
        <button className={buttonClasses} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}