<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\PricingEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(PricingEngine $pricingEngine): JsonResponse
    {
        $products = Product::query()
            ->with('variants')
            ->orderBy('source_date', 'desc')
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

        return response()->json(['products' => $products]);
    }

    public function filters(): JsonResponse
    {
        $products = Product::query()->get(['price', 'colors', 'style_tags', 'fabric']);
        $colors = collect($products)->pluck('colors')->flatten()->filter()->unique()->values();
        $styles = collect($products)->pluck('style_tags')->flatten()->filter()->unique()->values();
        $fabrics = collect($products)->pluck('fabric')->filter()->unique()->values();

        return response()->json([
            'colors' => $colors,
            'styleTags' => $styles,
            'fabrics' => $fabrics,
            'minPrice' => $products->min('price') ?? 0,
            'maxPrice' => $products->max('price') ?? 0,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $this->validatePayload($request);
        $variants = $payload['variants'] ?? [];
        $payload['id'] = $payload['id'] ?? Str::uuid()->toString();

        $product = Product::query()->create($this->normalizePayload($payload));
        $this->syncVariants($product, $variants);

        return response()->json([
            'product' => $product->load('variants')->toFrontendArray(),
        ], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $payload = $this->validatePayload($request, $product->id);
        $variants = $payload['variants'] ?? [];

        $product->fill($this->normalizePayload($payload));
        $product->save();
        $this->syncVariants($product, $variants);

        return response()->json([
            'product' => $product->load('variants')->toFrontendArray(),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['deleted' => true]);
    }

    private function validatePayload(Request $request, ?string $productId = null): array
    {
        return $request->validate([
            'id' => ['nullable', 'string', Rule::unique('products', 'id')->ignore($productId)],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'images' => ['required', 'array', 'min:1'],
            'category' => ['required', 'string', 'max:255'],
            'subCategory' => ['required', 'string', 'max:255'],
            'sizes' => ['required', 'array', 'min:1'],
            'colors' => ['nullable', 'array'],
            'styleTags' => ['nullable', 'array'],
            'fabric' => ['nullable', 'string', 'max:100'],
            'material' => ['nullable', 'string', 'max:100'],
            'video' => ['nullable', 'string', 'max:255'],
            'bestseller' => ['nullable', 'boolean'],
            'variants' => ['nullable', 'array'],
            'variants.*.sku' => ['nullable', 'string', 'max:100'],
            'variants.*.size' => ['nullable', 'string', 'max:50'],
            'variants.*.color' => ['nullable', 'string', 'max:50'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.lowStockThreshold' => ['nullable', 'integer', 'min:0'],
            'variants.*.priceOverride' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    private function normalizePayload(array $payload): array
    {
        $normalized = [
            'name' => $payload['name'],
            'description' => $payload['description'],
            'price' => $payload['price'],
            'images' => $payload['images'],
            'category' => $payload['category'],
            'sub_category' => $payload['subCategory'],
            'sizes' => $payload['sizes'],
            'colors' => $payload['colors'] ?? [],
            'style_tags' => $payload['styleTags'] ?? [],
            'fabric' => $payload['fabric'] ?? null,
            'material' => $payload['material'] ?? null,
            'video_url' => $payload['video'] ?? null,
            'bestseller' => $payload['bestseller'] ?? false,
        ];

        if (!empty($payload['id'])) {
            $normalized['id'] = $payload['id'];
        }

        return $normalized;
    }

    private function syncVariants(Product $product, array $variants): void
    {
        if (empty($variants)) {
            return;
        }

        foreach ($variants as $variant) {
            $sku = $variant['sku'] ?? $product->id.'-'.$variant['size'].'-'.$variant['color'];
            ProductVariant::query()->updateOrCreate(
                ['sku' => $sku],
                [
                    'product_id' => $product->id,
                    'size' => $variant['size'] ?? null,
                    'color' => $variant['color'] ?? null,
                    'stock' => $variant['stock'] ?? 0,
                    'low_stock_threshold' => $variant['lowStockThreshold'] ?? 5,
                    'price_override' => $variant['priceOverride'] ?? null,
                ]
            );
        }
    }
}
