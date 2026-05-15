<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treatment_id')->constrained('treatments')->onDelete('cascade');
            $table->unsignedBigInteger('before_media_id')->nullable();
            $table->unsignedBigInteger('after_media_id')->nullable();
            $table->json('patient_name');
            $table->json('story');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
