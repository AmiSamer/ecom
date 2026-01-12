<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Start with a fresh query - ensure we're getting all non-deleted records
        $query = ProductCategory::query();

        // Search functionality - only apply if search is not empty
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Status filter - only apply if status is not empty
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $categories = $query->latest()
            ->paginate($request->get('per_page', 10))
            ->withQueryString()
            ->through(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'image' => $category->image ? Storage::disk('public')->url($category->image) : null,
                    'sku' => $category->sku,
                    'status' => $category->status,
                    'created_at' => $category->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Convert to array to ensure proper structure
        $categoriesArray = $categories->toArray();

        return Inertia::render('Admin/ProductCategories/Index', [
            'categories' => [
                'data' => $categoriesArray['data'] ?? [],
                'links' => $categoriesArray['links'] ?? [],
                'current_page' => $categoriesArray['current_page'] ?? 1,
                'last_page' => $categoriesArray['last_page'] ?? 1,
                'per_page' => $categoriesArray['per_page'] ?? 10,
                'total' => $categoriesArray['total'] ?? 0,
                'from' => $categoriesArray['from'] ?? null,
                'to' => $categoriesArray['to'] ?? null,
            ],
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/ProductCategories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'sku' => 'nullable|string|max:255|unique:product_categories,sku',
            'status' => 'required|integer|in:1,2',
        ]);

        $data = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sku' => $validated['sku'] ?? null,
            'status' => $validated['status'],
            'updated_by' => auth()->id(),
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filenameBase = 'categories/' . Str::uuid();
            
            $manager = new ImageManager(new GdDriver());
            $img = $manager->read($file->getRealPath())
                ->scaleDown(800, 800);
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

        ProductCategory::create($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Product category created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $category)
    {
        return Inertia::render('Admin/ProductCategories/Edit', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'image' => $category->image ? Storage::disk('public')->url($category->image) : null,
                'sku' => $category->sku,
                'status' => $category->status,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'sku' => 'nullable|string|max:255|unique:product_categories,sku,' . $category->id,
            'status' => 'required|integer|in:1,2',
        ]);

        $data = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sku' => $validated['sku'] ?? null,
            'status' => $validated['status'],
            'updated_by' => auth()->id(),
        ];

        // Handle image update
        if ($request->hasFile('image')) {
            // Delete old image
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            // Upload and optimize new image
            $file = $request->file('image');
            $filenameBase = 'categories/' . Str::uuid();
            
            $manager = new ImageManager(new GdDriver());
            $img = $manager->read($file->getRealPath())
                ->scaleDown(800, 800);
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

        $category->update($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Product category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $category)
    {
        // Delete image if exists
        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Product category deleted successfully.');
    }
}
