import { useState, useRef, useEffect } from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    id: string;
    name: string;
    value: string | number;
    options: Option[];
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}

export default function SearchableSelect({
    id,
    name,
    value,
    options,
    onChange,
    placeholder = 'Select an option...',
    className = '',
    required = false,
    disabled = false,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredOptions(options);
        } else {
            const filtered = options.filter((option) =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOptions(filtered);
        }
    }, [searchTerm, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Focus search input when dropdown opens
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500
                    text-left px-3 py-2 bg-white border
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                `}
            >
                <div className="flex items-center justify-between">
                    <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <svg
                        className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Options List */}
                    <div className="py-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500 text-center">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-900
                                        ${value === option.value ? 'bg-indigo-100 text-indigo-900 font-medium' : 'text-gray-900'}
                                    `}
                                >
                                    {option.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Hidden input for form submission */}
            <input
                type="hidden"
                id={id}
                name={name}
                value={value}
                required={required}
            />
        </div>
    );
}
