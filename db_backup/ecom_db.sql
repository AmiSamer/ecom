-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 13, 2026 at 08:15 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecom_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('shophub-cache-admin@example.com|127.0.0.1', 'i:1;', 1768281050),
('shophub-cache-admin@example.com|127.0.0.1:timer', 'i:1768281050;', 1768281050),
('shophub-cache-sa93.one@gmail.com|127.0.0.1', 'i:3;', 1768281069),
('shophub-cache-sa93.one@gmail.com|127.0.0.1:timer', 'i:1768281069;', 1768281069);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_roles_table', 1),
(5, '0001_01_01_000004_add_role_and_columns_to_users_table', 1),
(6, '2024_01_01_000005_create_product_categories_table', 2),
(7, '2024_01_01_000006_create_products_table', 2),
(8, '2026_01_12_102903_add_slug_to_products_table', 3),
(9, '2026_01_12_104033_create_product_carts_table', 4),
(10, '2026_01_12_104038_create_sales_table', 4),
(11, '2026_01_12_104045_create_sale_items_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `product_category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `current_stock_quantity` int NOT NULL DEFAULT '0',
  `low_stock_quantity` int NOT NULL DEFAULT '10' COMMENT 'Alert when stock reaches this level',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1 = active, 2 = inactive',
  `updated_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_category_id`, `name`, `slug`, `description`, `image`, `sku`, `brand`, `price`, `current_stock_quantity`, `low_stock_quantity`, `status`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Men Footwear', 'men-footwear', 'latest collection of men footwear', 'products/d83de40c-a355-48b4-b8d3-32560215d239.webp', 'men-footwear-product', 'Bata', '1200.00', 0, 7, 1, 1, '2026-01-12 03:14:38', '2026-01-12 23:59:13', '2026-01-12 23:59:13'),
(2, 1, 'Kid Footwear', 'kid-footwear', 'khbkj', 'products/35f450f4-5059-4ed1-a27f-184e2390baf1.webp', 'khkjhj', NULL, '2100.00', 13, 2, 1, 1, '2026-01-12 05:29:06', '2026-01-12 23:59:11', '2026-01-12 23:59:11'),
(3, 3, 'Travel Bag', 'travel-bag', 'A durable and lightweight travel bag designed for comfort and convenience on the go. Spacious compartments keep your essentials organized, making it perfect for trips, tours, or daily travel.', 'products/75195c20-5123-4d71-893b-b853956b6803.webp', 'travel-bag', NULL, '1550.00', 10, 5, 1, 1, '2026-01-13 00:04:26', '2026-01-13 00:04:26', NULL),
(4, 3, 'HP Laptop Bag', 'hp-laptop-bag', 'A sleek and durable laptop bag designed to protect your device on the move. Features padded compartments and smart pockets for organized, comfortable everyday travel.', 'products/6ae037cc-9037-4f29-b277-df5e19163696.webp', 'laptop-bag', 'HP', '1200.00', 15, 3, 1, 1, '2026-01-13 00:06:10', '2026-01-13 00:06:10', NULL),
(5, 2, 'Bata Stylish Men Footwear', 'bata-stylish-men-footwear', 'Stylish and comfortable men’s footwear built for all-day wear. Durable design with a perfect blend of fashion and functionality for any occasion.', 'products/4d60a655-9eee-47bb-baae-b17514688526.webp', 'men-footwear', 'Bata', '2400.00', 20, 10, 1, 1, '2026-01-13 00:08:01', '2026-01-13 00:08:01', NULL),
(6, 2, 'Bata Stylish Women\'s Footwear', 'bata-stylish-womens-footwear', 'Trendy and comfortable women’s footwear crafted for style and all-day wear. Lightweight and durable, perfect for casual outings or special occasions.', 'products/cb470946-493b-4e17-b14c-66a015518aa8.webp', 'women-footwear', 'Bata', '1850.00', 15, 10, 1, 1, '2026-01-13 00:09:56', '2026-01-13 00:31:33', NULL),
(7, 4, 'Stylish Wrist Watch', 'stylish-wrist-watch', 'Elegant and precise wrist watch designed to complement any outfit. Durable and stylish, perfect for daily wear or special occasions.', 'products/50852d5c-dffa-4f89-8ebd-f7b662d19276.webp', 'wrist-watch', 'FastTrack', '2540.00', 7, 4, 1, 1, '2026-01-13 00:11:32', '2026-01-13 00:28:05', NULL),
(8, 5, 'test product', 'test-product', 'test test', 'products/aba8ff5c-a525-43e0-ad7c-c3da1916fb84.webp', 'test-prod', 'test brand', '1200.00', 10, 2, 1, 1, '2026-01-13 00:32:27', '2026-01-13 00:32:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_carts`
--

CREATE TABLE `product_carts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1 = active, 2 = inactive',
  `updated_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`, `description`, `image`, `sku`, `status`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Footwear', 'Footwear for men, women and kids', 'categories/2b86904d-965d-498d-bc45-56397ae4ccd2.webp', 'footwears', 1, 1, '2026-01-12 02:08:55', '2026-01-12 23:59:05', '2026-01-12 23:59:05'),
(2, 'Footwear', NULL, 'categories/137485fd-4f33-45de-9879-b1f85294d445.webp', NULL, 1, 1, '2026-01-12 23:59:41', '2026-01-12 23:59:41', NULL),
(3, 'Bags', NULL, 'categories/7ce6b1de-f3a7-452e-9016-c5f621809d7b.webp', NULL, 1, 1, '2026-01-13 00:00:02', '2026-01-13 00:00:02', NULL),
(4, 'Wrist Watch', NULL, 'categories/936aaa05-ebb2-4d0e-bc8a-e1dd31d79182.webp', NULL, 1, 1, '2026-01-13 00:01:45', '2026-01-13 00:30:21', NULL),
(5, 'test category', 'test', 'categories/c6ccd3a6-3297-406d-9b38-fa82525d772a.webp', NULL, 1, 1, '2026-01-13 00:30:44', '2026-01-13 00:30:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1 = active, 2 = inactive',
  `updated_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `status`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin', 1, NULL, '2026-01-12 00:38:45', '2026-01-12 00:38:45', NULL),
(2, 'user', 1, NULL, '2026-01-12 00:38:45', '2026-01-12 00:38:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint UNSIGNED NOT NULL,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'pending, paid, failed',
  `order_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'pending, processing, shipped, delivered, cancelled',
  `shipping_address` text COLLATE utf8mb4_unicode_ci,
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `order_number`, `user_id`, `total_amount`, `subtotal`, `tax`, `shipping_cost`, `payment_method`, `payment_status`, `order_status`, `shipping_address`, `contact_phone`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'ORD-20260112-5EF519', 2, '2400.00', '2400.00', '0.00', '0.00', 'cash_on_delivery', 'pending', 'pending', 'laalbagh, dhaka', '01513470130', NULL, '2026-01-12 05:05:25', '2026-01-12 05:05:25'),
(2, 'ORD-20260112-DD7590', 2, '4800.00', '4800.00', '0.00', '0.00', 'bank_transfer', 'pending', 'pending', 'Mirpur', '01513470130', NULL, '2026-01-12 05:10:05', '2026-01-12 05:10:05'),
(3, 'ORD-20260112-F0DA69', 2, '3600.00', '3600.00', '0.00', '0.00', 'card', 'pending', 'pending', 'Dhanmondi, Dhaka', '01513470130', NULL, '2026-01-12 05:18:55', '2026-01-12 05:18:55'),
(4, 'ORD-20260112-13918F', 2, '3600.00', '3600.00', '0.00', '0.00', 'bank_transfer', 'pending', 'pending', 'lkljlj', '01513470130', NULL, '2026-01-12 05:25:53', '2026-01-12 05:25:53'),
(5, 'ORD-20260113-8B5A44', 2, '2100.00', '2100.00', '0.00', '0.00', 'cash_on_delivery', 'pending', 'pending', 'ijjj', '0', NULL, '2026-01-12 22:44:56', '2026-01-12 22:44:56'),
(6, 'ORD-20260113-93A7CC', 2, '2100.00', '2100.00', '0.00', '0.00', 'cash_on_delivery', 'pending', 'pending', 'kjjkn', '01513470130', NULL, '2026-01-12 23:09:29', '2026-01-12 23:09:29'),
(7, 'ORD-20260113-58C382', 2, '7620.00', '7620.00', '0.00', '0.00', 'cash_on_delivery', 'pending', 'pending', 'Mirpur, Dhaka', '01543470120', NULL, '2026-01-13 00:28:05', '2026-01-13 00:28:05');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` bigint UNSIGNED NOT NULL,
  `sale_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `product_name`, `price`, `quantity`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Men Footwear', '1200.00', 2, '2400.00', '2026-01-12 05:05:25', '2026-01-12 05:05:25'),
(2, 2, 1, 'Men Footwear', '1200.00', 4, '4800.00', '2026-01-12 05:10:05', '2026-01-12 05:10:05'),
(3, 3, 1, 'Men Footwear', '1200.00', 3, '3600.00', '2026-01-12 05:18:55', '2026-01-12 05:18:55'),
(4, 4, 1, 'Men Footwear', '1200.00', 3, '3600.00', '2026-01-12 05:25:53', '2026-01-12 05:25:53'),
(5, 5, 2, 'Kid Footwear', '2100.00', 1, '2100.00', '2026-01-12 22:44:56', '2026-01-12 22:44:56'),
(6, 6, 2, 'Kid Footwear', '2100.00', 1, '2100.00', '2026-01-12 23:09:29', '2026-01-12 23:09:29'),
(7, 7, 7, 'Stylish Wrist Watch', '2540.00', 3, '7620.00', '2026-01-13 00:28:05', '2026-01-13 00:28:05');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('ncgmuHMx1oBGuhWZjoLR9b1f7sI06aLtW5h9kkf5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoid1FkUlkwVjdWYUdCSlk2UUJ0WEtsYjlPTDBRa2dxYjZ1N2xIeTU5dSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768285998);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1 = active, 2 = inactive',
  `updated_by` bigint UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `email_verified_at`, `password`, `status`, `updated_by`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Admin User', 'sam93.one@gmail.com', NULL, '$2y$12$/FZVbo.qs3.HuVqtyGNXqO/CzHHWughYIq2QVNQtJtEXWC6aMU.bO', 1, NULL, 'KZaiH6wr3MR9nyEJqQfoeedmswY57DosD6kllUWKDqRlzigxbqTW2jWDiFvZ', '2026-01-12 00:38:46', '2026-01-12 00:45:43', NULL),
(2, 2, 'Shuvo', 'user@example.com', NULL, '$2y$12$fufhsF4RUmc3v7fO9rgmfObkUDX3RgcEZqtnLzq5htMCyFCD3mfha', 1, NULL, NULL, '2026-01-12 00:38:46', '2026-01-13 00:28:31', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_sku_unique` (`sku`),
  ADD UNIQUE KEY `products_slug_unique` (`slug`),
  ADD KEY `products_product_category_id_foreign` (`product_category_id`);

--
-- Indexes for table `product_carts`
--
ALTER TABLE `product_carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_carts_user_id_product_id_unique` (`user_id`,`product_id`),
  ADD KEY `product_carts_product_id_foreign` (`product_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_categories_sku_unique` (`sku`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_order_number_unique` (`order_number`),
  ADD KEY `sales_user_id_foreign` (`user_id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_items_sale_id_foreign` (`sale_id`),
  ADD KEY `sale_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product_carts`
--
ALTER TABLE `product_carts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_product_category_id_foreign` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `product_carts`
--
ALTER TABLE `product_carts`
  ADD CONSTRAINT `product_carts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `sale_items_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
