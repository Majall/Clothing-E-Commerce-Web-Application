<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = json_decode(file_get_contents(database_path('seeders/data/products.json')), true);

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['id' => $product['id']],
                [
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'images' => $product['images'],
                    'category' => $product['category'],
                    'sub_category' => $product['sub_category'],
                    'sizes' => $product['sizes'],
                    'source_date' => $product['source_date'],
                    'bestseller' => $product['bestseller'],
                ]
            );
        }
    }
}
