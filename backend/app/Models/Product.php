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
        'colors',
        'style_tags',
        'fabric',
        'material',
        'video_url',
        'rating',
        'review_count',
        'source_date',
        'bestseller',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'sizes' => 'array',
            'colors' => 'array',
            'style_tags' => 'array',
            'source_date' => 'integer',
            'price' => 'integer',
            'bestseller' => 'boolean',
            'rating' => 'float',
            'review_count' => 'integer',
        ];
    }

    #[HasMany(OrderItem::class)]
    public function orderItems(): HasManyRelation
    {
        return $this->hasMany(OrderItem::class);
    }

    #[HasMany(ProductVariant::class)]
    public function variants(): HasManyRelation
    {
        return $this->hasMany(ProductVariant::class);
    }

    #[HasMany(ProductReview::class)]
    public function reviews(): HasManyRelation
    {
        return $this->hasMany(ProductReview::class);
    }

    public function toFrontendArray(): array
    {
        return [
            '_id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'basePrice' => $this->price,
            'image' => $this->images ?? [],
            'category' => $this->category,
            'subCategory' => $this->sub_category,
            'sizes' => $this->sizes ?? [],
            'colors' => $this->colors ?? [],
            'styleTags' => $this->style_tags ?? [],
            'fabric' => $this->fabric,
            'material' => $this->material,
            'video' => $this->video_url,
            'rating' => $this->rating,
            'reviewCount' => $this->review_count,
            'variants' => $this->variants->map->toFrontendArray()->values(),
            'date' => $this->source_date,
            'bestseller' => $this->bestseller,
        ];
    }
}
