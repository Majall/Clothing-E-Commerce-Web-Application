<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_place_order(): void
    {
        $this->seed(ProductSeeder::class);

        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/orders', [
                'shippingAddress' => [
                    'fullName' => 'John Doe',
                    'email' => 'john@example.com',
                    'street' => '123 Main St',
                    'city' => 'Dhaka',
                    'state' => 'Dhaka',
                    'zipCode' => '1200',
                    'country' => 'Bangladesh',
                    'phone' => '01700000000',
                ],
                'paymentMethod' => 'Cash on Delivery',
                'items' => [
                    ['productId' => 'aaaaa', 'size' => 'M', 'quantity' => 2],
                    ['productId' => 'aaaab', 'size' => 'L', 'quantity' => 1],
                ],
            ]);

        $response
            ->assertStatus(201)
            ->assertJsonStructure([
                'order' => [
                    'id', 'createdAt', 'user', 'items', 'shippingAddress', 'paymentMethod',
                    'subtotal', 'shipping', 'total', 'status',
                ],
            ]);

        $order = $response->json('order');

        $this->assertSame(400, $order['subtotal']);
        $this->assertSame(40, $order['shipping']);
        $this->assertSame(440, $order['total']);
        $this->assertCount(2, $order['items']);
    }

    public function test_placing_order_requires_authentication(): void
    {
        $response = $this->postJson('/api/orders', [
            'shippingAddress' => ['fullName' => 'Test'],
            'paymentMethod' => 'Cash on Delivery',
            'items' => [['productId' => 'aaaaa', 'size' => 'M', 'quantity' => 1]],
        ]);

        $response->assertUnauthorized();
    }
}
