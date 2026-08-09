<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Laporan extends Model
{
    use HasFactory;

    protected $table = 'laporan';

    protected $fillable = [
        'sumber',
        'kamera_id',
        'nama_lokasi',
        'latitude',
        'longitude',
        'waktu_kejadian',
        'deskripsi',
        'foto_path',
        'jenis_aktivitas',
        'jumlah_anak',
        'is_darurat',
        'identitas_pelapor',
        'status',
        'diverifikasi_oleh',
        'diverifikasi_at',
    ];

    protected function casts(): array
    {
        return [
            'waktu_kejadian' => 'datetime',
            'diverifikasi_at' => 'datetime',
            'is_darurat' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function kamera(): BelongsTo
    {
        return $this->belongsTo(Kamera::class, 'kamera_id');
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    public function deteksiCctv(): HasMany
    {
        return $this->hasMany(DeteksiCctv::class, 'laporan_id');
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class, 'laporan_id');
    }

    public function penugasan(): HasOne
    {
        return $this->hasOne(Penugasan::class, 'laporan_id');
    }

    public function kronologiKasus(): HasMany
    {
        return $this->hasMany(KronologiKasus::class, 'laporan_id');
    }
}