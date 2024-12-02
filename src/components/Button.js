

const Button = ({ onClick, type, text, padding, backgroundColor, borderRadius, outline, title, width, fontSize, color, className, href, download, formNoValidate}) => {
    const style = {
        backgroundColor,
        padding,
        fontSize,
        borderRadius,
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: 'white',
        width: width
    };

    return href ?(
        <button title={title} type={type}
            onClick={onClick} formNoValidate={formNoValidate}>
            <a href={href}>
                {text}
            </a>
        </button>
    ) : (
        <button type={type} onClick={onClick} className={className} title={title} style={style} formNoValidate={formNoValidate}>
            {text}
        </button>
    )
}

export default Button;
