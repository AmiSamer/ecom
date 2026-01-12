<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Jobs\SendLowStockNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Search functionality - only apply if search is not empty
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        // Category filter - only apply if category_id is not empty
        if ($request->filled('category_id')) {
            $query->where('product_category_id', $request->category_id);
        }

        // Status filter - only apply if status is not empty
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Low stock filter - only apply if low_stock is not empty
        if ($request->filled('low_stock')) {
            $query->whereColumn('current_stock_quantity', '<=', 'low_stock_quantity');
        }

        $products = $query->latest()
            ->paginate($request->get('per_page', 10))
            ->withQueryString()
            ->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'image' => $product->image ? Storage::disk('public')->url($product->image) : null,
                    'sku' => $product->sku,
                    'brand' => $product->brand,
                    'price' => $product->price,
                    'current_stock_quantity' => $product->current_stock_quantity,
                    'low_stock_quantity' => $product->low_stock_quantity,
                    'status' => $product->status,
                    'is_low_stock' => $product->isLowStock(),
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ] : null,
                    'created_at' => $product->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Ensure pagination structure is properly formatted
        $productsArray = $products->toArray();

        $categories = ProductCategory::where('status', 1)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Index', [
            'products' => [
                'data' => $productsArray['data'],
                'links' => $productsArray['links'],
                'current_page' => $productsArray['current_page'],
                'last_page' => $productsArray['last_page'],
                'per_page' => $productsArray['per_page'],
                'total' => $productsArray['total'],
                'from' => $productsArray['from'],
                'to' => $productsArray['to'],
            ],
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id', 'status', 'low_stock']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = ProductCategory::where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'sku' => 'required|string|max:255|unique:products,sku',
            'brand' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'current_stock_quantity' => 'required|integer|min:0',
            'low_stock_quantity' => [
                'required',
                'integer',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($value > $request->current_stock_quantity) {
                        $fail('The low stock alert must be less than or equal to the current stock quantity.');
                    }
                },
            ],
            'status' => 'required|integer|in:1,2',
        ]);

        $data = [
            'product_category_id' => $validated['product_category_id'],
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'sku' => $validated['sku'],
            'brand' => $validated['brand'] ?? null,
            'price' => $validated['price'],
            'current_stock_quantity' => $validated['current_stock_quantity'],
            'low_stock_quantity' => $validated['low_stock_quantity'],
            'status' => $validated['status'],
            'updated_by' => auth()->id(),
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filenameBase = 'products/' . Str::uuid();
            
            $manager = new ImageManager(new GdDriver());
            $img = $manager->read($file->getRealPath())
                ->scaleDown(1200, 1200);
            try {
                $storedPath = $filenameBase . '.webp';
                $binary = $img->toWebp(80)->toString();
            } catch (\Throwable $e) {
                $storedPath = $filenameBase . '.jpg';
                $binary = $img->toJpeg(80)->toString();
            }
            Storage::disk('public')->put($storedPath, $binary);
            $data['image'] = $storedPath;
        }

        $product = Product::create($data);
        
        // Check if stock is low and dispatch notification job
        if ($product->isLowStock()) {
            SendLowStockNotification::dispatch($product);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = ProductCategory::where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Products/Edit', [
            'product' => [
                'id' => $product->id,
                'product_category_id' => $product->product_category_id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => $product->image ? Storage::disk('public')->url($product->image) : null,
                'sku' => $product->sku,
                'brand' => $product->brand,
                'price' => $product->price,
                'current_stock_quantity' => $product->current_stock_quantity,
                'low_stock_quantity' => $product->low_stock_quantity,
                'status' => $product->status,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'sku' => 'required|string|max:255|unique:products,sku,' . $product->id,
            'brand' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'current_stock_quantity' => 'required|integer|min:0',
            'low_stock_quantity' => [
                'required',
                'integer',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($value > $request->current_stock_quantity) {
                        $fail('The low stock alert must be less than or equal to the current stock quantity.');
                    }
                },
            ],
            'status' => 'required|integer|in:1,2',
        ]);

        $product->name = $validated['name'];
        $product->slug = Str::slug($validated['name']);
        $product->description = $validated['description'] ?? null;
        $product->sku = $validated['sku'];
        $product->brand = $validated['brand'] ?? null;
        $product->price = $validated['price'];
        $product->current_stock_quantity = $validated['current_stock_quantity'];
        $product->low_stock_quantity = $validated['low_stock_quantity'];
        $product->status = $validated['status'];
        $product->updated_by = auth()->id();

        // Handle image update
        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            // Upload and optimize new image
            $file = $request->file('image');
            $filenameBase = 'products/' . Str::uuid();
            
            $manager = new ImageManager(new GdDriver());
            $img = $manager->read($file->getRealPath())
                ->scaleDown(1200, 1200);
            try {
                $storedPath = $filenameBase . '.webp';
                $binary = $img->toWebp(80)->toString();
            } catch (\Throwable $e) {
                $storedPath = $filenameBase . '.jpg';
                $binary = $img->toJpeg(80)->toString();
            }
            Storage::disk('public')->put($storedPath, $binary);
            $product->image = $storedPath;
        }

        $product->save();
        
        // Check if stock is low and dispatch notification job
        if ($product->isLowStock()) {
            SendLowStockNotification::dispatch($product);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete image if exists
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
