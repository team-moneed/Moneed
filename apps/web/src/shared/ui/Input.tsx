'use client';

type InputType = HTMLInputElement['type'];

interface InputProps {
    type: InputType;
    onChange: () => void;
    className: string;
    placeholder: string;
    value?: string;
}

const Input = ({ type, onChange, className, placeholder, value }: InputProps) => {
    return (
        <div>
            <input
                type={type}
                onChange={onChange}
                className={className}
                placeholder={placeholder}
                value={value}
            ></input>
        </div>
    );
};

export default Input;
