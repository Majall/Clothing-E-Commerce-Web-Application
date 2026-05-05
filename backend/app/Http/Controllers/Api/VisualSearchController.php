<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\PricingEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisualSearchController extends Controller
{
    public function search(Request $request, PricingEngine $pricingEngine): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'string'],
        ]);

        $products = Product::query()
            ->with('variants')
            ->orderByDesc('bestseller')
            ->limit(6)
            ->get()
            ->map(function (Product $product) use ($pricingEngine) {
                $payload = $product->toFrontendArray();
                $pricing = $pricingEngine->apply($product);
                $payload['price'] = $pricing['price'];
                $payload['discount'] = $pricing['discount'];
                $payload['pricingRule'] = $pricing['rule'];

                return $payload;
            })
            ->values();

        return response()->json(['matches' => $products]);
    }
}
