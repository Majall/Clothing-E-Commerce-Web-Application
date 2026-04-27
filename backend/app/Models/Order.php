<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo as BelongsToRelation;
use Illuminate\Database\Eloquent\Relations\HasMany as HasManyRelation;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'shipping_address',
        'payment_method',
        'subtotal',
        'shipping',
        'total',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'shipping_address' => 'array',
            'subtotal' => 'integer',
            'shipping' => 'integer',
            'total' => 'integer',
        ];
    }

    #[BelongsTo(User::class)]
    public function user(): BelongsToRelation
    {
        return $this->belongsTo(User::class);
    }

    #[HasMany(OrderItem::class)]
    public function items(): HasManyRelation
    {
        return $this->hasMany(OrderItem::class);
    }
}
