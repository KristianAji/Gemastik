<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['dp3a', 'dinsos', 'uptd', 'warga'])->after('email');
            $table->enum('status_akun', ['aktif', 'nonaktif', 'butuh_verifikasi'])->default('butuh_verifikasi')->after('role');
            $table->string('no_telepon')->nullable()->after('status_akun');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'status_akun', 'no_telepon']);
        });
    }
};