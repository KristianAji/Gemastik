<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penugasan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->constrained('laporan');
            $table->foreignId('petugas_id')->constrained('users');
            $table->foreignId('ditugaskan_oleh')->constrained('users');
            $table->enum('status', ['belum', 'diproses', 'selesai'])->default('belum');
            $table->enum('prioritas', ['rendah', 'sedang', 'tinggi'])->default('sedang');
            $table->text('catatan_awal')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penugasan');
    }
};