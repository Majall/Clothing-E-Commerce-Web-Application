<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo as BelongsToRelation;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'size',
        'color',
        'quantity',
        'unit_price',
        'line_total',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'line_total' => 'integer',
        ];
    }

    #[BelongsTo(Order::class)]
    public function order(): BelongsToRelation
    {
        return $this->belongsTo(Order::class);
    }

    #[BelongsTo(Product::class)]
    public function product(): BelongsToRelation
    {
        return $this->belongsTo(Product::class);
    }
}
