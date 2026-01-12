import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import EcommerceLayout from '@/Layouts/EcommerceLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    description: string;
    longDescription?: string;
    category?: string;
    inStock: boolean;
    stock?: number;
    rating?: number;
    reviews?: number;
    specifications?: { [key: string]: string };
}

interface ProductDetailsProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
    product: Product;
    csrf_token?: string;
}

export default function ProductDetails({ auth, product }: ProductDetailsProps) {
    const { props } = usePage();
    const pageProps = props as unknown as { csrf_token?: string };
    const csrfToken = pageProps.csrf_token || '';
    
    // Update meta tag with fresh CSRF token
    useEffect(() => {
        if (csrfToken) {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.setAttribute('content', csrfToken);
            }
        }
    }, [csrfToken]);
    
    const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
    const [quantity, setQuantity] = useState(1);

    const [addingToCart, setAddingToCart] = useState(false);

    const handleAddToCart = async () => {
        if (!auth?.user) {
            // Preserve the current URL so user can return after login
            const returnUrl = window.location.pathname + window.location.search;
            router.visit(route('login') + '?return=' + encodeURIComponent(returnUrl));
            return;
        }

        setAddingToCart(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'CSRF token not found. Please refresh the page.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
                setAddingToCart(false);
                return;
            }

            const response = await fetch(route('cart.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Trigger cart count update event
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Added to Cart!',
                    text: `Added ${quantity} ${product.name} to cart`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#4f46e5',
                    timer: 2000,
                    timerProgressBar: true,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to add to cart',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
            }
        } catch (error) {
            console.error('Cart error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!auth?.user) {
            // Redirect to login, then to checkout after login
            router.visit(route('login') + '?return=' + encodeURIComponent(route('checkout')));
            return;
        }

        // Add to cart first, then go to checkout
        setAddingToCart(true);
        try {
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
                setAddingToCart(false);
                return;
            }

            const response = await fetch(route('cart.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity,
                }),
            });

            if (response.ok) {
                // Trigger cart count update event
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                
                router.visit(route('checkout'));
            } else {
                const data = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to add to cart',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
            }
        } catch (error) {
            console.error('Cart error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <EcommerceLayout>
            <Head title={`${product.name} - ShopHub`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/products" className="hover:text-indigo-600">Products</Link></li>
                        <li>/</li>
                        <li className="text-gray-900">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(image)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                            selectedImage === image
                                                ? 'border-indigo-600'
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {product.category && (
                            <span className="text-sm text-indigo-600 font-semibold uppercase">
                                {product.category}
                            </span>
                        )}
                        <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating!) ? 'fill-current' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-600">
                                    {product.rating} ({product.reviews || 0} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-4xl font-bold text-indigo-600">
                                    ৳{product.price.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <span className="text-2xl text-gray-400 line-through">
                                            ৳{product.originalPrice.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.inStock ? (
                                <span className="inline-flex items-center text-green-600">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {product.stock ? `In Stock (${product.stock} available)` : 'In Stock'}
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-red-600">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        {product.inStock && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {product.inStock && (
                            <div className="flex space-x-4 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={addingToCart}
                                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingToCart ? 'Processing...' : 'Buy Now'}
                                </button>
                            </div>
                        )}

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                                <dl className="space-y-2">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex">
                                            <dt className="text-gray-600 font-medium w-1/3">{key}:</dt>
                                            <dd className="text-gray-900">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                    </div>
                </div>

                {/* Long Description */}
                {product.longDescription && (
                    <div className="mt-12 border-t pt-8">
                        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                        <div className="prose max-w-none text-gray-700">
                            <p className="whitespace-pre-line">{product.longDescription}</p>
                        </div>
                    </div>
                )}
            </div>
        </EcommerceLayout>
    );
}
