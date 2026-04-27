<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_user_and_returns_token_on_login(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'token'],
            ]);

        $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
    }

    public function test_it_rejects_invalid_password_for_existing_user(): void
    {
        User::factory()->create([
            'email' => 'existing@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'existing@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
    }
}
