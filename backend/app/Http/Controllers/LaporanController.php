<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class LaporanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Laporan::with('kamera:id,nama_lokasi')
            ->select('id', 'sumber', 'kamera_id', 'nama_lokasi', 'jenis_aktivitas', 'jumlah_anak', 'is_darurat', 'status', 'waktu_kejadian', 'created_at');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('sumber')) {
            $query->where('sumber', $request->sumber);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show(string $id): JsonResponse
    {
        $laporan = Laporan::with([
            'kamera:id,nama_lokasi,latitude,longitude',
            'verifikator:id,name',
            'penugasan.petugas:id,name',
        ])->findOrFail($id);

        return response()->json($laporan);
    }

    public function storeByWarga(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_lokasi' => ['required', 'string'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'deskripsi' => ['nullable', 'string'],
            'foto' => ['nullable', 'image', 'max:5120'],
            'jenis_aktivitas' => ['required', Rule::in(['berjualan', 'mengamen', 'mengemis', 'figuran'])],
            'jumlah_anak' => ['required', 'integer', 'min:1'],
            'is_darurat' => ['boolean'],
            'identitas_pelapor' => ['nullable', 'string'],
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('laporan', 'public');
        }

        $laporan = Laporan::create([
            'sumber' => 'warga',
            'nama_lokasi' => $validated['nama_lokasi'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'waktu_kejadian' => now(),
            'deskripsi' => $validated['deskripsi'] ?? null,
            'foto_path' => $fotoPath,
            'jenis_aktivitas' => $validated['jenis_aktivitas'],
            'jumlah_anak' => $validated['jumlah_anak'],
            'is_darurat' => $validated['is_darurat'] ?? false,
            'identitas_pelapor' => $validated['identitas_pelapor'] ?? null,
            'status' => 'menunggu_verifikasi',
        ]);

        Notifikasi::create([
            'laporan_id' => $laporan->id,
            'pesan' => 'Laporan baru dari warga di ' . $laporan->nama_lokasi,
            'is_read' => false,
            'perlu_tindakan' => true,
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'nomor_referensi' => 'LPR-' . str_pad($laporan->id, 6, '0', STR_PAD_LEFT),
        ], 201);
    }

    public function storeByAI(Request $request): JsonResponse
    {
        if ($request->header('X-AI-Key') !== config('app.ai_api_key')) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $validated = $request->validate([
            'kamera_id' => ['required', 'exists:kamera,id'],
            'nama_lokasi' => ['required', 'string'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'foto_path' => ['required', 'string'],
            'jenis_aktivitas' => ['required', Rule::in(['berjualan', 'mengamen', 'mengemis', 'figuran'])],
            'jumlah_anak' => ['required', 'integer', 'min:1'],
            'hasil_klasifikasi' => ['required', 'string'],
            'confidence_score' => ['required', 'numeric', 'min:0', 'max:1'],
            'bounding_box' => ['nullable', 'array'],
        ]);

        $laporan = Laporan::create([
            'sumber' => 'ai_cctv',
            'kamera_id' => $validated['kamera_id'],
            'nama_lokasi' => $validated['nama_lokasi'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'waktu_kejadian' => now(),
            'foto_path' => $validated['foto_path'],
            'jenis_aktivitas' => $validated['jenis_aktivitas'],
            'jumlah_anak' => $validated['jumlah_anak'],
            'status' => 'menunggu_verifikasi',
        ]);

        \App\Models\DeteksiCctv::create([
            'laporan_id' => $laporan->id,
            'kamera_id' => $validated['kamera_id'],
            'hasil_klasifikasi' => $validated['hasil_klasifikasi'],
            'confidence_score' => $validated['confidence_score'],
            'bounding_box' => $validated['bounding_box'] ?? null,
        ]);

        Notifikasi::create([
            'laporan_id' => $laporan->id,
            'pesan' => 'Deteksi AI di ' . $laporan->nama_lokasi,
            'is_read' => false,
            'perlu_tindakan' => true,
        ]);

        return response()->json(['message' => 'Deteksi berhasil diterima.'], 201);
    }

    public function storeManual(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_lokasi' => ['required', 'string'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'deskripsi' => ['nullable', 'string'],
            'foto' => ['nullable', 'image', 'max:5120'],
            'jenis_aktivitas' => ['required', Rule::in(['berjualan', 'mengamen', 'mengemis', 'figuran'])],
            'jumlah_anak' => ['required', 'integer', 'min:1'],
            'is_darurat' => ['boolean'],
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('laporan', 'public');
        }

        $laporan = Laporan::create([
            'sumber' => 'warga',
            'nama_lokasi' => $validated['nama_lokasi'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'waktu_kejadian' => now(),
            'deskripsi' => $validated['deskripsi'] ?? null,
            'foto_path' => $fotoPath,
            'jenis_aktivitas' => $validated['jenis_aktivitas'],
            'jumlah_anak' => $validated['jumlah_anak'],
            'is_darurat' => $validated['is_darurat'] ?? false,
            'status' => 'menunggu_verifikasi',
        ]);

        Notifikasi::create([
            'laporan_id' => $laporan->id,
            'pesan' => 'Laporan manual oleh admin di ' . $laporan->nama_lokasi,
            'is_read' => false,
            'perlu_tindakan' => true,
        ]);

        return response()->json([
            'message' => 'Laporan manual berhasil ditambahkan.',
            'laporan_id' => $laporan->id,
        ], 201);
    }

    public function verifikasi(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'keputusan' => ['required', Rule::in(['terverifikasi', 'tidak_valid'])],
        ]);

        $laporan = Laporan::where('status', 'menunggu_verifikasi')->findOrFail($id);

        if ($validated['keputusan'] === 'tidak_valid') {
            if ($laporan->foto_path) {
                Storage::disk('public')->delete($laporan->foto_path);
            }
            $laporan->update([
                'status' => 'tidak_valid',
                'diverifikasi_oleh' => $request->user()->id,
                'diverifikasi_at' => now(),
            ]);
        } else {
            $laporan->update([
                'status' => 'terverifikasi',
                'diverifikasi_oleh' => $request->user()->id,
                'diverifikasi_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Laporan berhasil diverifikasi.']);
    }

    public function riwayatSaya(Request $request): JsonResponse
    {
        $laporan = Laporan::where('identitas_pelapor', $request->user()->email)
            ->select('id', 'nama_lokasi', 'jenis_aktivitas', 'jumlah_anak', 'status', 'waktu_kejadian', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->nomor_referensi = 'LPR-' . str_pad($item->id, 6, '0', STR_PAD_LEFT);
                return $item;
            });

        return response()->json($laporan);
    }
}