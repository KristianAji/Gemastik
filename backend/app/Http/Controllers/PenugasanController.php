<?php

namespace App\Http\Controllers;

use App\Models\Penugasan;
use App\Models\Laporan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PenugasanController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'laporan_id' => ['required', 'exists:laporan,id'],
            'petugas_id' => ['required', 'exists:users,id'],
            'prioritas' => ['required', Rule::in(['rendah', 'sedang', 'tinggi'])],
            'catatan_awal' => ['nullable', 'string'],
        ]);

        $laporan = Laporan::where('id', $validated['laporan_id'])
            ->where('status', 'terverifikasi')
            ->firstOrFail();

        if (Penugasan::where('laporan_id', $validated['laporan_id'])->exists()) {
            return response()->json(['message' => 'Laporan ini sudah memiliki penugasan.'], 422);
        }

        $penugasan = Penugasan::create([
            'laporan_id' => $validated['laporan_id'],
            'petugas_id' => $validated['petugas_id'],
            'ditugaskan_oleh' => $request->user()->id,
            'prioritas' => $validated['prioritas'],
            'catatan_awal' => $validated['catatan_awal'] ?? null,
            'status' => 'belum',
        ]);

        $laporan->update(['status' => 'ditangani']);

        return response()->json([
            'message' => 'Penugasan berhasil dibuat.',
            'penugasan_id' => $penugasan->id,
        ], 201);
    }

    public function index(): JsonResponse
    {
        $penugasan = Penugasan::with([
            'laporan:id,nama_lokasi,jenis_aktivitas,status,waktu_kejadian',
            'petugas:id,name',
            'penugas:id,name',
        ])->orderBy('created_at', 'desc')->get();

        return response()->json($penugasan);
    }

    public function aktif(Request $request): JsonResponse
    {
        $penugasan = Penugasan::with([
            'laporan:id,nama_lokasi,jenis_aktivitas,latitude,longitude,waktu_kejadian,is_darurat',
        ])->where('petugas_id', $request->user()->id)
            ->whereIn('status', ['belum', 'diproses'])
            ->orderByRaw("FIELD(prioritas, 'tinggi', 'sedang', 'rendah')")
            ->get();

        return response()->json($penugasan);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['diproses', 'selesai'])],
        ]);

        $penugasan = Penugasan::where('id', $id)
            ->where('petugas_id', $request->user()->id)
            ->firstOrFail();

        $penugasan->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Status penugasan berhasil diperbarui.']);
    }
}