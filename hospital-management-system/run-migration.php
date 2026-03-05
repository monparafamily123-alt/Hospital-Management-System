<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as DB;

// Create the doctors table with correct schema
DB::statement("
    CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        department_id INT NOT NULL,
        experience VARCHAR(255) NULL,
        available_time VARCHAR(255) NULL,
        qualification VARCHAR(255) NULL,
        consultation_fee DECIMAL(10,2) DEFAULT 0.00,
        specialization VARCHAR(255) NULL,
        bio TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
    )
");

echo "Doctors table created successfully!\n";
