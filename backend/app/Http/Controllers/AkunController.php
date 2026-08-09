<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class AkunController extends Controller
{
    public function index(): JsonResponse
    {
        $akun = User::whereIn('role', ['dinsos', 'satpol', 'public'])
            ->select('id', 'name', 'email', 'role', 'status_akun', 'no_telepon', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($akun);
    }

    public function konfirmasi(string $id): JsonResponse
    {
        $user = User::whereIn('role', ['dinsos', 'satpol', 'public'])
            ->where('id', $id)
            ->where('status_akun', 'butuh_verifikasi')
            ->firstOrFail();

        $user->update(['status_akun' => 'aktif']);

        return response()->json(['message' => 'Akun berhasil dikonfirmasi.']);
    }

    public function nonaktifkan(string $id): JsonResponse
    {
        $user = User::whereIn('role', ['dinsos', 'satpol', 'public'])
            ->where('id', $id)
            ->where('status_akun', 'aktif')
            ->firstOrFail();

        $user->update(['status_akun' => 'nonaktif']);

        return response()->json(['message' => 'Akun berhasil dinonaktifkan.']);
    }

    public function aktifkan(string $id): JsonResponse
    {
        $user = User::whereIn('role', ['dinsos', 'satpol', 'public'])
            ->where('id', $id)
            ->where('status_akun', 'nonaktif')
            ->firstOrFail();

        $user->update(['status_akun' => 'aktif']);

        return response()->json(['message' => 'Akun berhasil diaktifkan.']);
    }
}
