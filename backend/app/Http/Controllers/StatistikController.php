<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistikController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $periode = $request->query('periode', 'bulan_ini');

        $query = Laporan::query();

        if ($periode === 'bulan_ini') {
            $query->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year);
        } elseif ($periode === '3_bulan') {
            $query->where('created_at', '>=', now()->subMonths(3));
        } elseif ($periode === 'tahun_ini') {
            $query->whereYear('created_at', now()->year);
        }

        $total = (clone $query)->count();
        $menunggu = (clone $query)->where('status', 'menunggu_verifikasi')->count();
        $terverifikasi = (clone $query)->where('status', 'terverifikasi')->count();
        $ditangani = (clone $query)->where('status', 'ditangani')->count();
        $tidak_valid = (clone $query)->where('status', 'tidak_valid')->count();

        $tingkat_penanganan = $total > 0 ? round(($ditangani / $total) * 100, 1) : 0;

        $per_jenis_aktivitas = (clone $query)
            ->select('jenis_aktivitas', DB::raw('count(*) as total'))
            ->groupBy('jenis_aktivitas')
            ->get();

        $per_lokasi = (clone $query)
            ->select('nama_lokasi', DB::raw('count(*) as total'))
            ->groupBy('nama_lokasi')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $per_sumber = (clone $query)
            ->select('sumber', DB::raw('count(*) as total'))
            ->groupBy('sumber')
            ->get();

        return response()->json([
            'periode' => $periode,
            'ringkasan' => [
                'total' => $total,
                'menunggu_verifikasi' => $menunggu,
                'terverifikasi' => $terverifikasi,
                'ditangani' => $ditangani,
                'tidak_valid' => $tidak_valid,
                'tingkat_penanganan' => $tingkat_penanganan,
            ],
            'per_jenis_aktivitas' => $per_jenis_aktivitas,
            'per_lokasi' => $per_lokasi,
            'per_sumber' => $per_sumber,
        ]);
    }

    public function exportCsv(Request $request)
    {
        $laporan = Laporan::with([
            'verifikator:id,name',
            'penugasan.petugas:id,name',
            'penugasan.hasilPenanganan',
        ])->whereIn('status', ['terverifikasi', 'ditangani'])
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'laporan_delcion_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($laporan) {
            $file = fopen('php://output', 'w');

            fputcsv($file, [
                'ID',
                'Nomor Referensi',
                'Sumber',
                'Nama Lokasi',
                'Jenis Aktivitas',
                'Jumlah Anak',
                'Status',
                'Waktu Kejadian',
                'Diverifikasi Oleh',
                'Petugas Lapangan',
                'Status Penanganan',
                'Catatan Penanganan',
                'Lama di Shelter (hari)',
            ]);

            foreach ($laporan as $item) {
                fputcsv($file, [
                    $item->id,
                    'LPR-' . str_pad($item->id, 6, '0', STR_PAD_LEFT),
                    $item->sumber,
                    $item->nama_lokasi,
                    $item->jenis_aktivitas,
                    $item->jumlah_anak,
                    $item->status,
                    $item->waktu_kejadian,
                    $item->verifikator?->name ?? '-',
                    $item->penugasan?->petugas?->name ?? '-',
                    $item->penugasan?->hasilPenanganan?->status_akhir ?? '-',
                    $item->penugasan?->hasilPenanganan?->catatan ?? '-',
                    $item->penugasan?->hasilPenanganan?->lama_di_shelter ?? '-',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}