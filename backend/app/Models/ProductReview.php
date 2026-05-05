<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo as BelongsToRelation;

class ProductReview extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'author',
        'rating',
        'title',
        'body',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    #[BelongsTo(Product::class)]
    public function product(): BelongsToRelation
    {
        return $this->belongsTo(Product::class);
    }

    #[BelongsTo(User::class)]
    public function user(): BelongsToRelation
    {
        return $this->belongsTo(User::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'author' => $this->author ?: ($this->user?->name ?? 'Anonymous'),
            'rating' => $this->rating,
            'title' => $this->title,
            'body' => $this->body,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
