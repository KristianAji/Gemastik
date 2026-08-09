<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status_akun',
        'no_telepon',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Laporan yang diverifikasi oleh admin DP3A ini
    public function laporanDiverifikasi(): HasMany
    {
        return $this->hasMany(Laporan::class, 'diverifikasi_oleh');
    }

    // Penugasan yang diterima petugas UPTD PPA ini
    public function penugasanDiterima(): HasMany
    {
        return $this->hasMany(Penugasan::class, 'petugas_id');
    }

    // Penugasan yang dibuat oleh admin DP3A ini
    public function penugasanDibuat(): HasMany
    {
        return $this->hasMany(Penugasan::class, 'ditugaskan_oleh');
    }

    // Kronologi kasus yang dicatat oleh user ini (biasanya admin Dinsos)
    public function kronologiDicatat(): HasMany
    {
        return $this->hasMany(KronologiKasus::class, 'dicatat_oleh');
    }
}