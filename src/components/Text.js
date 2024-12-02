
const Text = ({text, color, fontSize, cursor, href, onClick, className}) => {
    const style = {
       color,
       fontSize,
       cursor  
    }

return href ?(
    <p
        onClick={onClick}>
        <a href={href}>
            {text}
        </a>
    </p>
) : (
    <p onClick={onClick} className={className} style={style}>
        {text}
    </p>
)
} 

export default Text