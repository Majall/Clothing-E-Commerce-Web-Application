<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;

class InventoryController extends Controller
{
    public function alerts(): JsonResponse
    {
        $variants = ProductVariant::query()
            ->whereColumn('stock', '<=', 'low_stock_threshold')
            ->with('product')
            ->get();

        return response()->json([
            'alerts' => $variants->map(function (ProductVariant $variant) {
                return [
                    'sku' => $variant->sku,
                    'productId' => $variant->product_id,
                    'productName' => $variant->product?->name,
                    'size' => $variant->size,
                    'color' => $variant->color,
                    'stock' => $variant->stock,
                    'threshold' => $variant->low_stock_threshold,
                ];
            })->values(),
        ]);
    }
}
