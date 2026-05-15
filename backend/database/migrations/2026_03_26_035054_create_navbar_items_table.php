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
        Schema::create('navbar_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('navbar_section_id')->constrained('navbar_sections')->onDelete('cascade');
            $table->unsignedBigInteger('treatment_id')->nullable(); // Plain integer for now (Phase 1)
            $table->string('custom_url')->nullable();
            $table->json('label');
            $table->integer('order')->default(0);
            $table->boolean('open_in_new_tab')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('navbar_items');
    }
};
