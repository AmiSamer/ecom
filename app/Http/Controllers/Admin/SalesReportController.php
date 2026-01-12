<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesReportController extends Controller
{
    /**
     * Display a listing of sales.
     */
    public function index(Request $request)
    {
        $query = Sale::with(['user', 'items']);

        // Search by order number
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('order_number', 'like', "%{$search}%");
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Order status filter
        if ($request->filled('order_status')) {
            $query->where('order_status', $request->order_status);
        }

        // Payment status filter
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Payment method filter
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        $sales = $query->latest()
            ->paginate($request->get('per_page', 15))
            ->withQueryString()
            ->through(function ($sale) {
                return [
                    'id' => $sale->id,
                    'order_number' => $sale->order_number,
                    'customer_name' => $sale->user->name ?? 'Guest',
                    'customer_email' => $sale->user->email ?? 'N/A',
                    'total_amount' => (float) $sale->total_amount,
                    'subtotal' => (float) $sale->subtotal,
                    'tax' => (float) $sale->tax,
                    'shipping_cost' => (float) $sale->shipping_cost,
                    'payment_method' => $sale->payment_method,
                    'payment_status' => $sale->payment_status,
                    'order_status' => $sale->order_status,
                    'item_count' => $sale->items->sum('quantity'),
                    'created_at' => $sale->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Calculate summary statistics
        $summaryQuery = Sale::query();
        
        if ($request->filled('date_from')) {
            $summaryQuery->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $summaryQuery->whereDate('created_at', '<=', $request->date_to);
        }
        if ($request->filled('order_status')) {
            $summaryQuery->where('order_status', $request->order_status);
        }
        if ($request->filled('payment_status')) {
            $summaryQuery->where('payment_status', $request->payment_status);
        }
        if ($request->filled('payment_method')) {
            $summaryQuery->where('payment_method', $request->payment_method);
        }

        $summary = [
            'total_orders' => $summaryQuery->count(),
            'total_sales' => (float) $summaryQuery->sum('total_amount'),
            'total_subtotal' => (float) $summaryQuery->sum('subtotal'),
            'total_tax' => (float) $summaryQuery->sum('tax'),
            'total_shipping' => (float) $summaryQuery->sum('shipping_cost'),
        ];

        // Convert to array to ensure proper structure
        $salesArray = $sales->toArray();

        return Inertia::render('Admin/SalesReports/Index', [
            'sales' => [
                'data' => $salesArray['data'],
                'links' => $salesArray['links'],
                'current_page' => $salesArray['current_page'],
                'last_page' => $salesArray['last_page'],
                'per_page' => $salesArray['per_page'],
                'total' => $salesArray['total'],
                'from' => $salesArray['from'] ?? null,
                'to' => $salesArray['to'] ?? null,
            ],
            'summary' => $summary,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'order_status', 'payment_status', 'payment_method']),
        ]);
    }

    /**
     * Display the specified sale.
     */
    public function show(Sale $report)
    {
        $report->load(['user', 'items.product']);

        return Inertia::render('Admin/SalesReports/Show', [
            'sale' => [
                'id' => $report->id,
                'order_number' => $report->order_number,
                'customer_name' => $report->user->name ?? 'Guest',
                'customer_email' => $report->user->email ?? 'N/A',
                'total_amount' => (float) $report->total_amount,
                'subtotal' => (float) $report->subtotal,
                'tax' => (float) $report->tax,
                'shipping_cost' => (float) $report->shipping_cost,
                'payment_method' => $report->payment_method,
                'payment_status' => $report->payment_status,
                'order_status' => $report->order_status,
                'shipping_address' => $report->shipping_address,
                'contact_phone' => $report->contact_phone,
                'notes' => $report->notes,
                'created_at' => $report->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $report->updated_at->format('Y-m-d H:i:s'),
                'items' => $report->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'price' => (float) $item->price,
                        'quantity' => $item->quantity,
                        'subtotal' => (float) $item->subtotal,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'slug' => $item->product->slug,
                            'image' => $item->product->image,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }
}
