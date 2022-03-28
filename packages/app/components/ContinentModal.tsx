
import React, { memo, useEffect, useState } from "react";
import Modal from "react-modal";
import { useContractWrite, useProvider } from "wagmi";
import { convertStringToByteArray } from "../utils/convertStringToByteArray";
import { Button } from "./Button";
import continentToken from "../../contract/build/ContinentToken.json"


interface ContinentModalInterface {
    children: React.ReactNode;
}
export const ContinentModal = ({ children }: ContinentModalInterface) => {
    const modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    }
    const provider = useProvider();
    const [{ data: relinquishContinentData, error: relinquishContinentError, loading: relinquishContinentLoading }, relinquishContinentCall] = useContractWrite({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "relinquishContinent")
    const [{ data: transferContinentData, error: transferContinentError, loading: transferContinentLoading }, transferContinentCall] = useContractWrite({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "transferContinent")

    const callRelinquishContinent = (ISO: string) => {
        relinquishContinentCall({ args: convertStringToByteArray({ s: ISO }) })
    }
    const callTransferContinent = (from: string, to: string, ISO: string) => {
        transferContinentCall({ args: [from, to, convertStringToByteArray({ s: ISO })] })
    }
    const [modalIsOpen, setIsOpen] = useState(false);
    Modal.setAppElement('#__next');

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Modal"
            style={modalStyle}
        >
            {children}
        </Modal>
    )
}