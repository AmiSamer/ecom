<?php

namespace App\Console\Commands;

use App\Jobs\SendDailySalesReport;
use App\Models\Sale;
use Illuminate\Console\Command;

class SendDailySalesReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sales:send-daily-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily sales report to admin via email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now()->format('Y-m-d');
        
        // Get all sales for today
        $sales = Sale::whereDate('created_at', $today)
            ->with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate totals
        $totalSales = $sales->sum('total_amount');
        $totalOrders = $sales->count();

        // Format sales data for email
        $salesData = $sales->map(function ($sale) {
            return [
                'order_number' => $sale->order_number,
                'customer_name' => $sale->user->name ?? 'Guest',
                'customer_email' => $sale->user->email ?? 'N/A',
                'total_amount' => $sale->total_amount,
                'payment_method' => $sale->payment_method,
                'order_status' => $sale->order_status,
                'items' => $sale->items->map(function ($item) {
                    return [
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'subtotal' => $item->subtotal,
                    ];
                })->toArray(),
                'created_at' => $sale->created_at->format('Y-m-d H:i:s'),
            ];
        })->toArray();

        // Dispatch job to send email (synchronously - no queue worker needed)
        SendDailySalesReport::dispatchSync(
            $salesData,
            $totalSales,
            $totalOrders,
            $today
        );

        $this->info("Daily sales report dispatched for {$today}. Total orders: {$totalOrders}, Total sales: " . number_format($totalSales, 2));
        
        return Command::SUCCESS;
    }
}
