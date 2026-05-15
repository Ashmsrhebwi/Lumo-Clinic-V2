<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('facebook_leads', function (Blueprint $table) {
            $table->id();
            $table->string('leadgen_id')->unique();
            $table->string('form_id')->nullable();
            $table->string('page_id')->nullable();
            $table->string('platform')->nullable();

            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            $table->string('language')->nullable();

            $table->json('meta_payload')->nullable();
            $table->json('bitrix_response')->nullable();

            $table->string('status')->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_leads');
    }
};