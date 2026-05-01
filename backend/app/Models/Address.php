<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo as BelongsToRelation;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'full_name',
        'phone',
        'line_one',
        'line_two',
        'city',
        'state',
        'postal_code',
        'country',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
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
            'fullName' => $this->full_name,
            'phone' => $this->phone,
            'line1' => $this->line_one,
            'line2' => $this->line_two,
            'city' => $this->city,
            'state' => $this->state,
            'postalCode' => $this->postal_code,
            'country' => $this->country,
            'isDefault' => $this->is_default,
        ];
    }
}
