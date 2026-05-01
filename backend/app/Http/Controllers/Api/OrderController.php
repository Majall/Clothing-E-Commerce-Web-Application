<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    private const FREE_SHIPPING_THRESHOLD = 500;

    private const STANDARD_SHIPPING_FEE = 40;

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.product', 'user'])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders->map(fn (Order $order) => $this->toFrontendArray($order))->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'shippingAddress' => ['required', 'array'],
            'paymentMethod' => ['required', 'string', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.productId' => ['required', 'string', 'exists:products,id'],
            'items.*.size' => ['required', 'string', 'max:50'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $user = $request->user();

        $productIds = collect($payload['items'])
            ->pluck('productId')
            ->unique()
            ->values();

        $products = Product::query()
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        $normalizedItems = collect($payload['items'])->map(function (array $item) use ($products) {
            /** @var Product $product */
            $product = $products->get($item['productId']);
            $quantity = (int) $item['quantity'];
            $unitPrice = (int) $product->price;

            return [
                'product_id' => $product->id,
                'size' => $item['size'],
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'line_total' => $unitPrice * $quantity,
            ];
        })->values();

        $subtotal = (int) $normalizedItems->sum('line_total');
        $shipping = $subtotal >= self::FREE_SHIPPING_THRESHOLD ? 0 : self::STANDARD_SHIPPING_FEE;
        $total = $subtotal + $shipping;

        $order = DB::transaction(function () use ($user, $payload, $normalizedItems, $subtotal, $shipping, $total) {
            $order = Order::query()->create([
                'user_id' => $user->id,
                'order_number' => 'ORD-'.now()->timestamp.'-'.str_pad((string) random_int(0, 999), 3, '0', STR_PAD_LEFT),
                'shipping_address' => $payload['shippingAddress'],
                'payment_method' => $payload['paymentMethod'],
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'status' => 'Confirmed',
            ]);

            $order->items()->createMany($normalizedItems->all());

            return $order->load(['items.product', 'user']);
        });

        return response()->json([
            'order' => $this->toFrontendArray($order),
        ], 201);
    }

    private function toFrontendArray(Order $order): array
    {
        return [
            'id' => $order->order_number,
            'createdAt' => $order->created_at?->toIso8601String(),
            'user' => [
                'id' => $order->user_id,
                'name' => $order->user?->name,
                'email' => $order->user?->email,
            ],
            'items' => $order->items->map(function ($item) {
                return [
                    'sku' => $item->product_id.'|'.$item->size,
                    'productId' => $item->product_id,
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'product' => $item->product->toFrontendArray(),
                    'lineTotal' => $item->line_total,
                ];
            })->values(),
            'shippingAddress' => $order->shipping_address,
            'paymentMethod' => $order->payment_method,
            'subtotal' => $order->subtotal,
            'shipping' => $order->shipping,
            'total' => $order->total,
            'status' => $order->status,
        ];
    }
}
