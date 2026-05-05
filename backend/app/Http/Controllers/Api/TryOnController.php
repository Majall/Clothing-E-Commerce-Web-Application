<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class TryOnController extends Controller
{
    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'productId' => $product->id,
            'overlayImage' => $product->images[0] ?? null,
            'model' => 'standard',
            'tips' => [
                'Center the garment on your torso for the best fit preview.',
                'Use bright lighting to improve overlay accuracy.',
            ],
        ]);
    }
}
