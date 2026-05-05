<?php

namespace Database\Seeders;

use App\Models\PricingRule;
use Illuminate\Database\Seeder;

class PricingRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PricingRule::updateOrCreate(
            ['name' => 'Women launch offer'],
            [
                'scope' => 'category',
                'target' => 'Women',
                'type' => 'percent',
                'value' => 10,
                'active' => true,
            ]
        );

        PricingRule::updateOrCreate(
            ['name' => 'Kids flash deal'],
            [
                'scope' => 'category',
                'target' => 'Kids',
                'type' => 'amount',
                'value' => 30,
                'active' => true,
            ]
        );
    }
}
