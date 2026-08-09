<?php

namespace App\Http\Controllers;

use App\Models\KronologiKasus;
use App\Models\Laporan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KronologiKasusController extends Controller
{
    public function index(string $laporanId): JsonResponse
    {
        Laporan::findOrFail($laporanId);

        $kronologi = KronologiKasus::with('pencatat:id,name')
            ->where('laporan_id', $laporanId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($kronologi);
    }

    public function store(Request $request, string $laporanId): JsonResponse
    {
        Laporan::findOrFail($laporanId);

        $validated = $request->validate([
            'catatan' => ['required', 'string'],
        ]);

        $kronologi = KronologiKasus::create([
            'laporan_id' => $laporanId,
            'dicatat_oleh' => $request->user()->id,
            'catatan' => $validated['catatan'],
        ]);

        return response()->json([
            'message' => 'Kronologi berhasil ditambahkan.',
            'kronologi_id' => $kronologi->id,
        ], 201);
    }
}