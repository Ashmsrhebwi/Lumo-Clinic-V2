<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * SECURITY: Add indexes to all foreign keys to prevent slow queries and deadlocks
     */
    public function up(): void
    {
        // Treatments table indexes
        Schema::table('treatments', function (Blueprint $table) {
            $table->index('media_id')->after('media_id');
            $table->index('content_media_id')->after('content_media_id');
            $table->index('after_media_id')->after('after_media_id');
            $table->index('slug')->after('slug');
            $table->index('is_active')->after('is_active');
            $table->index('order')->after('order');
        });

        // Articles table indexes
        Schema::table('articles', function (Blueprint $table) {
            $table->index('image_id')->after('image_id');
            $table->index('treatment_id')->after('treatment_id');
            $table->index('slug')->after('slug');
            $table->index('is_active')->after('is_active');
        });

        // Results table indexes
        Schema::table('results', function (Blueprint $table) {
            $table->index('before_media_id')->after('before_media_id');
            $table->index('after_media_id')->after('after_media_id');
            $table->index('treatment_id')->after('treatment_id');
            $table->index('is_active')->after('is_active');
        });

        // Testimonials table indexes
        Schema::table('testimonials', function (Blueprint $table) {
            $table->index('treatment_id')->after('treatment_id');
            $table->index('is_active')->after('is_active');
        });

        // Navbar items table indexes
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->index('treatment_id')->after('treatment_id');
            $table->index('navbar_section_id')->after('navbar_section_id');
            $table->index('is_active')->after('is_active');
            $table->index('order')->after('order');
        });

        // Doctors table indexes
        Schema::table('doctors', function (Blueprint $table) {
            $table->index('image_id')->after('image_id');
            $table->index('is_active')->after('is_active');
        });

        // Stats table indexes
        Schema::table('stats', function (Blueprint $table) {
            $table->index('is_active')->after('is_active');
        });

        // Process steps table indexes
        Schema::table('process_steps', function (Blueprint $table) {
            $table->index('is_active')->after('is_active');
            $table->index('order')->after('order');
        });

        // Social links table indexes
        Schema::table('social_links', function (Blueprint $table) {
            $table->index('is_active')->after('is_active');
        });

        // FAQs table indexes
        Schema::table('faqs', function (Blueprint $table) {
            $table->index('category')->after('category');
        });

        // Locations table indexes
        Schema::table('locations', function (Blueprint $table) {
            $table->index('is_active')->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('treatments', function (Blueprint $table) {
            $table->dropIndex(['media_id']);
            $table->dropIndex(['content_media_id']);
            $table->dropIndex(['after_media_id']);
            $table->dropIndex(['slug']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['order']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['image_id']);
            $table->dropIndex(['treatment_id']);
            $table->dropIndex(['slug']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('results', function (Blueprint $table) {
            $table->dropIndex(['before_media_id']);
            $table->dropIndex(['after_media_id']);
            $table->dropIndex(['treatment_id']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropIndex(['treatment_id']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('navbar_items', function (Blueprint $table) {
            $table->dropIndex(['treatment_id']);
            $table->dropIndex(['navbar_section_id']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['order']);
        });

        Schema::table('doctors', function (Blueprint $table) {
            $table->dropIndex(['image_id']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('stats', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('process_steps', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['order']);
        });

        Schema::table('social_links', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->dropIndex(['category']);
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });
    }
};
