<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HasilPenanganan extends Model
{
    use HasFactory;

    protected $table = 'hasil_penanganan';

    protected $fillable = [
        'penugasan_id',
        'status_akhir',
        'catatan',
        'foto_dokumentasi',
        'lama_di_shelter',
    ];

    public function penugasan(): BelongsTo
    {
        return $this->belongsTo(Penugasan::class, 'penugasan_id');
    }
}