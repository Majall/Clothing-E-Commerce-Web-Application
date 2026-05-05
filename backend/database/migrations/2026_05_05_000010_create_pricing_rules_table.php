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
        Schema::create('pricing_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('scope')->default('category');
            $table->string('target')->nullable();
            $table->string('type')->default('percent');
            $table->unsignedInteger('value')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_rules');
    }
};
