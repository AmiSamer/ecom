<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #ef4444;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        .product-info {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
        }
        .value {
            color: #111827;
        }
        .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ Low Stock Alert</h1>
    </div>
    
    <div class="content">
        <p>Dear Admin,</p>
        
        <p>A product is running low on stock and requires your attention:</p>
        
        <div class="product-info">
            <div class="info-row">
                <span class="label">Product Name:</span>
                <span class="value">{{ $product->name }}</span>
            </div>
            <div class="info-row">
                <span class="label">SKU:</span>
                <span class="value">{{ $product->sku }}</span>
            </div>
            <div class="info-row">
                <span class="label">Current Stock:</span>
                <span class="value" style="color: #ef4444; font-weight: bold;">{{ $product->current_stock_quantity }}</span>
            </div>
            <div class="info-row">
                <span class="label">Low Stock Threshold:</span>
                <span class="value">{{ $product->low_stock_quantity }}</span>
            </div>
            @if($product->category)
            <div class="info-row">
                <span class="label">Category:</span>
                <span class="value">{{ $product->category->name }}</span>
            </div>
            @endif
        </div>
        
        <div class="warning">
            <strong>⚠️ Action Required:</strong> Please restock this product to avoid stockouts.
        </div>
        
        <p>Please log in to the admin panel to update the stock quantity.</p>
        
        <p>Best regards,<br>E-commerce System</p>
    </div>
    
    <div class="footer">
        <p>This is an automated notification. Please do not reply to this email.</p>
    </div>
</body>
</html>
