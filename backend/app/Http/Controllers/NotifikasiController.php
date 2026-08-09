<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function index(): JsonResponse
    {
        $notifikasi = Notifikasi::with('laporan:id,nama_lokasi,sumber,status,waktu_kejadian')
            ->orderBy('created_at', 'desc')
            ->get();

        $total = $notifikasi->count();
        $belum_dibaca = $notifikasi->where('is_read', false)->count();
        $perlu_tindakan = $notifikasi->where('perlu_tindakan', true)->count();

        return response()->json([
            'ringkasan' => [
                'total' => $total,
                'belum_dibaca' => $belum_dibaca,
                'perlu_tindakan' => $perlu_tindakan,
            ],
            'data' => $notifikasi,
        ]);
    }

    public function tandaiDibaca(string $id): JsonResponse
    {
        $notifikasi = Notifikasi::findOrFail($id);
        $notifikasi->update(['is_read' => true]);

        return response()->json(['message' => 'Notifikasi ditandai sudah dibaca.']);
    }

    public function tandaiSemuaDibaca(): JsonResponse
    {
        Notifikasi::where('is_read', false)->update(['is_read' => true]);

        return response()->json(['message' => 'Semua notifikasi ditandai sudah dibaca.']);
    }
}