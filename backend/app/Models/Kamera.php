<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kamera extends Model
{
    use HasFactory;

    protected $table = 'kamera';

    protected $fillable = [
        'nama_lokasi',
        'rtsp_url',
        'latitude',
        'longitude',
        'status_aktif',
    ];

    protected function casts(): array
    {
        return [
            'status_aktif' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function laporan(): HasMany
    {
        return $this->hasMany(Laporan::class, 'kamera_id');
    }

    public function deteksiCctv(): HasMany
    {
        return $this->hasMany(DeteksiCctv::class, 'kamera_id');
    }
}