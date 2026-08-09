<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'notifikasi';

    protected $fillable = [
        'laporan_id',
        'pesan',
        'is_read',
        'perlu_tindakan',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'perlu_tindakan' => 'boolean',
        ];
    }

    public function laporan(): BelongsTo
    {
        return $this->belongsTo(Laporan::class, 'laporan_id');
    }
}