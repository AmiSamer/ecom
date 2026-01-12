<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_category_id')->constrained('product_categories')->onDelete('restrict');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('sku')->unique();
            $table->string('brand')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('current_stock_quantity')->default(0);
            $table->integer('low_stock_quantity')->default(10)->comment('Alert when stock reaches this level');
            $table->tinyInteger('status')->default(1)->comment('1 = active, 2 = inactive');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
