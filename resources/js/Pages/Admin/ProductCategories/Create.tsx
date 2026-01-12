import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';
import { router } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        image: null as File | null,
        sku: '',
        status: 1,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/categories', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Create Product Category" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create Product Category</h1>
                <p className="mt-1 text-sm text-gray-600">Add a new product category</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Name */}
                        <div>
                            <InputLabel htmlFor="name" value="Name *" />
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
                        <div>
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
                        <div>
                            <InputLabel htmlFor="image" value="Image" />
                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={handleImageChange}
                            />
                            {data.image && (
                                <div className="mt-2">
                                    <img
                                        src={URL.createObjectURL(data.image)}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded"
                                    />
                                </div>
                            )}
                            <InputError message={errors.image} className="mt-2" />
                        </div>

                        {/* SKU */}
                        <div>
                            <InputLabel htmlFor="sku" value="SKU" />
                            <TextInput
                                id="sku"
                                type="text"
                                name="sku"
                                value={data.sku}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('sku', e.target.value)}
                            />
                            <InputError message={errors.sku} className="mt-2" />
                        </div>

                        {/* Status */}
                        <div>
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
                            onClick={() => router.visit('/admin/categories')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Creating...' : 'Create Category'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
