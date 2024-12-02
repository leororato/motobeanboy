import React, { useEffect, useState } from "react";
import './ErrorNotification.css';
import { Icon } from '@iconify/react';

const ErrorNotification = ({ message, onClose }) => {

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
    }, [message]);

    if (!message) return null;

    const displayMessage = typeof message === 'object' ? JSON.stringify(message) : message;

    return (
        <>
            {visible && (
                <div className="error-notification">
                    <div className="error-message">
                        {displayMessage}
                    </div>
                    <button className="error-close" onClick={onClose}><Icon icon="ep:close-bold" id="icone-fechar-message" /></button>
                </div>
            )}
        </>
    );
}

export default ErrorNotification;
