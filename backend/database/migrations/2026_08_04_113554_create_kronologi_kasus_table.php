<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kronologi_kasus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->constrained('laporan');
            $table->foreignId('dicatat_oleh')->constrained('users');
            $table->text('catatan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kronologi_kasus');
    }
};