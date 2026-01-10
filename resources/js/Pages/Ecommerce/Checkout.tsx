import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import EcommerceLayout from '@/Layouts/EcommerceLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CheckoutProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
    cartItems?: CartItem[];
}

export default function Checkout({ auth, cartItems = [] }: CheckoutProps) {
    const [formData, setFormData] = useState({
        email: auth?.user?.email || '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        sameAsShipping: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Sample cart items if none provided
    const items: CartItem[] = cartItems.length > 0 ? cartItems : [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 10.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors: { [key: string]: string } = {};
        
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv) newErrors.cvv = 'CVV is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Process order (would typically call an API)
        alert('Order placed successfully!');
    };

    return (
        <EcommerceLayout auth={auth}>
            <Head title="Checkout - ShopHub" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" children={undefined} />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="firstName" value="First Name" children={undefined} />
                                        <TextInput
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.firstName} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="lastName" value="Last Name" children={undefined} />
                                        <TextInput
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.lastName} className="mt-2" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="address" value="Address" children={undefined} />
                                    <TextInput
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <InputLabel htmlFor="city" value="City" children={undefined} />
                                        <TextInput
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="state" value="State" children={undefined} />
                                        <TextInput
                                            id="state"
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="zipCode" value="ZIP Code" children={undefined} />
                                        <TextInput
                                            id="zipCode"
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.zipCode} className="mt-2" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="country" value="Country" children={undefined} />
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>Australia</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="phone" value="Phone" children={undefined} />
                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                                <div className="mt-4">
                                    <InputLabel htmlFor="cardNumber" value="Card Number" children={undefined} />
                                    <TextInput
                                        id="cardNumber"
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="1234 5678 9012 3456"
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.cardNumber} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="cardName" value="Cardholder Name" children={undefined} />
                                    <TextInput
                                        id="cardName"
                                        type="text"
                                        name="cardName"
                                        value={formData.cardName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.cardName} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <InputLabel htmlFor="expiryDate" value="Expiry Date" children={undefined} />
                                        <TextInput
                                            id="expiryDate"
                                            type="text"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM/YY"
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.expiryDate} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="cvv" value="CVV" children={undefined} />
                                        <TextInput
                                            id="cvv"
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="123"
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.cvv} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            <PrimaryButton type="submit" className="w-full py-3 text-lg" disabled={false}>
                                Place Order
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm">{item.name}</h3>
                                            <p className="text-gray-600 text-sm">
                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <span className="font-semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                href="/"
                                className="block text-center text-indigo-600 hover:text-indigo-700 mt-4 text-sm"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
