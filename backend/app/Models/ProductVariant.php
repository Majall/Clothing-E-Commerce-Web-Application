<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo as BelongsToRelation;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'sku',
        'size',
        'color',
        'stock',
        'low_stock_threshold',
        'price_override',
    ];

    protected function casts(): array
    {
        return [
            'stock' => 'integer',
            'low_stock_threshold' => 'integer',
            'price_override' => 'integer',
        ];
    }

    #[BelongsTo(Product::class)]
    public function product(): BelongsToRelation
    {
        return $this->belongsTo(Product::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'sku' => $this->sku,
            'size' => $this->size,
            'color' => $this->color,
            'stock' => $this->stock,
            'lowStockThreshold' => $this->low_stock_threshold,
            'priceOverride' => $this->price_override,
        ];
    }
}
