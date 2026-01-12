import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EcommerceLayout from '@/Layouts/EcommerceLayout';
import PrimaryButton from '@/Components/PrimaryButton';
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

export default function Cart() {
    const { props } = usePage();
    const pageProps = props as unknown as { csrf_token?: string };
    const csrfToken = pageProps.csrf_token || '';
    
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Update meta tag with fresh CSRF token
    useEffect(() => {
        if (csrfToken) {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.setAttribute('content', csrfToken);
            }
        }
    }, [csrfToken]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            const cartData = await response.json();
            setCart(cartData);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId: number, quantity: number) => {
        if (quantity < 1) return;
        
        setUpdating(true);
        try {
            // Use CSRF token from Inertia props (always fresh)
            const token = csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!token) {
                alert('CSRF token not found. Please refresh the page.');
                setUpdating(false);
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
            setUpdating(false);
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
        
        setUpdating(true);
        try {
            // Use CSRF token from Inertia props (always fresh)
            const token = csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!token) {
                alert('CSRF token not found. Please refresh the page.');
                setUpdating(false);
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
            setUpdating(false);
        }
    };

    const clearCart = async () => {
        const result = await Swal.fire({
            title: 'Clear Cart?',
            text: 'Are you sure you want to clear your entire cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear it',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;
        
        setUpdating(true);
        try {
            // Use CSRF token from Inertia props (always fresh)
            const token = csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!token) {
                alert('CSRF token not found. Please refresh the page.');
                setUpdating(false);
                return;
            }

            const response = await fetch(route('cart.clear'), {
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
                alert('Failed to clear cart');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <EcommerceLayout>
                <Head title="Shopping Cart - ShopHub" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">Loading...</div>
                </div>
            </EcommerceLayout>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <EcommerceLayout>
                <Head title="Shopping Cart - ShopHub" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
                        <p className="mt-2 text-gray-600">Start shopping to add items to your cart.</p>
                        <Link href={route('home')} className="mt-6 inline-block">
                            <PrimaryButton>Continue Shopping</PrimaryButton>
                        </Link>
                    </div>
                </div>
            </EcommerceLayout>
        );
    }

    return (
        <EcommerceLayout>
            <Head title="Shopping Cart - ShopHub" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        disabled={updating}
                        className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow divide-y">
                            {cart.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-start space-x-4">
                                    {item.product_image && (
                                        <Link href={`/products/${item.product_slug}`}>
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        </Link>
                                    )}
                                    <div className="flex-1">
                                        <Link
                                            href={`/products/${item.product_slug}`}
                                            className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                                        >
                                            {item.product_name}
                                        </Link>
                                        <p className="text-gray-600 mt-1">৳{item.price.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</p>
                                        
                                        {!item.in_stock && (
                                            <p className="text-red-600 text-sm mt-2">Out of stock</p>
                                        )}
                                        {item.in_stock && item.quantity > item.stock && (
                                            <p className="text-yellow-600 text-sm mt-2">Only {item.stock} available</p>
                                        )}

                                        <div className="flex items-center space-x-2 mt-4">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={updating || item.quantity <= 1}
                                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={updating || !item.in_stock || item.quantity >= item.stock}
                                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={updating}
                                                className="ml-4 text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold">৳{item.subtotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cart.item_count} items)</span>
                                    <span>৳{cart.total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>৳0.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>৳0.00</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>৳{cart.total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <Link href={route('checkout')} className="block mt-6">
                                <PrimaryButton className="w-full">Proceed to Checkout</PrimaryButton>
                            </Link>
                            <Link href={route('home')} className="block mt-4 text-center text-indigo-600 hover:text-indigo-700">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
