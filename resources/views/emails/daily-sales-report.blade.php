<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4f46e5;
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
        .summary {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 15px 0;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .summary-item {
            text-align: center;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 5px;
        }
        .summary-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
        }
        .sales-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: white;
            border-radius: 5px;
            overflow: hidden;
        }
        .sales-table thead {
            background-color: #4f46e5;
            color: white;
        }
        .sales-table th,
        .sales-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .sales-table th {
            font-weight: bold;
        }
        .sales-table tbody tr:hover {
            background-color: #f9fafb;
        }
        .items-list {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }
        .no-sales {
            text-align: center;
            padding: 40px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Daily Sales Report</h1>
        <p>{{ $date }}</p>
    </div>
    
    <div class="content">
        <p>Dear Admin,</p>
        
        <p>Here is your daily sales report for <strong>{{ $date }}</strong>:</p>
        
        <div class="summary">
            <div class="summary-item">
                <div class="summary-label">Total Orders</div>
                <div class="summary-value">{{ $totalOrders }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Sales</div>
                <div class="summary-value">৳{{ number_format($totalSales, 2) }}</div>
            </div>
        </div>
        
        @if(count($sales) > 0)
        <h3>Order Details:</h3>
        <table class="sales-table">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sales as $sale)
                <tr>
                    <td><strong>{{ $sale['order_number'] }}</strong></td>
                    <td>
                        {{ $sale['customer_name'] }}<br>
                        <small style="color: #6b7280;">{{ $sale['customer_email'] }}</small>
                    </td>
                    <td>
                        @foreach($sale['items'] as $item)
                        <div class="items-list">
                            {{ $item['product_name'] }} (Qty: {{ $item['quantity'] }}) - ৳{{ number_format($item['subtotal'], 2) }}
                        </div>
                        @endforeach
                    </td>
                    <td><strong>৳{{ number_format($sale['total_amount'], 2) }}</strong></td>
                    <td>{{ ucfirst(str_replace('_', ' ', $sale['payment_method'])) }}</td>
                    <td>{{ ucfirst($sale['order_status']) }}</td>
                    <td>{{ $sale['created_at'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <div class="no-sales">
            <p>No sales were made on {{ $date }}.</p>
        </div>
        @endif
        
        <p>Best regards,<br>E-commerce System</p>
    </div>
    
    <div class="footer">
        <p>This is an automated daily report. Please do not reply to this email.</p>
    </div>
</body>
</html>
