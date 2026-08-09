<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeteksiCctv extends Model
{
    use HasFactory;

    protected $table = 'deteksi_cctv';

    protected $fillable = [
        'laporan_id',
        'kamera_id',
        'hasil_klasifikasi',
        'confidence_score',
        'bounding_box',
    ];

    protected function casts(): array
    {
        return [
            'bounding_box' => 'array',
            'confidence_score' => 'decimal:4',
        ];
    }

    public function laporan(): BelongsTo
    {
        return $this->belongsTo(Laporan::class, 'laporan_id');
    }

    public function kamera(): BelongsTo
    {
        return $this->belongsTo(Kamera::class, 'kamera_id');
    }
}