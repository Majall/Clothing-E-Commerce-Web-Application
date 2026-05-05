<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function summary(): JsonResponse
    {
        $orders = Order::query()->count();
        $revenue = (int) Order::query()->sum('total');
        $users = User::query()->count();
        $products = Product::query()->count();

        return response()->json([
            'orders' => $orders,
            'revenue' => $revenue,
            'users' => $users,
            'products' => $products,
            'topCategories' => Product::query()
                ->select('category')
                ->selectRaw('count(*) as total')
                ->groupBy('category')
                ->orderByDesc('total')
                ->limit(5)
                ->get(),
        ]);
    }
}
