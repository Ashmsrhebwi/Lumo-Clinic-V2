<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LocalCors
{
    /**
     * Handle an incoming request.
     *
     * SECURITY: Restrict CORS to specific trusted origins only
     * Prevents CSRF attacks and unauthorized cross-origin requests
     */
    public function handle(Request $request, Closure $next): Response
    {
        // SECURITY: Get allowed origins from environment configuration
        $allowedOrigins = array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', env('FRONTEND_URL', config('app.url'))))));
        
        $origin = $request->headers->get('Origin');
        
        // SECURITY: Only allow requests from configured origins
        $isAllowedOrigin = in_array($origin, $allowedOrigins, true);
        
        if ($request->getMethod() === "OPTIONS") {
            if ($isAllowedOrigin) {
                return response('', 204)
                    ->header('Access-Control-Allow-Origin', $origin)
                    ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                    ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
                    ->header('Access-Control-Allow-Credentials', 'true')
                    ->header('Access-Control-Max-Age', '86400');
            }
            
            // SECURITY: Reject preflight requests from unauthorized origins
            return response('', 403);
        }

        $response = $next($request);

        // SECURITY: Only add CORS headers for allowed origins
        if ($isAllowedOrigin) {
            return $response
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Expose-Headers', 'Content-Type, Authorization')
                ->header('Vary', 'Origin');
        }

        return $response;
    }
}