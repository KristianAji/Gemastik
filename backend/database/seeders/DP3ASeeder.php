<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DP3ASeeder extends Seeder
{
  
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@dp3a.go.id'], // dijadikan patokan supaya tidak double kalau seeder dijalankan ulang
            [
                'name'        => 'Admin DP3A',
                'password'    => 'password123', // WAJIB diganti setelah login pertama
                'role'        => 'admin',
                'status_akun' => 'aktif',
                'no_telepon'  => null,
            ]
        );
    }
}