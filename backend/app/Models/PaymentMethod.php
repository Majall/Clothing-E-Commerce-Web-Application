<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo as BelongsToRelation;

class PaymentMethod extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'brand',
        'last_four',
        'expiry_month',
        'expiry_year',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'expiry_month' => 'integer',
            'expiry_year' => 'integer',
            'is_default' => 'boolean',
        ];
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
            'label' => $this->label,
            'brand' => $this->brand,
            'lastFour' => $this->last_four,
            'expiryMonth' => $this->expiry_month,
            'expiryYear' => $this->expiry_year,
            'isDefault' => $this->is_default,
        ];
    }
}
