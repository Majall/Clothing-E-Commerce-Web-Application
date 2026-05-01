<?php

use App\Http\Controllers\Api\AccountNotificationController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LoyaltyPointsController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/password/forgot', [PasswordResetController::class, 'requestReset']);
    Route::post('/password/reset', [PasswordResetController::class, 'reset']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{addressId}', [AddressController::class, 'update']);
    Route::delete('/addresses/{addressId}', [AddressController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{itemId}', [WishlistController::class, 'destroy']);

    Route::get('/payment-methods', [PaymentMethodController::class, 'index']);
    Route::post('/payment-methods', [PaymentMethodController::class, 'store']);
    Route::delete('/payment-methods/{methodId}', [PaymentMethodController::class, 'destroy']);

    Route::get('/notifications', [AccountNotificationController::class, 'index']);
    Route::patch('/notifications/{notificationId}/read', [AccountNotificationController::class, 'markRead']);

    Route::get('/loyalty-points', [LoyaltyPointsController::class, 'show']);
});
