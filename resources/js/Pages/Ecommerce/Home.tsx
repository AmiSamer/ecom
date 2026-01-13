import { Head, Link } from '@inertiajs/react';
import EcommerceLayout from '@/Layouts/EcommerceLayout';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
}

interface HomeProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
    featuredProducts?: Product[];
}

export default function Home({ auth, featuredProducts = [] }: HomeProps) {
    const products: Product[] = featuredProducts;

    return (
        <EcommerceLayout>
            <Head title="Home - ShopHub" />

            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
                    }}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>
                
                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                            Welcome to ShopHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">
                            Discover amazing products at best prices
                        </p>
                        <Link
                            href="#"
                            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-600">Handpicked products just for you</p>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                                >
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        {product.category && (
                                            <span className="text-xs text-indigo-600 font-semibold uppercase">
                                                {product.category}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-2 group-hover:text-indigo-600 transition">
                                            {product.name}
                                        </h3>
                                        {product.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-indigo-600">
                                                ৳{product.price.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                            </span>
                                            <span className="text-indigo-600 group-hover:translate-x-1 transition inline-block">
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="mt-4 text-gray-600">No products available at the moment</p>
                    </div>
                )}
            </section>

            {/* Features Section */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                            <p className="text-gray-600">On orders over $50</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                            <p className="text-gray-600">We're here to help</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                            <p className="text-gray-600">100% secure transactions</p>
                        </div>
                    </div>
                </div>
            </section>
        </EcommerceLayout>
    );
}
