# E-Commerce Application

A modern, full-featured e-commerce application built with Laravel 12 and React, featuring a complete admin panel, customer-facing storefront, and automated notification system.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products with dynamic categories
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Complete order placement with shipping and payment details
- **Order Management**: View order history and status
- **User Authentication**: Secure registration and login system
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview with key metrics (total products, categories, sales)
- **Product Management**: Full CRUD operations for products
  - Image upload with automatic optimization (WebP/JPEG)
  - Stock management with low stock alerts
  - Category assignment
  - SKU management
- **Category Management**: Organize products by categories
- **User Management**: Manage users and roles
- **Sales Reports**: View and manage sales records
- **Role-Based Access Control**: Admin and user roles with different permissions

### Automated Features
- **Low Stock Notifications**: Automatic email alerts when product stock runs low
- **Daily Sales Reports**: Automated daily email reports sent to admins at 6:00 PM

## 🛠 Technology Stack

### Backend
- **Laravel 12**: PHP web framework
- **PHP 8.2+**: Server-side language
- **MySQL**: Database
- **Laravel Queue**: Background job processing
- **Laravel Scheduler**: Automated task scheduling
- **Intervention Image**: Image processing and optimization

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Inertia.js**: Modern monolith approach (SPA-like experience without API)
- **Tailwind CSS**: Utility-first CSS framework
- **SweetAlert2**: Beautiful alert dialogs
- **Vite**: Build tool and dev server

### Key Packages
- `inertiajs/inertia-laravel`: Laravel Inertia adapter
- `tightenco/ziggy`: Laravel routes in JavaScript
- `intervention/image`: Image manipulation
- `laravel/sanctum`: API authentication
- `sweetalert2`: Alert notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP package manager)
- **Node.js 18+** and **npm**
- **MySQL 5.7+** or **MariaDB 10.3+**
- **Git**

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecom
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 5. Configure Environment Variables

Edit the `.env` file with your database and mail settings:

```env
APP_NAME="E-Commerce"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecom_db
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@example.com
MAIL_FROM_NAME="${APP_NAME}"

QUEUE_CONNECTION=database
```

### 6. Database Setup

Create your database:

```sql
CREATE DATABASE ecom_db;
```

Run migrations:

```bash
php artisan migrate
```

Seed the database with initial data (roles and default admin):

```bash
php artisan db:seed
```

### 7. Storage Link

Create a symbolic link for storage:

```bash
php artisan storage:link
```

### 8. Queue Setup

Create the jobs table for queue processing:

```bash
php artisan queue:table
php artisan migrate
```

### 9. Build Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

**Terminal 3 - Queue Worker:**
```bash
php artisan queue:work
```

**Terminal 4 - Scheduler (for daily reports):**
```bash
php artisan schedule:work
```

Or use the combined dev command:

```bash
composer run dev
```

### Access the Application

- **Frontend**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/dashboard (admin login required)

### Default Admin Credentials

After seeding, you can use:
- **Email**: admin@example.com
- **Password**: password

*Please change these credentials in production!*

## 📧 Email Configuration

### Mail Settings

The application uses Laravel's mail system. Configure your SMTP settings in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="E-Commerce"
```

### Queue Configuration

Set queue connection to `database` in `.env`:

```env
QUEUE_CONNECTION=database
```

### Automated Emails

1. **Low Stock Notifications**: Sent automatically when product stock falls below the threshold
2. **Daily Sales Reports**: Sent daily at 6:00 PM (Asia/Dhaka timezone)

## ⏰ Scheduled Tasks

### Setting Up Cron (Linux/Mac)

Add this to your crontab:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### Windows Task Scheduler

Create a scheduled task that runs every minute:

```bash
php artisan schedule:run
```

### Available Commands

- `sales:send-daily-report`: Send daily sales report to admins

## 📁 Project Structure

```
ecom/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── SendDailySalesReportCommand.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── ProductCategoryController.php
│   │   │   │   └── UserController.php
│   │   │   ├── CartController.php
│   │   │   ├── OrderController.php
│   │   │   └── ProductController.php
│   │   └── Middleware/
│   ├── Jobs/
│   │   ├── SendDailySalesReport.php
│   │   └── SendLowStockNotification.php
│   ├── Mail/
│   │   ├── DailySalesReport.php
│   │   └── LowStockNotification.php
│   └── Models/
│       ├── Cart.php
│       ├── Product.php
│       ├── ProductCategory.php
│       ├── Sale.php
│       ├── SaleItem.php
│       └── User.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   ├── Layouts/
│   │   ├── Pages/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   └── Ecommerce/
│   │   └── app.tsx
│   └── views/
│       ├── emails/
│       │   ├── daily-sales-report.blade.php
│       │   └── low-stock-notification.blade.php
│       └── app.blade.php
└── routes/
    ├── web.php
    ├── auth.php
    └── console.php
```

## 🔐 Role-Based Access Control

### Roles

1. **Admin** (role_id: 1)
   - Full access to admin panel
   - Product management
   - User management
   - Sales reports
   - Receives automated notifications

2. **User** (role_id: 2)
   - Access to e-commerce frontend
   - Shopping cart
   - Order placement
   - Order history

### Authentication Flow

- Regular users are redirected to the homepage after login
- Admins are redirected to the dashboard after login
- Protected routes use Laravel's authentication middleware

## 🛒 Shopping Cart & Orders

### Cart Features

- Persistent cart stored in database (per user)
- Real-time cart count updates
- Stock validation before checkout
- Quantity management

### Order Process

1. Add products to cart
2. Review cart items
3. Proceed to checkout
4. Enter shipping and payment details
5. Place order
6. Receive order confirmation

### Order Management

- Orders are stored in `sales` table
- Order items stored in `sale_items` table
- Stock automatically updated after order placement
- Low stock notifications triggered if applicable

## 📊 Admin Dashboard

### Metrics Displayed

- Total Products
- Total Product Categories
- Total Sales (BDT)

### Navigation

- Dashboard
- Product Categories
- Products
- Users
- Sales Reports

## 🖼 Image Management

- Images are stored in `storage/app/public`
- Automatic optimization using Intervention Image
- WebP format with JPEG fallback
- Maximum dimensions: 1200x1200px
- Automatic compression (80% quality)

## 🧪 Testing

Run tests:

```bash
php artisan test
```

## 📝 Development Notes

### CSRF Token Handling

The application uses Inertia.js shared props to keep CSRF tokens fresh after login. The token is automatically updated in the meta tag when pages load.

### Stock Management

- Low stock threshold is set per product
- Notifications sent when `current_stock_quantity <= low_stock_quantity`
- Stock updated automatically on order placement

### Daily Sales Report

- Runs daily at 6:00 PM (Asia/Dhaka)
- Includes all sales from the current day
- Sent to all active admin users
- Includes order details, customer info, and item breakdown

## 🐛 Troubleshooting

### Queue Not Processing

Ensure the queue worker is running:

```bash
php artisan queue:work
```

### Images Not Displaying

Check storage link:

```bash
php artisan storage:link
```

### Scheduler Not Running

Ensure cron is set up correctly or use:

```bash
php artisan schedule:work
```

### Mail Not Sending

1. Verify SMTP settings in `.env`
2. Check queue worker is running (if using queue)
3. Test mail configuration:

```bash
php artisan tinker
Mail::raw('Test', function($msg) { $msg->to('your@email.com')->subject('Test'); });
```

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Laravel 12 and React**
