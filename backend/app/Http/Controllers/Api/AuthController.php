<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:3'],
        ]);

        $user = User::query()->where('email', $payload['email'])->first();

        if ($user) {
            if (!Hash::check($payload['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Invalid credentials.'],
                ]);
            }
        } else {
            $user = User::query()->create([
                'name' => $payload['name'] ?? 'Customer',
                'email' => $payload['email'],
                'password' => Hash::make($payload['password']),
            ]);
        }

        if (!empty($payload['name']) && $payload['name'] !== $user->name) {
            $user->name = $payload['name'];
            $user->save();
        }

        $token = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'token' => $token,
            ],
        ]);
    }
}
