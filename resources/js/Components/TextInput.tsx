import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useRef,
} from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    function TextInput(
        {
            type = 'text',
            className = '',
            isFocused = false,
            ...props
        },
        ref,
    ) {
        const localRef = useRef<HTMLInputElement>(null);

        // Merge refs: use forwarded ref if provided, otherwise use local ref
        const setRefs = (element: HTMLInputElement | null) => {
            localRef.current = element;
            if (typeof ref === 'function') {
                ref(element);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
            }
        };

        useEffect(() => {
            if (isFocused && localRef.current) {
                localRef.current.focus();
            }
        }, [isFocused]);

        return (
            <input
                {...props}
                type={type}
                className={
                    'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                    className
                }
                ref={setRefs}
            />
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;
