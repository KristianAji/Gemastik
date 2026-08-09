<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan', function (Blueprint $table) {
            $table->id();
            $table->enum('sumber', ['ai_cctv', 'warga']);
            $table->foreignId('kamera_id')->nullable()->constrained('kamera')->nullOnDelete();
            $table->string('nama_lokasi');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->timestamp('waktu_kejadian');
            $table->text('deskripsi')->nullable();
            $table->string('foto_path')->nullable();
            $table->enum('jenis_aktivitas', ['berjualan', 'mengamen', 'mengemis', 'figuran']);
            $table->unsignedInteger('jumlah_anak')->default(1);
            $table->boolean('is_darurat')->default(false);
            $table->string('identitas_pelapor')->nullable();
            $table->enum('status', ['menunggu_verifikasi', 'terverifikasi', 'tidak_valid', 'ditangani'])->default('menunggu_verifikasi');
            $table->foreignId('diverifikasi_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('diverifikasi_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan');
    }
};