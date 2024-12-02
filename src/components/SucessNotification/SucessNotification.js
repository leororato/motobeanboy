import React, { useEffect, useState } from "react";
import './SucessNotification.css';
import { Icon } from '@iconify/react';

const SucessNotification = ({ message, onClose }) => {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }

        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [message])

    if (!message) return null;

    // Se message for um objeto converte ela para uma string
    const displayMessage = typeof message === 'object' ? JSON.stringify(message) : message;

    return (
        <>
            {visible && (
                <div className="sucess-notification">
                    <div className="sucess-message">
                        {displayMessage}
                    </div>
                    <button className="sucess-close" onClick={onClose}><Icon icon="ep:close-bold" id="icone-fechar-message" /></button>
                </div>
            )}
        </>
    );
}

export default SucessNotification;
