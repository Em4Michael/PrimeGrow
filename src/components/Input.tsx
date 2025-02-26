import React, { forwardRef } from 'react';

interface InputProps {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    className?: string;
    required?: boolean;
    pattern?: string;
    title?: string;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    maxLength?: number;
    name?: string;
    id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    value,
    onChange,
    placeholder = '',
    type = 'text',
    className,
    onFocus,
    onBlur,
    maxLength,
    pattern,
    title,
    name,
    id,
    required = false,
}, ref) => {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={maxLength}
            ref={ref}
            required={required}
            pattern={pattern}
            title={title}
            id={id}
            className={`w-full  h-[50px] rounded-full border-2 border-solid border-black-400 outline-none pl-[1rem] mb-[1rem] font-Sora font-medium text-[14px] xs:text-[16px] bg-gray-200 focus:border-green-400 ${className}`}
        />
    );
});

Input.displayName = 'Input';

export default Input;
