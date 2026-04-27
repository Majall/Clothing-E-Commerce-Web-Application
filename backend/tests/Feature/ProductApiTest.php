<?php

namespace Tests\Feature;

use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_seeded_products(): void
    {
        $this->seed(ProductSeeder::class);

        $response = $this->getJson('/api/products');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'products' => [
                    '*' => ['_id', 'name', 'description', 'price', 'image', 'category', 'subCategory', 'sizes', 'date', 'bestseller'],
                ],
            ]);

        $this->assertNotEmpty($response->json('products'));
    }
}
