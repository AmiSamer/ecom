<?php

namespace App\Jobs;

use App\Mail\LowStockNotification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendLowStockNotification implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Product $product
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
            Mail::to($admin->email)->send(new LowStockNotification($this->product));
        }
    }
}
