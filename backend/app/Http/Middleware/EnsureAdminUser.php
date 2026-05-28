<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensure Admin User Middleware
 * 
 * Verifies that the authenticated user is an admin with proper authorization.
 * This prevents unauthorized access to admin-only endpoints even with a valid token.
 * 
 * SECURITY CRITICAL: This middleware should be applied to all admin routes.
 */
class EnsureAdminUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            Log::warning('Admin access denied: No authenticated user', [
                'ip' => $request->ip(),
                'path' => $request->path()
            ]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Verify user is an admin (role check)
        // This prevents privilege escalation if non-admin tokens somehow access admin routes
        if ($user->role !== 'admin') {
            Log::warning('Admin access denied: Non-admin user attempted access', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_role' => $user->role ?? 'none',
                'ip' => $request->ip(),
                'path' => $request->path()
            ]);
            return response()->json(['message' => 'Forbidden: Admin access required'], 403);
        }

        return $next($request);
    }
}
