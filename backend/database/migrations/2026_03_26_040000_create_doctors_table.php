<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('specialty');
            $table->unsignedBigInteger('image_id')->nullable();
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->string('experience')->nullable();
            $table->string('patients')->nullable();
            $table->json('languages'); // Array of MultiLangText
            $table->json('bio');
            $table->json('specialties'); // Array of MultiLangText
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
