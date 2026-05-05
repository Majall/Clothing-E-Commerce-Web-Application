<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    private const COLORS = ['Black', 'White', 'Navy', 'Olive', 'Sand', 'Blush', 'Charcoal', 'Denim', 'Taupe', 'Burgundy'];

    private const STYLES = ['Minimal', 'Street', 'Classic', 'Athleisure', 'Resort', 'Formal', 'Vintage', 'Luxe'];

    private const FABRICS = ['Cotton', 'Linen', 'Denim', 'Silk', 'Wool', 'Jersey', 'Satin', 'Twill'];

    private const REVIEW_TITLES = ['Love the fit', 'Comfortable and chic', 'Premium feel', 'Great everyday pick', 'Beautiful quality'];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = json_decode(file_get_contents(database_path('seeders/data/products.json')), true);

        foreach ($products as $product) {
            $seed = crc32($product['id']);
            $colors = $this->pick(self::COLORS, $seed, 3);
            $styleTags = $this->pick(self::STYLES, $seed + 3, 2);
            $fabric = self::FABRICS[$seed % count(self::FABRICS)];
            $rating = round(4 + (($seed % 9) / 10), 1);
            $reviewCount = ($seed % 18) + 4;
            $videoUrl = $seed % 7 === 0 ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' : null;

            $model = Product::updateOrCreate(
                ['id' => $product['id']],
                [
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'images' => $product['images'],
                    'category' => $product['category'],
                    'sub_category' => $product['sub_category'],
                    'sizes' => $product['sizes'],
                    'colors' => $colors,
                    'style_tags' => $styleTags,
                    'fabric' => $fabric,
                    'material' => $fabric,
                    'video_url' => $videoUrl,
                    'rating' => $rating,
                    'review_count' => $reviewCount,
                    'source_date' => $product['source_date'],
                    'bestseller' => $product['bestseller'],
                ]
            );

            foreach ($product['sizes'] as $index => $size) {
                foreach (array_slice($colors, 0, 2) as $colorIndex => $color) {
                    $sku = $product['id'].'-'.$size.'-'.$color;
                    ProductVariant::updateOrCreate(
                        ['sku' => $sku],
                        [
                            'product_id' => $product['id'],
                            'size' => $size,
                            'color' => $color,
                            'stock' => 8 + (($seed + $index + $colorIndex) % 12),
                            'low_stock_threshold' => 4,
                        ]
                    );
                }
            }

            for ($i = 0; $i < 3; $i++) {
                $title = self::REVIEW_TITLES[($seed + $i) % count(self::REVIEW_TITLES)];
                ProductReview::updateOrCreate(
                    [
                        'product_id' => $product['id'],
                        'title' => $title,
                        'author' => 'Style Member '.(($seed + $i) % 50 + 1),
                    ],
                    [
                        'rating' => $i % 2 === 0 ? 5 : 4,
                        'body' => 'The quality feels premium and the fit works effortlessly with other pieces.',
                    ]
                );
            }
        }
    }

    private function pick(array $pool, int $seed, int $count): array
    {
        $result = [];
        $total = count($pool);
        for ($i = 0; $i < $count; $i++) {
            $index = ($seed + ($i * 7)) % $total;
            if (!in_array($pool[$index], $result, true)) {
                $result[] = $pool[$index];
            }
        }

        return $result;
    }
}
