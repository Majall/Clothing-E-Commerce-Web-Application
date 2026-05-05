<?php

namespace App\Services;

use App\Models\PricingRule;
use App\Models\Product;

class PricingEngine
{
    public function apply(Product $product): array
    {
        $price = (int) $product->price;
        $discount = 0;
        $ruleName = null;

        $rules = PricingRule::query()
            ->where('active', true)
            ->where(function ($query) {
                $query->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            })
            ->get();

        foreach ($rules as $rule) {
            if ($rule->scope === 'product' && $rule->target !== $product->id) {
                continue;
            }
            if ($rule->scope === 'category' && $rule->target !== $product->category) {
                continue;
            }

            if ($rule->type === 'percent') {
                $discount = (int) floor(($price * $rule->value) / 100);
            } elseif ($rule->type === 'amount') {
                $discount = (int) min($price, $rule->value);
            }

            $ruleName = $rule->name;
            break;
        }

        return [
            'price' => max($price - $discount, 0),
            'discount' => $discount,
            'rule' => $ruleName,
        ];
    }
}
