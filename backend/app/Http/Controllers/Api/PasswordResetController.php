<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class PasswordResetController extends Controller
{
    public function requestReset(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::query()->where('email', $payload['email'])->first();

        if (!$user) {
            return response()->json([
                'status' => 'If the email exists, a reset token has been created.',
            ]);
        }

        $token = Password::createToken($user);

        return response()->json([
            'status' => 'Reset token created. Use it to set a new password.',
            'token' => $token,
        ]);
    }

    public function reset(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $status = Password::reset(
            $payload,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'status' => 'Password reset successful.',
        ]);
    }
}
