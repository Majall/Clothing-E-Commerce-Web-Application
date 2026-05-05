<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function stripeIntent(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        return response()->json([
            'provider' => 'stripe',
            'amount' => $payload['amount'],
            'currency' => $payload['currency'] ?? 'bdt',
            'clientSecret' => 'stripe_demo_secret',
        ]);
    }

    public function paypalIntent(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        return response()->json([
            'provider' => 'paypal',
            'amount' => $payload['amount'],
            'currency' => $payload['currency'] ?? 'bdt',
            'approvalUrl' => 'https://paypal.example/approve',
        ]);
    }

    public function cashOnDelivery(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
        ]);

        return response()->json([
            'provider' => 'cod',
            'amount' => $payload['amount'],
            'status' => 'reserved',
        ]);
    }
}
