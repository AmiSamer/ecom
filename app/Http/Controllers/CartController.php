<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Get the authenticated user's cart.
     */
    public function index()
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with('product.category')
            ->get()
            ->map(function ($item) {
                $product = $item->product;
                return [
                    'id' => $item->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_slug' => $product->slug ?: \Illuminate\Support\Str::slug($product->name),
                    'product_image' => $product->image ? Storage::disk('public')->url($product->image) : null,
                    'price' => (float) $product->price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) ($product->price * $item->quantity),
                    'stock' => $product->current_stock_quantity,
                    'in_stock' => $product->current_stock_quantity > 0,
                ];
            });

        $total = $cartItems->sum('subtotal');

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
            'item_count' => $cartItems->sum('quantity'),
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Check if product is active and in stock
        if ($product->status !== 1) {
            return response()->json([
                'message' => 'This product is not available.',
            ], 400);
        }

        if ($product->current_stock_quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock. Available: ' . $product->current_stock_quantity,
            ], 400);
        }

        // Check if item already exists in cart
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            // Update quantity
            $newQuantity = $cartItem->quantity + $validated['quantity'];
            
            if ($product->current_stock_quantity < $newQuantity) {
                return response()->json([
                    'message' => 'Insufficient stock. Available: ' . $product->current_stock_quantity,
                ], 400);
            }

            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            // Create new cart item
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart successfully.',
        ], 201);
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, Cart $cart)
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cart->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cart->product;

        // Check stock availability
        if ($product->current_stock_quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock. Available: ' . $product->current_stock_quantity,
            ], 400);
        }

        $cart->quantity = $validated['quantity'];
        $cart->save();

        return response()->json([
            'message' => 'Cart updated successfully.',
        ]);
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Cart $cart)
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cart->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $cart->delete();

        return response()->json([
            'message' => 'Item removed from cart successfully.',
        ]);
    }

    /**
     * Clear the entire cart.
     */
    public function clear()
    {
        Cart::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Cart cleared successfully.',
        ]);
    }
}
