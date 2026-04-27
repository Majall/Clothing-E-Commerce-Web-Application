<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany as HasManyRelation;

class Product extends Model
{
    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'description',
        'price',
        'images',
        'category',
        'sub_category',
        'sizes',
        'source_date',
        'bestseller',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'sizes' => 'array',
            'source_date' => 'integer',
            'price' => 'integer',
            'bestseller' => 'boolean',
        ];
    }

    #[HasMany(OrderItem::class)]
    public function orderItems(): HasManyRelation
    {
        return $this->hasMany(OrderItem::class);
    }

    public function toFrontendArray(): array
    {
        return [
            '_id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'image' => $this->images ?? [],
            'category' => $this->category,
            'subCategory' => $this->sub_category,
            'sizes' => $this->sizes ?? [],
            'date' => $this->source_date,
            'bestseller' => $this->bestseller,
        ];
    }
}
