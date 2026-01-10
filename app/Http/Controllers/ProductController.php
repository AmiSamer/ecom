<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Sample products - in a real app, these would come from a database
        $products = [
            [
                'id' => 1,
                'name' => 'Wireless Headphones',
                'slug' => 'wireless-headphones',
                'price' => 99.99,
                'originalPrice' => 129.99,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                'images' => [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
                ],
                'description' => 'Premium wireless headphones with noise cancellation',
                'longDescription' => 'Experience premium sound quality with our wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals alike.',
                'category' => 'Electronics',
                'inStock' => true,
                'stock' => 50,
                'rating' => 4.5,
                'reviews' => 128,
                'specifications' => [
                    'Battery Life' => '30 hours',
                    'Connectivity' => 'Bluetooth 5.0',
                    'Weight' => '250g',
                    'Color' => 'Black',
                ],
            ],
            [
                'id' => 2,
                'name' => 'Smart Watch',
                'slug' => 'smart-watch',
                'price' => 249.99,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                'images' => [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                ],
                'description' => 'Feature-rich smartwatch with health tracking',
                'longDescription' => 'Stay connected and healthy with our advanced smartwatch. Track your fitness, receive notifications, and monitor your health metrics all day long.',
                'category' => 'Electronics',
                'inStock' => true,
                'stock' => 30,
                'rating' => 4.8,
                'reviews' => 256,
                'specifications' => [
                    'Display' => '1.4" AMOLED',
                    'Battery' => 'Up to 7 days',
                    'Water Resistance' => '5 ATM',
                    'Sensors' => 'Heart rate, GPS, Accelerometer',
                ],
            ],
            [
                'id' => 3,
                'name' => 'Running Shoes',
                'slug' => 'running-shoes',
                'price' => 129.99,
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                'images' => [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                ],
                'description' => 'Comfortable running shoes for all terrains',
                'longDescription' => 'Designed for runners who demand performance and comfort. These shoes feature advanced cushioning technology and breathable materials.',
                'category' => 'Fashion',
                'inStock' => true,
                'stock' => 75,
                'rating' => 4.3,
                'reviews' => 89,
            ],
            [
                'id' => 4,
                'name' => 'Leather Backpack',
                'slug' => 'leather-backpack',
                'price' => 179.99,
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
                'images' => [
                    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
                ],
                'description' => 'Stylish leather backpack for everyday use',
                'longDescription' => 'Crafted from premium leather, this backpack combines style and functionality. Perfect for work, travel, or daily commutes.',
                'category' => 'Fashion',
                'inStock' => true,
                'stock' => 40,
                'rating' => 4.6,
                'reviews' => 142,
            ],
            [
                'id' => 5,
                'name' => 'Coffee Maker',
                'slug' => 'coffee-maker',
                'price' => 89.99,
                'image' => 'https://images.unsplash.com/photo-1517668808823-9e24dd21b9d0?w=500',
                'images' => [
                    'https://images.unsplash.com/photo-1517668808823-9e24dd21b9d0?w=500',
                ],
                'description' => 'Automatic coffee maker for perfect brew',
                'longDescription' => 'Start your day right with our programmable coffee maker. Features automatic shut-off, programmable timer, and makes up to 12 cups.',
                'category' => 'Home',
                'inStock' => true,
                'stock' => 60,
                'rating' => 4.4,
                'reviews' => 203,
            ],
            [
                'id' => 6,
                'name' => 'Yoga Mat',
                'slug' => 'yoga-mat',
                'price' => 39.99,
                'image' => 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
                'images' => [
                    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
                ],
                'description' => 'Premium non-slip yoga mat',
                'longDescription' => 'Practice yoga with confidence on our premium non-slip mat. Extra thick for comfort and support during all poses.',
                'category' => 'Fitness',
                'inStock' => true,
                'stock' => 100,
                'rating' => 4.7,
                'reviews' => 167,
            ],
        ];

        return Inertia::render('Ecommerce/Home', [
            'featuredProducts' => $products,
        ]);
    }

    public function show($slug)
    {
        // Sample product - in a real app, this would come from a database
        $products = [
            'wireless-headphones' => [
                'id' => 1,
                'name' => 'Wireless Headphones',
                'slug' => 'wireless-headphones',
                'price' => 99.99,
                'originalPrice' => 129.99,
                'images' => [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
                    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800',
                ],
                'description' => 'Premium wireless headphones with noise cancellation',
                'longDescription' => "Experience premium sound quality with our wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals alike.\n\nKey Features:\n- Active Noise Cancellation\n- 30-hour battery life\n- Bluetooth 5.0 connectivity\n- Comfortable over-ear design\n- Premium sound quality\n- Built-in microphone for calls",
                'category' => 'Electronics',
                'inStock' => true,
                'stock' => 50,
                'rating' => 4.5,
                'reviews' => 128,
                'specifications' => [
                    'Battery Life' => '30 hours',
                    'Connectivity' => 'Bluetooth 5.0',
                    'Weight' => '250g',
                    'Color' => 'Black',
                    'Noise Cancellation' => 'Active',
                    'Microphone' => 'Built-in',
                ],
            ],
            'smart-watch' => [
                'id' => 2,
                'name' => 'Smart Watch',
                'slug' => 'smart-watch',
                'price' => 249.99,
                'images' => [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
                ],
                'description' => 'Feature-rich smartwatch with health tracking',
                'longDescription' => 'Stay connected and healthy with our advanced smartwatch. Track your fitness, receive notifications, and monitor your health metrics all day long.',
                'category' => 'Electronics',
                'inStock' => true,
                'stock' => 30,
                'rating' => 4.8,
                'reviews' => 256,
                'specifications' => [
                    'Display' => '1.4" AMOLED',
                    'Battery' => 'Up to 7 days',
                    'Water Resistance' => '5 ATM',
                    'Sensors' => 'Heart rate, GPS, Accelerometer',
                ],
            ],
        ];

        $product = $products[$slug] ?? null;

        if (!$product) {
            abort(404);
        }

        return Inertia::render('Ecommerce/ProductDetails', [
            'product' => $product,
        ]);
    }
}
