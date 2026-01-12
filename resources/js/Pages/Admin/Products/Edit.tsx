import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';
import { router } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    product_category_id: number;
    name: string;
    description: string | null;
    image: string | null;
    sku: string;
    brand: string | null;
    price: number;
    current_stock_quantity: number;
    low_stock_quantity: number;
    status: number;
}

interface EditProps {
    product: Product;
    categories: Category[];
}

export default function Edit({ product, categories }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        product_category_id: product.product_category_id,
        name: product.name,
        description: product.description || '',
        image: null as File | null,
        sku: product.sku,
        brand: product.brand || '',
        price: product.price.toString(),
        current_stock_quantity: product.current_stock_quantity === 0 ? '' : product.current_stock_quantity,
        low_stock_quantity: product.low_stock_quantity === 0 ? '' : product.low_stock_quantity,
        status: product.status,
        _method: 'PUT' as const,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Transform empty strings to numbers for stock quantities
        const currentStock = data.current_stock_quantity === '' ? 0 : Number(data.current_stock_quantity);
        const lowStock = data.low_stock_quantity === '' ? 0 : Number(data.low_stock_quantity);
        
        // Update form data with transformed values
        setData('current_stock_quantity', currentStock);
        setData('low_stock_quantity', lowStock);
        
        // Submit after state update
        setTimeout(() => {
            post(`/admin/products/${product.id}`, {
                forceFormData: true,
            });
        }, 10);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Edit Product" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="mt-1 text-sm text-gray-600">Update product information</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="product_category_id" value="Category *" />
                            <div className="mt-1">
                                <SearchableSelect
                                    id="product_category_id"
                                    name="product_category_id"
                                    value={data.product_category_id.toString()}
                                    options={[
                                        { value: '', label: 'Select a category' },
                                        ...categories.map((category) => ({
                                            value: category.id.toString(),
                                            label: category.name,
                                        })),
                                    ]}
                                    onChange={(value) => setData('product_category_id', parseInt(value.toString()))}
                                    placeholder="Select a category"
                                    required
                                />
                            </div>
                            <InputError message={errors.product_category_id} className="mt-2" />
                        </div>

                        {/* Name */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="name" value="Product Name *" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={4}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* Image */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="image" value="Product Image" />
                            {product.image && !data.image && (
                                <div className="mt-2 mb-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-32 w-32 object-cover rounded"
                                    />
                                </div>
                            )}
                            {data.image && (
                                <div className="mt-2 mb-4">
                                    <img
                                        src={URL.createObjectURL(data.image)}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded"
                                    />
                                </div>
                            )}
                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={handleImageChange}
                            />
                            <InputError message={errors.image} className="mt-2" />
                        </div>

                        {/* SKU */}
                        <div>
                            <InputLabel htmlFor="sku" value="SKU *" />
                            <TextInput
                                id="sku"
                                type="text"
                                name="sku"
                                value={data.sku}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('sku', e.target.value)}
                                required
                            />
                            <InputError message={errors.sku} className="mt-2" />
                        </div>

                        {/* Brand */}
                        <div>
                            <InputLabel htmlFor="brand" value="Brand" />
                            <TextInput
                                id="brand"
                                type="text"
                                name="brand"
                                value={data.brand}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('brand', e.target.value)}
                            />
                            <InputError message={errors.brand} className="mt-2" />
                        </div>

                        {/* Price */}
                        <div>
                            <InputLabel htmlFor="price" value="Price (BDT) *" />
                            <TextInput
                                id="price"
                                type="number"
                                name="price"
                                value={data.price}
                                className="mt-1 block w-full"
                                step="0.01"
                                min="0"
                                onChange={(e) => setData('price', e.target.value)}
                                required
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>

                        {/* Current Stock */}
                        <div>
                            <InputLabel htmlFor="current_stock_quantity" value="Current Stock *" />
                            <TextInput
                                id="current_stock_quantity"
                                type="number"
                                name="current_stock_quantity"
                                value={data.current_stock_quantity === '' || data.current_stock_quantity === 0 ? '' : data.current_stock_quantity}
                                className="mt-1 block w-full"
                                min="0"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData('current_stock_quantity', value === '' ? '' : parseInt(value) || '');
                                }}
                                required
                            />
                            <InputError message={errors.current_stock_quantity} className="mt-2" />
                        </div>

                        {/* Low Stock Alert */}
                        <div>
                            <InputLabel htmlFor="low_stock_quantity" value="Low Stock Alert *" />
                            <TextInput
                                id="low_stock_quantity"
                                type="number"
                                name="low_stock_quantity"
                                value={data.low_stock_quantity === '' || data.low_stock_quantity === 0 ? '' : data.low_stock_quantity}
                                className={`mt-1 block w-full ${
                                    data.current_stock_quantity !== '' &&
                                    data.low_stock_quantity !== '' &&
                                    Number(data.low_stock_quantity) > Number(data.current_stock_quantity)
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                        : ''
                                }`}
                                min="0"
                                max={data.current_stock_quantity !== '' ? Number(data.current_stock_quantity) : undefined}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData('low_stock_quantity', value === '' ? '' : parseInt(value) || '');
                                }}
                                required
                            />
                            <InputError message={errors.low_stock_quantity} className="mt-2" />
                            {data.current_stock_quantity !== '' &&
                            data.low_stock_quantity !== '' &&
                            Number(data.low_stock_quantity) > Number(data.current_stock_quantity) ? (
                                <p className="mt-1 text-xs text-red-600 font-medium">
                                    ⚠ Low stock alert cannot be greater than current stock ({data.current_stock_quantity})
                                </p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-500">
                                    Alert when stock reaches this level (max: {data.current_stock_quantity !== '' ? data.current_stock_quantity : 'N/A'})
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="status" value="Status *" />
                            <div className="mt-1">
                                <SearchableSelect
                                    id="status"
                                    name="status"
                                    value={data.status.toString()}
                                    options={[
                                        { value: '1', label: 'Active' },
                                        { value: '2', label: 'Inactive' },
                                    ]}
                                    onChange={(value) => setData('status', parseInt(value.toString()))}
                                    placeholder="Select status"
                                    required
                                />
                            </div>
                            <InputError message={errors.status} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => router.visit('/admin/products')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Updating...' : 'Update Product'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
