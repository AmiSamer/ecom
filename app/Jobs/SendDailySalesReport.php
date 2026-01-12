<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public array $sales,
        public float $totalSales,
        public int $totalOrders,
        public string $date
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get admin users
        $admins = User::where('role_id', 1)
            ->where('status', 1)
            ->get();

        // Send email to all admins
        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(
                new DailySalesReport(
                    $this->sales,
                    $this->totalSales,
                    $this->totalOrders,
                    $this->date
                )
            );
        }
    }
}
