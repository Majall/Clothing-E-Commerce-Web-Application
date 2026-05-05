<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductEvent;
use App\Services\PricingEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function index(Request $request, PricingEngine $pricingEngine): JsonResponse
    {
        $baseProductId = $request->query('productId');
        $query = Product::query()->with('variants');

        if ($baseProductId) {
            $baseProduct = Product::query()->find($baseProductId);
            if ($baseProduct) {
                $query->where('id', '!=', $baseProduct->id)
                    ->where(function ($builder) use ($baseProduct) {
                        $builder->where('category', $baseProduct->category);
                        if (!empty($baseProduct->style_tags)) {
                            $builder->orWhereJsonContains('style_tags', $baseProduct->style_tags);
                        }
                    });
            }
        } else {
            $eventProductIds = ProductEvent::query()
                ->select('product_id')
                ->selectRaw('count(*) as total')
                ->groupBy('product_id')
                ->orderByDesc('total')
                ->limit(6)
                ->pluck('product_id');

            if ($eventProductIds->isNotEmpty()) {
                $query->whereIn('id', $eventProductIds);
            } else {
                $query->where('bestseller', true);
            }
        }

        $products = $query->limit(8)->get()->map(function (Product $product) use ($pricingEngine) {
            $payload = $product->toFrontendArray();
            $pricing = $pricingEngine->apply($product);
            $payload['price'] = $pricing['price'];
            $payload['discount'] = $pricing['discount'];
            $payload['pricingRule'] = $pricing['rule'];

            return $payload;
        })->values();

        return response()->json(['products' => $products]);
    }
}
