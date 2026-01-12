<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_category_id',
        'name',
        'slug',
        'description',
        'image',
        'sku',
        'brand',
        'price',
        'current_stock_quantity',
        'low_stock_quantity',
        'status',
        'updated_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'current_stock_quantity' => 'integer',
        'low_stock_quantity' => 'integer',
        'status' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function isActive(): bool
    {
        return $this->status === 1;
    }

    public function isLowStock(): bool
    {
        return $this->current_stock_quantity <= $this->low_stock_quantity;
    }
}
