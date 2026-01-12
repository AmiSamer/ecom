<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles first
        $this->call([
            RoleSeeder::class,
        ]);

        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role_id' => 1, // admin
                'status' => 1, // active
            ]
        );

        // Create regular user
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
            'name' => 'Test User',
                'email' => 'user@example.com',
                'password' => Hash::make('password'),
                'role_id' => 2, // user
                'status' => 1, // active
            ]
        );
    }
}
