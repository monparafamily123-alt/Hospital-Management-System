<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DoctorController;

// Admin routes for doctors
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    // Doctors management
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);
    
    // Other admin routes...
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::put('/patients/{patient}', [PatientController::class, 'update']);
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);
});
