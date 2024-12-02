import React, { useState } from 'react';

const Input = ({
    type,
    placeholder,
    backgroundColor,
    fontSize,
    padding,
    name,
    onChange,
    title,
    value,
    checked,
    readOnly,
    defaultValue,
    min,
    className
}) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const handleMouseMove = (e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} id='div-input-customizado'>
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                checked={checked}
                min={min}
                onChange={onChange}
                readOnly={readOnly}
                className={className}
                defaultValue={defaultValue}
                style={{
                    backgroundColor: backgroundColor,
                    fontSize: fontSize,
                    padding: padding,
                    // Estilos para remover as flechinhas
                    appearance: type === 'number' ? 'none' : 'auto',
                    MozAppearance: type === 'number' ? 'textfield' : 'auto',
                    WebkitAppearance: type === 'number' ? 'none' : 'auto',
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            />
            {tooltipVisible && title && (
                <div
                    style={{
                        position: 'fixed',
                        top: tooltipPosition.y + 'px',
                        left: tooltipPosition.x + 15 + 'px',
                        backgroundColor: '#1780e2',
                        color: '#fff',
                        padding: '4px 10px',
                        fontSize: '14px',
                        borderRadius: '2px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 1000,
                    }}
                >
                    {title}
                </div>
            )}
        </div>
    );
};

export default Input;