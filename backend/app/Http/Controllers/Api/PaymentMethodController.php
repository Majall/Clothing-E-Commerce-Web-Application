<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentMethodController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $methods = $request->user()->paymentMethods()
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->get();

        return response()->json([
            'methods' => $methods->map->toFrontendArray()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'label' => ['nullable', 'string', 'max:60'],
            'brand' => ['required', 'string', 'max:30'],
            'lastFour' => ['required', 'digits:4'],
            'expiryMonth' => ['required', 'integer', 'between:1,12'],
            'expiryYear' => ['required', 'integer', 'min:2024', 'max:2100'],
            'isDefault' => ['sometimes', 'boolean'],
        ]);

        $method = DB::transaction(function () use ($request, $payload) {
            /** @var PaymentMethod $method */
            $method = $request->user()->paymentMethods()->create([
                'label' => $payload['label'] ?? null,
                'brand' => $payload['brand'],
                'last_four' => $payload['lastFour'],
                'expiry_month' => $payload['expiryMonth'],
                'expiry_year' => $payload['expiryYear'],
                'is_default' => (bool) ($payload['isDefault'] ?? false),
            ]);

            if ($method->is_default) {
                $request->user()->paymentMethods()
                    ->where('id', '!=', $method->id)
                    ->update(['is_default' => false]);
            } elseif (!$request->user()->paymentMethods()->where('is_default', true)->exists()) {
                $method->is_default = true;
                $method->save();
            }

            return $method->refresh();
        });

        return response()->json([
            'method' => $method->toFrontendArray(),
        ], 201);
    }

    public function destroy(Request $request, int $methodId): JsonResponse
    {
        $method = $request->user()->paymentMethods()->findOrFail($methodId);
        $wasDefault = $method->is_default;

        DB::transaction(function () use ($method, $wasDefault) {
            $method->delete();

            if ($wasDefault) {
                $nextDefault = $method->user->paymentMethods()->orderBy('id')->first();
                if ($nextDefault) {
                    $nextDefault->is_default = true;
                    $nextDefault->save();
                }
            }
        });

        return response()->json(['deleted' => true]);
    }
}
