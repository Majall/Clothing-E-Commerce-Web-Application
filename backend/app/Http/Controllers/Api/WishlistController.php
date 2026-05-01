<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = $request->user()->wishlistItems()->with('product')->get();

        return response()->json([
            'items' => $items->map->toFrontendArray()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'productId' => ['required', 'string', 'exists:products,id'],
            'size' => ['nullable', 'string', 'max:50'],
        ]);

        $item = $request->user()->wishlistItems()->firstOrCreate([
            'product_id' => $payload['productId'],
            'size' => $payload['size'] ?? null,
        ]);

        $item->loadMissing('product');

        return response()->json([
            'item' => $item->toFrontendArray(),
        ], 201);
    }

    public function destroy(Request $request, int $itemId): JsonResponse
    {
        $item = $request->user()->wishlistItems()->findOrFail($itemId);
        $item->delete();

        return response()->json(['deleted' => true]);
    }
}
