<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountNotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->accountNotifications()
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'notifications' => $notifications->map->toFrontendArray()->values(),
        ]);
    }

    public function markRead(Request $request, int $notificationId): JsonResponse
    {
        $notification = $request->user()->accountNotifications()->findOrFail($notificationId);
        $notification->read_at = now();
        $notification->save();

        return response()->json([
            'notification' => $notification->toFrontendArray(),
        ]);
    }
}
