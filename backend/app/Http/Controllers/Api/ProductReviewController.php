<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        $reviews = $product->reviews()->latest()->get();

        return response()->json([
            'reviews' => $reviews->map->toFrontendArray()->values(),
        ]);
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        $payload = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $review = ProductReview::query()->create([
            'product_id' => $product->id,
            'user_id' => $request->user()?->id,
            'author' => $request->user()?->name,
            'rating' => $payload['rating'],
            'title' => $payload['title'],
            'body' => $payload['body'],
        ]);

        $newCount = $product->review_count + 1;
        $product->rating = round((($product->rating * $product->review_count) + $payload['rating']) / $newCount, 1);
        $product->review_count = $newCount;
        $product->save();

        return response()->json([
            'review' => $review->toFrontendArray(),
        ], 201);
    }
}
