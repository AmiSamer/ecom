<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Get active products with their categories
        $products = Product::where('status', 1)
            ->where('current_stock_quantity', '>', 0) // Only show products in stock
            ->with('category')
            ->latest()
            ->take(12) // Show 12 featured products
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug ?: Str::slug($product->name),
                    'price' => (float) $product->price,
                    'image' => $product->image ? Storage::disk('public')->url($product->image) : null,
                    'description' => $product->description,
                    'category' => $product->category ? $product->category->name : null,
                    'category_id' => $product->product_category_id,
                    'inStock' => $product->current_stock_quantity > 0,
                    'stock' => $product->current_stock_quantity,
                ];
            });

        return Inertia::render('Ecommerce/Home', [
            'featuredProducts' => $products,
        ]);
    }

    public function show($slug)
    {
        // Try to find by slug first
        $product = Product::where('slug', $slug)
            ->where('status', 1)
            ->with('category')
            ->first();

        // If not found by slug, try by ID (for backward compatibility with numeric slugs)
        if (!$product && is_numeric($slug)) {
            $product = Product::where('id', $slug)
                ->where('status', 1)
                ->with('category')
                ->first();
        }

        // If still not found, try to find by matching generated slug from name
        // This handles cases where products don't have slugs yet
        if (!$product) {
            $allProducts = Product::where('status', 1)
                ->with('category')
                ->get();
            
            foreach ($allProducts as $p) {
                $generatedSlug = Str::slug($p->name);
                if ($generatedSlug === $slug) {
                    // Update the product with the slug for future use
                    if (!$p->slug) {
                        $p->slug = $generatedSlug;
                        $p->save();
                    }
                    $product = $p;
                    break;
                }
            }
        }

        if (!$product) {
            abort(404);
        }

        // Format product data for frontend
        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug ?: Str::slug($product->name),
            'price' => (float) $product->price,
            'images' => $product->image ? [Storage::disk('public')->url($product->image)] : [],
            'description' => $product->description ?? '',
            'longDescription' => $product->description ?? '',
            'category' => $product->category ? $product->category->name : null,
            'category_id' => $product->product_category_id,
            'inStock' => $product->current_stock_quantity > 0,
            'stock' => $product->current_stock_quantity,
            'brand' => $product->brand,
            'sku' => $product->sku,
            'specifications' => [
                'SKU' => $product->sku,
                'Brand' => $product->brand ?? 'N/A',
                'Category' => $product->category ? $product->category->name : 'N/A',
                'Stock' => $product->current_stock_quantity . ' available',
            ],
        ];

        return Inertia::render('Ecommerce/ProductDetails', [
            'product' => $productData,
        ]);
    }
}
