<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\HasMany;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany as HasManyRelation;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'phone', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    #[HasMany(Address::class)]
    public function addresses(): HasManyRelation
    {
        return $this->hasMany(Address::class);
    }

    #[HasMany(Order::class)]
    public function orders(): HasManyRelation
    {
        return $this->hasMany(Order::class);
    }

    #[HasMany(WishlistItem::class)]
    public function wishlistItems(): HasManyRelation
    {
        return $this->hasMany(WishlistItem::class);
    }

    #[HasMany(PaymentMethod::class)]
    public function paymentMethods(): HasManyRelation
    {
        return $this->hasMany(PaymentMethod::class);
    }

    #[HasMany(AccountNotification::class)]
    public function accountNotifications(): HasManyRelation
    {
        return $this->hasMany(AccountNotification::class);
    }
}
