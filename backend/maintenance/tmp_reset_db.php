<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    $pdo->exec('DROP DATABASE IF EXISTS Lumo_clinic_new');
    echo "Dropped database Lumo_clinic_new successfully.\n";
    $pdo->exec('CREATE DATABASE Lumo_clinic_new');
    echo "Created database Lumo_clinic_new successfully.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
