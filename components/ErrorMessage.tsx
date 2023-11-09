
interface errorMessageProps {
    text : string;
};

export default function ErrorMessage({text} : errorMessageProps){
    return <p className = "errorMessage">{text}</p>
}

