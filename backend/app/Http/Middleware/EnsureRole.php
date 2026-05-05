<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();
        if (!$user || ($roles && !in_array($user->role, $roles, true))) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
