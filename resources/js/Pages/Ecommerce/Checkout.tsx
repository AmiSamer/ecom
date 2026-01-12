import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EcommerceLayout from '@/Layouts/EcommerceLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface CartItem {
    id: number;
    product_id: number;
    product_name: string;
    product_slug: string;
    product_image: string | null;
    price: number;
    quantity: number;
    subtotal: number;
    stock: number;
    in_stock: boolean;
}

interface CartData {
    items: CartItem[];
    total: number;
    item_count: number;
}

interface CheckoutProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
}

export default function Checkout({ auth }: CheckoutProps) {
    const { props } = usePage();
    const pageProps = props as unknown as { csrf_token?: string };
    const csrfToken = pageProps.csrf_token || '';
    
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);

    // Update meta tag with fresh CSRF token
    useEffect(() => {
        if (csrfToken) {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.setAttribute('content', csrfToken);
            }
        }
    }, [csrfToken]);

    const { data, setData, errors } = useForm({
        contact_name: auth?.user?.name || '',
        contact_phone: '',
        shipping_address: '',
        payment_method: 'cash_on_delivery',
        notes: '',
    });

    useEffect(() => {
        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }

        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            const cartData = await response.json();
            setCart(cartData);
            
            if (cartData.items.length === 0) {
                router.visit(route('home'));
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId: number, quantity: number) => {
        if (quantity < 1) return;
        
        setCartLoading(true);
        try {
            // Use CSRF token from Inertia props (always fresh)
            const token = csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!token) {
                alert('CSRF token not found. Please refresh the page.');
                setCartLoading(false);
                return;
            }

            const response = await fetch(route('cart.update', cartId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ quantity }),
            });

            if (response.ok) {
                await fetchCart();
                // Trigger cart count update event
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update cart');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setCartLoading(false);
        }
    };

    const removeItem = async (cartId: number) => {
        const result = await Swal.fire({
            title: 'Remove Item?',
            text: 'Are you sure you want to remove this item from cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;
        
        setCartLoading(true);
        try {
            // Use CSRF token from Inertia props (always fresh)
            const token = csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!token) {
                alert('CSRF token not found. Please refresh the page.');
                setCartLoading(false);
                return;
            }

            const response = await fetch(route('cart.destroy', cartId), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                await fetchCart();
                // Trigger cart count update event
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            } else {
                alert('Failed to remove item');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setCartLoading(false);
        }
    };

    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Use CSRF token from Inertia props (always fresh)
        const token = csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'CSRF token not found. Please refresh the page.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(route('orders.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    text: result.message || 'Order placed successfully!',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#4f46e5',
                }).then(() => {
                    router.visit(route('home'));
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || Object.values(result.errors || {}).join(', ') || 'Failed to place order. Please try again.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <EcommerceLayout>
                <Head title="Checkout - ShopHub" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">Loading...</div>
                </div>
            </EcommerceLayout>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <EcommerceLayout>
                <Head title="Checkout - ShopHub" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Your cart is empty.</p>
                        <Link href={route('home')} className="text-indigo-600 hover:text-indigo-700">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </EcommerceLayout>
        );
    }

    const subtotal = cart.total;
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    return (
        <EcommerceLayout>
            <Head title="Checkout - ShopHub" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="contact_name" value="Full Name *" children={undefined} />
                                        <TextInput
                                            id="contact_name"
                                            type="text"
                                            value={data.contact_name}
                                            onChange={(e) => setData('contact_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.contact_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="contact_phone" value="Phone Number *" children={undefined} />
                                        <TextInput
                                            id="contact_phone"
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.contact_phone} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                                <div>
                                    <InputLabel htmlFor="shipping_address" value="Address *" children={undefined} />
                                    <textarea
                                        id="shipping_address"
                                        value={data.shipping_address}
                                        onChange={(e) => setData('shipping_address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={3}
                                        required
                                    />
                                    <InputError message={errors.shipping_address} className="mt-2" />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cash_on_delivery"
                                            checked={data.payment_method === 'cash_on_delivery'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mr-2"
                                        />
                                        <span>Cash on Delivery</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="card"
                                            checked={data.payment_method === 'card'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mr-2"
                                        />
                                        <span>Card Payment</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="bank_transfer"
                                            checked={data.payment_method === 'bank_transfer'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mr-2"
                                        />
                                        <span>Bank Transfer</span>
                                    </label>
                                </div>
                                <InputError message={errors.payment_method} className="mt-2" />
                            </div>

                            {/* Notes */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <InputLabel htmlFor="notes" value="Order Notes (Optional)" children={undefined} />
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Any special instructions for your order..."
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div className="flex justify-end">
                                <PrimaryButton disabled={submitting || cartLoading}>
                                    {submitting ? 'Processing...' : 'Place Order'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex items-start space-x-4 pb-4 border-b">
                                        {item.product_image && (
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <Link
                                                href={`/products/${item.product_slug}`}
                                                className="font-medium text-gray-900 hover:text-indigo-600"
                                            >
                                                {item.product_name}
                                            </Link>
                                            <p className="text-sm text-gray-600">৳{item.price.toLocaleString('en-BD', { minimumFractionDigits: 2 })} × {item.quantity}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={cartLoading || item.quantity <= 1}
                                                    className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={cartLoading || !item.in_stock || item.quantity >= item.stock}
                                                    className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={cartLoading}
                                                    className="ml-2 text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">৳{item.subtotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>৳{subtotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>৳{shipping.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>৳{tax.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total</span>
                                    <span>৳{total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
