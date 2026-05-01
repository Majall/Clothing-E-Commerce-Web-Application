<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo as BelongsToRelation;

class WishlistItem extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'size',
    ];

    #[BelongsTo(User::class)]
    public function user(): BelongsToRelation
    {
        return $this->belongsTo(User::class);
    }

    #[BelongsTo(Product::class)]
    public function product(): BelongsToRelation
    {
        return $this->belongsTo(Product::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'size' => $this->size,
            'product' => $this->product?->toFrontendArray(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
