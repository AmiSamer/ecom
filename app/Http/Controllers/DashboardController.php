<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'totalCategories' => ProductCategory::count(),
            'totalSales' => 0, // Will be replaced when orders table is created
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}
