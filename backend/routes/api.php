<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AkunController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PenugasanController;
use App\Http\Controllers\HasilPenangananController;
use App\Http\Controllers\KronologiKasusController;
use App\Http\Controllers\StatistikController;
use App\Http\Controllers\NotifikasiController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/laporan/ai', [LaporanController::class, 'storeByAI']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/akun', [AkunController::class, 'index']);
        Route::patch('/akun/{id}/konfirmasi', [AkunController::class, 'konfirmasi']);
        Route::patch('/akun/{id}/nonaktifkan', [AkunController::class, 'nonaktifkan']);
        Route::patch('/akun/{id}/aktifkan', [AkunController::class, 'aktifkan']);

        Route::get('/laporan', [LaporanController::class, 'index']);
        Route::get('/laporan/{id}', [LaporanController::class, 'show']);
        Route::post('/laporan/manual', [LaporanController::class, 'storeManual']);
        Route::patch('/laporan/{id}/verifikasi', [LaporanController::class, 'verifikasi']);

        Route::get('/penugasan', [PenugasanController::class, 'index']);
        Route::post('/penugasan', [PenugasanController::class, 'store']);

        Route::get('/statistik', [StatistikController::class, 'index']);

        Route::get('/notifikasi', [NotifikasiController::class, 'index']);
        Route::patch('/notifikasi/{id}/baca', [NotifikasiController::class, 'tandaiDibaca']);
        Route::patch('/notifikasi/baca-semua', [NotifikasiController::class, 'tandaiSemuaDibaca']);
    });

    Route::middleware('role:admin,dinsos')->group(function () {
        Route::get('/laporan/{laporanId}/kronologi', [KronologiKasusController::class, 'index']);
        Route::post('/laporan/{laporanId}/kronologi', [KronologiKasusController::class, 'store']);
        Route::get('/export-csv', [StatistikController::class, 'exportCsv']);
    });

    Route::middleware('role:satpol')->group(function () {
        Route::get('/penugasan/aktif', [PenugasanController::class, 'aktif']);
        Route::patch('/penugasan/{id}/status', [PenugasanController::class, 'updateStatus']);
        Route::post('/hasil-penanganan', [HasilPenangananController::class, 'store']);
        Route::get('/hasil-penanganan/riwayat', [HasilPenangananController::class, 'riwayat']);
    });

    Route::middleware('role:public')->group(function () {
        Route::post('/laporan', [LaporanController::class, 'storeByWarga']);
        Route::get('/laporan/riwayat', [LaporanController::class, 'riwayatSaya']);
    });

    Route::middleware('role:admin,dinsos,satpol,public')->group(function () {
    });

});