<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Jobs\SendLowStockNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function checkout()
    {
        return Inertia::render('Ecommerce/Checkout');
    }

    /**
     * Process the order.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'contact_name' => 'required|string|max:255',
                'contact_phone' => 'required|string|max:20',
                'shipping_address' => 'required|string',
                'payment_method' => 'required|string|in:cash_on_delivery,card,bank_transfer',
                'notes' => 'nullable|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Get user's cart items
        $cartItems = Cart::where('user_id', Auth::id())
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.',
            ], 400);
        }

        // Validate stock availability
        foreach ($cartItems as $item) {
            if ($item->product->current_stock_quantity < $item->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Insufficient stock for {$item->product->name}. Available: {$item->product->current_stock_quantity}",
                ], 400);
            }
        }

        DB::beginTransaction();
        try {
            // Calculate totals
            $subtotal = $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });
            $tax = 0; // You can add tax calculation logic here
            $shippingCost = 0; // You can add shipping calculation logic here
            $totalAmount = $subtotal + $tax + $shippingCost;

            // Create sale record
            $sale = Sale::create([
                'order_number' => Sale::generateOrderNumber(),
                'user_id' => Auth::id(),
                'total_amount' => $totalAmount,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'cash_on_delivery' ? 'pending' : 'pending',
                'order_status' => 'pending',
                'shipping_address' => $validated['shipping_address'],
                'contact_phone' => $validated['contact_phone'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create sale items and update product stock
            foreach ($cartItems as $item) {
                $product = $item->product;
                $itemSubtotal = $product->price * $item->quantity;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $itemSubtotal,
                ]);

                // Update product stock
                $product->current_stock_quantity -= $item->quantity;
                $product->save();
                
                // Check if stock is low and dispatch notification job
                $product->refresh(); // Refresh to get updated stock
                if ($product->isLowStock()) {
                    SendLowStockNotification::dispatch($product);
                }
            }

            // Clear the cart
            Cart::where('user_id', Auth::id())->delete();

            DB::commit();

            // Return success response with order number for frontend to show alert
            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully! Order Number: ' . $sale->order_number,
                'order_number' => $sale->order_number,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Return JSON error response
            return response()->json([
                'success' => false,
                'message' => 'Failed to process order. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show order details.
     */
    public function show(Sale $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $order->load(['items.product', 'user']);

        return Inertia::render('Ecommerce/OrderDetails', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => (float) $order->total_amount,
                'subtotal' => (float) $order->subtotal,
                'tax' => (float) $order->tax,
                'shipping_cost' => (float) $order->shipping_cost,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'order_status' => $order->order_status,
                'shipping_address' => $order->shipping_address,
                'contact_phone' => $order->contact_phone,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'price' => (float) $item->price,
                        'quantity' => $item->quantity,
                        'subtotal' => (float) $item->subtotal,
                    ];
                }),
            ],
        ]);
    }
}
