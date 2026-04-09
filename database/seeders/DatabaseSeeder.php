<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\Coupon;
use App\Models\Customer;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create regular users
        User::factory(10)->create();

        // Create categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and gadgets'],
            ['name' => 'Clothing', 'slug' => 'clothing', 'description' => 'Fashion and apparel'],
            ['name' => 'Books', 'slug' => 'books', 'description' => 'Books and publications'],
            ['name' => 'Home & Garden', 'slug' => 'home-garden', 'description' => 'Home improvement and gardening'],
            ['name' => 'Sports', 'slug' => 'sports', 'description' => 'Sports equipment and gear'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create subcategories
        Category::create(['name' => 'Smartphones', 'slug' => 'smartphones', 'parent_id' => 1, 'description' => 'Mobile phones']);
        Category::create(['name' => 'Laptops', 'slug' => 'laptops', 'parent_id' => 1, 'description' => 'Portable computers']);
        Category::create(['name' => "Men's Clothing", 'slug' => 'mens-clothing', 'parent_id' => 2, 'description' => "Men's fashion"]);
        Category::create(['name' => "Women's Clothing", 'slug' => 'womens-clothing', 'parent_id' => 2, 'description' => "Women's fashion"]);

        // Create products
        $products = [
            [
                'category_id' => 3,
                'sku' => 'IPHONE-14-PRO',
                'name' => 'iPhone 14 Pro',
                'slug' => 'iphone-14-pro',
                'description' => 'Latest iPhone with dynamic island and A16 chip',
                'price' => 999.99,
                'stock_quantity' => 50,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'category_id' => 3,
                'sku' => 'SAMSUNG-S23',
                'name' => 'Samsung Galaxy S23',
                'slug' => 'samsung-galaxy-s23',
                'description' => 'Premium Android smartphone with amazing camera',
                'price' => 799.99,
                'stock_quantity' => 35,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'category_id' => 4,
                'sku' => 'MACBOOK-PRO',
                'name' => 'MacBook Pro 14',
                'slug' => 'macbook-pro-14',
                'description' => 'Powerful laptop for professionals with M2 chip',
                'price' => 1999.99,
                'stock_quantity' => 20,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'category_id' => 5,
                'sku' => 'COTTON-TSHIRT',
                'name' => 'Cotton T-Shirt',
                'slug' => 'cotton-tshirt',
                'description' => 'Comfortable 100% cotton t-shirt',
                'price' => 19.99,
                'stock_quantity' => 100,
                'is_active' => true,
            ],
            [
                'category_id' => 6,
                'sku' => 'PROGRAMMING-101',
                'name' => 'Programming 101',
                'slug' => 'programming-101',
                'description' => 'Learn programming basics with this comprehensive guide',
                'price' => 39.99,
                'stock_quantity' => 30,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Create orders
        $orders = [
            [
                'user_id' => 1,
                'order_number' => 'ORD-20240001',
                'subtotal' => 999.99,
                'tax_amount' => 80.00,
                'shipping_amount' => 0,
                'total_amount' => 1079.99,
                'status' => 'completed',
                'payment_status' => 'paid',
                'shipping_address' => '123 Main St, New York, NY 10001',
                'completed_at' => now(),
            ],
            [
                'user_id' => 2,
                'order_number' => 'ORD-20240002',
                'subtotal' => 799.99,
                'tax_amount' => 64.00,
                'shipping_amount' => 10.00,
                'total_amount' => 873.99,
                'status' => 'processing',
                'payment_status' => 'paid',
                'shipping_address' => '456 Oak Ave, Los Angeles, CA 90001',
            ],
            [
                'user_id' => 1,
                'order_number' => 'ORD-20240003',
                'subtotal' => 59.98,
                'tax_amount' => 4.80,
                'shipping_amount' => 5.00,
                'total_amount' => 69.78,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'shipping_address' => '123 Main St, New York, NY 10001',
            ],
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }

        // Create order items
        OrderItem::create([
            'order_id' => 1,
            'product_id' => 1,
            'quantity' => 1,
            'unit_price' => 999.99,
            'total_price' => 999.99,
            'product_name' => 'iPhone 14 Pro',
            'product_sku' => 'IPHONE-14-PRO',
        ]);

        OrderItem::create([
            'order_id' => 2,
            'product_id' => 2,
            'quantity' => 1,
            'unit_price' => 799.99,
            'total_price' => 799.99,
            'product_name' => 'Samsung Galaxy S23',
            'product_sku' => 'SAMSUNG-S23',
        ]);

        OrderItem::create([
            'order_id' => 3,
            'product_id' => 4,
            'quantity' => 2,
            'unit_price' => 19.99,
            'total_price' => 39.98,
            'product_name' => 'Cotton T-Shirt',
            'product_sku' => 'COTTON-TSHIRT',
        ]);

        // Create reviews
        Review::create([
            'user_id' => 1,
            'product_id' => 1,
            'order_id' => 1,
            'rating' => 5,
            'title' => 'Amazing phone!',
            'comment' => 'The best iPhone I have ever used. Battery life is incredible.',
            'is_verified_purchase' => true,
            'is_approved' => true,
        ]);

        Review::create([
            'user_id' => 2,
            'product_id' => 2,
            'order_id' => 2,
            'rating' => 4,
            'title' => 'Great phone',
            'comment' => 'Excellent camera and display. Battery could be better.',
            'is_verified_purchase' => true,
            'is_approved' => true,
        ]);

        // Create coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10.00,
            'min_order_amount' => 50.00,
            'usage_limit' => 100,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(1),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SAVE20',
            'type' => 'fixed',
            'value' => 20.00,
            'min_order_amount' => 100.00,
            'usage_limit' => 50,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(2),
            'is_active' => true,
        ]);

        // Seed customers
        $this->call(CustomerSeeder::class);
        
        // Seed transactions
        $this->call(TransactionSeeder::class);
    }
}