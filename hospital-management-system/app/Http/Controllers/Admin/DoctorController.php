<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    /**
     * Store a newly created doctor.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'department_id' => 'required|exists:departments,id',
                'experience' => 'nullable|string|max:255',
                'available_time' => 'nullable|string|max:255',
                'qualification' => 'nullable|string|max:255',
                'consultation_fee' => 'nullable|numeric|min:0',
                'specialization' => 'nullable|string|max:255',
                'bio' => 'nullable|string'
            ], [
                'department_id.exists' => 'The selected department is invalid.',
                'email.unique' => 'A user with this email already exists.'
            ]);

            // Use database transaction to ensure both records are created or none
            DB::beginTransaction();

            try {
                // Step 1: Create user record
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => 'doctor'
                ]);

                // Step 2: Create doctor record with user_id
                $doctor = Doctor::create([
                    'user_id' => $user->id,
                    'department_id' => $validated['department_id'],
                    'experience' => $validated['experience'] ?? null,
                    'available_time' => $validated['available_time'] ?? null,
                    'qualification' => $validated['qualification'] ?? null,
                    'consultation_fee' => $validated['consultation_fee'] ?? 0.00,
                    'specialization' => $validated['specialization'] ?? null,
                    'bio' => $validated['bio'] ?? null
                ]);

                // Commit the transaction
                DB::commit();

                // Load the complete doctor data with relationships
                $doctor->load(['user', 'department']);

                return response()->json([
                    'success' => true,
                    'message' => 'Doctor created successfully',
                    'data' => $doctor
                ], 201);

            } catch (\Exception $e) {
                // Rollback if any error occurs
                DB::rollBack();
                throw $e;
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Error creating doctor: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified doctor.
     */
    public function update(Request $request, Doctor $doctor)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|' . Rule::unique('users')->ignore($doctor->user_id),
                'department_id' => 'required|exists:departments,id',
                'experience' => 'nullable|string|max:255',
                'available_time' => 'nullable|string|max:255',
                'qualification' => 'nullable|string|max:255',
                'consultation_fee' => 'nullable|numeric|min:0',
                'specialization' => 'nullable|string|max:255',
                'bio' => 'nullable|string'
            ]);

            DB::beginTransaction();

            try {
                // Update user record
                $doctor->user->update([
                    'name' => $validated['name'],
                    'email' => $validated['email']
                ]);

                // Update doctor record
                $doctor->update([
                    'department_id' => $validated['department_id'],
                    'experience' => $validated['experience'] ?? null,
                    'available_time' => $validated['available_time'] ?? null,
                    'qualification' => $validated['qualification'] ?? null,
                    'consultation_fee' => $validated['consultation_fee'] ?? 0.00,
                    'specialization' => $validated['specialization'] ?? null,
                    'bio' => $validated['bio'] ?? null
                ]);

                DB::commit();

                // Load updated data with relationships
                $doctor->load(['user', 'department']);

                return response()->json([
                    'success' => true,
                    'message' => 'Doctor updated successfully',
                    'data' => $doctor
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Error updating doctor: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all doctors with their relationships.
     */
    public function index()
    {
        try {
            $doctors = Doctor::with(['user', 'department'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $doctors
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching doctors: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch doctors'
            ], 500);
        }
    }
}
