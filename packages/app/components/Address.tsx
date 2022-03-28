import { truncateString, TruncateStringInterface } from "../utils/truncateString"
import { twMerge } from "tailwind-merge"

interface AddressInterface extends TruncateStringInterface {
    className?: string;
}

export const Address = ({ text, prefix, suffix, className }: AddressInterface): JSX.Element => {
    const classNames = twMerge("rounded-md border-2 px-2", className)

    return (
        <div className={classNames}>{truncateString({ text, prefix, suffix })}</div>
    )
}