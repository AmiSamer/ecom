import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';

interface Role {
    id: number;
    name: string;
}

interface CreateProps {
    roles: Role[];
}

export default function Create({ roles }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        status: 1,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Create User" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create User</h1>
                <p className="mt-1 text-sm text-gray-600">Add a new user</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="name" value="Name *" />
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="email" value="Email *" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <InputLabel htmlFor="password" value="Password *" />
                            <TextInput
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password *" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Role */}
                        <div>
                            <InputLabel htmlFor="role_id" value="Role *" />
                            <div className="mt-1">
                                <SearchableSelect
                                    id="role_id"
                                    name="role_id"
                                    value={data.role_id}
                                    options={[
                                        { value: '', label: 'Select a role' },
                                        ...roles.map((role) => ({
                                            value: role.id.toString(),
                                            label: role.name,
                                        })),
                                    ]}
                                    onChange={(value) => setData('role_id', value.toString())}
                                    placeholder="Select a role"
                                    required
                                />
                            </div>
                            <InputError message={errors.role_id} className="mt-2" />
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
                                    onChange={(value) => setData('status', Number(value))}
                                    placeholder="Select status"
                                    required
                                />
                            </div>
                            <InputError message={errors.status} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end space-x-4">
                        <a
                            href="/admin/users"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </a>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Creating...' : 'Create User'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
