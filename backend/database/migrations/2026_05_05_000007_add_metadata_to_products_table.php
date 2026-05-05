<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('colors')->nullable()->after('sizes');
            $table->json('style_tags')->nullable()->after('colors');
            $table->string('fabric')->nullable()->after('style_tags');
            $table->string('material')->nullable()->after('fabric');
            $table->string('video_url')->nullable()->after('material');
            $table->decimal('rating', 3, 1)->default(0)->after('video_url');
            $table->unsignedInteger('review_count')->default(0)->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'colors',
                'style_tags',
                'fabric',
                'material',
                'video_url',
                'rating',
                'review_count',
            ]);
        });
    }
};
