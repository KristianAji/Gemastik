<?php

namespace App\Http\Controllers;

use App\Models\HasilPenanganan;
use App\Models\Penugasan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HasilPenangananController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'penugasan_id' => ['required', 'exists:penugasan,id'],
            'status_akhir' => ['required', Rule::in(['berhasil_ditangani', 'dirujuk_dinsos', 'tidak_ditemukan'])],
            'catatan' => ['nullable', 'string'],
            'foto_dokumentasi' => ['nullable', 'image', 'max:5120'],
            'lama_di_shelter' => ['nullable', 'integer', 'min:1', 'max:14'],
        ]);

        $penugasan = Penugasan::where('id', $validated['penugasan_id'])
            ->where('petugas_id', $request->user()->id)
            ->firstOrFail();

        if (HasilPenanganan::where('penugasan_id', $validated['penugasan_id'])->exists()) {
            return response()->json(['message' => 'Hasil penanganan untuk penugasan ini sudah ada.'], 422);
        }

        $fotoDokumentasi = null;
        if ($request->hasFile('foto_dokumentasi')) {
            $fotoDokumentasi = $request->file('foto_dokumentasi')->store('dokumentasi', 'public');
        }

        HasilPenanganan::create([
            'penugasan_id' => $validated['penugasan_id'],
            'status_akhir' => $validated['status_akhir'],
            'catatan' => $validated['catatan'] ?? null,
            'foto_dokumentasi' => $fotoDokumentasi,
            'lama_di_shelter' => $validated['lama_di_shelter'] ?? null,
        ]);

        $penugasan->update(['status' => 'selesai']);

        return response()->json(['message' => 'Hasil penanganan berhasil disimpan.'], 201);
    }

    public function riwayat(Request $request): JsonResponse
    {
        $riwayat = Penugasan::with([
            'laporan:id,nama_lokasi,jenis_aktivitas,waktu_kejadian',
            'hasilPenanganan',
        ])->where('petugas_id', $request->user()->id)
            ->where('status', 'selesai')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($riwayat);
    }
}