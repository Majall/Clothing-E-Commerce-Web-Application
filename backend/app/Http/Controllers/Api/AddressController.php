<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->get();

        return response()->json([
            'addresses' => $addresses->map->toFrontendArray()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $this->validateAddress($request);

        $address = DB::transaction(function () use ($request, $payload) {
            /** @var Address $address */
            $address = $request->user()->addresses()->create($this->mapAddressPayload($payload));

            $this->syncDefault($address, (bool) ($payload['isDefault'] ?? false));

            return $address->refresh();
        });

        return response()->json([
            'address' => $address->toFrontendArray(),
        ], 201);
    }

    public function update(Request $request, int $addressId): JsonResponse
    {
        $payload = $this->validateAddress($request);
        $address = $request->user()->addresses()->findOrFail($addressId);

        DB::transaction(function () use ($address, $payload) {
            $address->fill($this->mapAddressPayload($payload));
            $address->save();

            if (array_key_exists('isDefault', $payload)) {
                $this->syncDefault($address, (bool) $payload['isDefault']);
            } elseif (!$address->user->addresses()->where('is_default', true)->exists()) {
                $address->is_default = true;
                $address->save();
            }
        });

        return response()->json([
            'address' => $address->refresh()->toFrontendArray(),
        ]);
    }

    public function destroy(Request $request, int $addressId): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($addressId);
        $wasDefault = $address->is_default;

        DB::transaction(function () use ($address, $wasDefault) {
            $address->delete();

            if ($wasDefault) {
                $nextDefault = $address->user->addresses()->orderBy('id')->first();
                if ($nextDefault) {
                    $nextDefault->is_default = true;
                    $nextDefault->save();
                }
            }
        });

        return response()->json(['deleted' => true]);
    }

    private function validateAddress(Request $request): array
    {
        return $request->validate([
            'label' => ['nullable', 'string', 'max:60'],
            'fullName' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'line1' => ['required', 'string', 'max:255'],
            'line2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'max:120'],
            'postalCode' => ['required', 'string', 'max:30'],
            'country' => ['required', 'string', 'max:120'],
            'isDefault' => ['sometimes', 'boolean'],
        ]);
    }

    private function mapAddressPayload(array $payload): array
    {
        return [
            'label' => $payload['label'] ?? null,
            'full_name' => $payload['fullName'],
            'phone' => $payload['phone'] ?? null,
            'line_one' => $payload['line1'],
            'line_two' => $payload['line2'] ?? null,
            'city' => $payload['city'],
            'state' => $payload['state'] ?? null,
            'postal_code' => $payload['postalCode'],
            'country' => $payload['country'],
        ];
    }

    private function syncDefault(Address $address, bool $isDefault): void
    {
        if (!$isDefault) {
            if (!$address->user->addresses()->where('is_default', true)->exists()) {
                $address->is_default = true;
                $address->save();
            }
            return;
        }

        $address->user->addresses()
            ->where('id', '!=', $address->id)
            ->update(['is_default' => false]);

        $address->is_default = true;
        $address->save();
    }
}
