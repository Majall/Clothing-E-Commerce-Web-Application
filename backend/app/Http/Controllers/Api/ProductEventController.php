<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductEventController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'productId' => ['required', 'string', 'exists:products,id'],
            'eventType' => ['required', 'string', 'max:50'],
            'metadata' => ['nullable', 'array'],
        ]);

        ProductEvent::query()->create([
            'user_id' => $request->user()?->id,
            'product_id' => $payload['productId'],
            'event_type' => $payload['eventType'],
            'metadata' => $payload['metadata'] ?? null,
        ]);

        return response()->json(['stored' => true], 201);
    }
}
