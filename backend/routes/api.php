<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Public\InitController;
use App\Http\Controllers\Api\V1\Public\TreatmentController as PublicTreatmentController;
use App\Http\Controllers\Api\V1\Public\DoctorController as PublicDoctorController;
use App\Http\Controllers\Api\V1\Public\TestimonialController as PublicTestimonialController;
use App\Http\Controllers\Api\V1\Public\StatController as PublicStatController;
use App\Http\Controllers\Api\V1\Public\ResultController as PublicResultController;
use App\Http\Controllers\Api\V1\Public\FaqController as PublicFaqController;
use App\Http\Controllers\Api\V1\Public\LocationController as PublicLocationController;
use App\Http\Controllers\Api\V1\Public\ArticleController as PublicArticleController;
use App\Http\Controllers\Api\V1\Public\SocialLinkController as PublicSocialLinkController;
use App\Http\Controllers\Api\V1\Public\ProcessStepController as PublicProcessStepController;

use App\Http\Controllers\Api\V1\Admin\TreatmentController;
use App\Http\Controllers\Api\V1\Admin\TestimonialController;
use App\Http\Controllers\Api\V1\Admin\ArticleController;
use App\Http\Controllers\Api\V1\Admin\DoctorController;
use App\Http\Controllers\Api\V1\Admin\FaqController;
use App\Http\Controllers\Api\V1\Admin\LocationController;
use App\Http\Controllers\Api\V1\Admin\MediaController;
use App\Http\Controllers\Api\V1\Admin\NavbarItemController;
use App\Http\Controllers\Api\V1\Admin\NavbarSectionController;
use App\Http\Controllers\Api\V1\Admin\ProcessStepController;
use App\Http\Controllers\Api\V1\Admin\ResultController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\SocialLinkController;
use App\Http\Controllers\Api\V1\Admin\StatController;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| Public Routes (Client-Facing)
|--------------------------------------------------------------------------
*/
Route::prefix('public')->group(function () {
    Route::get('/settings', [InitController::class, 'index']);
    Route::get('/nav-links', [InitController::class, 'navLinks']);
    Route::get('/init-full', [InitController::class, 'initFull']);
    
    Route::get('/treatments', [PublicTreatmentController::class, 'index']);
    Route::get('/treatments/{slug}', [PublicTreatmentController::class, 'show']);
    
    Route::get('/doctors', [PublicDoctorController::class, 'index']);
    Route::get('/testimonials', [PublicTestimonialController::class, 'index']);
    Route::get('/stats', [PublicStatController::class, 'index']);
    Route::get('/results', [PublicResultController::class, 'index']);
    Route::get('/faqs', [PublicFaqController::class, 'index']);
    Route::get('/locations', [PublicLocationController::class, 'index']);
    
    Route::get('/blogs', [PublicArticleController::class, 'index']);
    Route::get('/blogs/{slug}', [PublicArticleController::class, 'show']);
    
    Route::get('/social-links', [PublicSocialLinkController::class, 'index']);
    Route::get('/process-steps', [PublicProcessStepController::class, 'index']);
    Route::post('/leads', [\App\Http\Controllers\Api\V1\Public\LeadController::class, 'store'])->middleware('throttle:10,1');
    });

/*
|--------------------------------------------------------------------------
| Admin Routes (Dashboard-Facing)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('treatments', TreatmentController::class);
    Route::apiResource('testimonials', TestimonialController::class);
    
    // Alias for 'articles' as 'blogs'
    Route::apiResource('articles', ArticleController::class);
    Route::apiResource('blogs', ArticleController::class);
    
    Route::apiResource('doctors', DoctorController::class);
    Route::apiResource('faqs', FaqController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('results', ResultController::class);
    Route::apiResource('social-links', SocialLinkController::class);
    Route::apiResource('stats', StatController::class);
    Route::apiResource('process-steps', ProcessStepController::class);
    
    Route::apiResource('navbar-sections', NavbarSectionController::class);
    Route::apiResource('navbar-items', NavbarItemController::class);
    
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);
    Route::post('/settings/batch', [SettingController::class, 'updateBatch']);
    
    // Alias for 'media/upload' as 'upload'
    Route::post('/media/upload', [MediaController::class, 'upload']);
    Route::post('/upload', [MediaController::class, 'upload']);
    
    Route::get('/media', [MediaController::class, 'index']);
    Route::delete('/media/{id}', [MediaController::class, 'destroy']);
    
});
    /*
    |--------------------------------------------------------------------------
    | Meta Webhook Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/meta/webhook', [\App\Http\Controllers\Api\V1\MetaWebhookController::class, 'verify']);
    Route::post('/meta/webhook', [\App\Http\Controllers\Api\V1\MetaWebhookController::class, 'handle']);

