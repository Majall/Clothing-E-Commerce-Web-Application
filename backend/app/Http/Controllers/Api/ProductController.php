<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->orderBy('source_date', 'desc')
            ->get()
            ->map(fn (Product $product) => $product->toFrontendArray())
            ->values();

        return response()->json(['products' => $products]);
    }
}
