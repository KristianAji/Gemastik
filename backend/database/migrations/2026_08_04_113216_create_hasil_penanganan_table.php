<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hasil_penanganan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penugasan_id')->constrained('penugasan');
            $table->enum('status_akhir', ['berhasil_ditangani', 'dirujuk_dinsos', 'tidak_ditemukan']);
            $table->text('catatan')->nullable();
            $table->string('foto_dokumentasi')->nullable();
            $table->unsignedTinyInteger('lama_di_shelter')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hasil_penanganan');
    }
};