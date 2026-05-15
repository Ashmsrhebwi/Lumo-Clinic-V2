<?php
$host = '127.0.0.1';
$db   = 'gravity_clinic_new';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_MODE_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     echo "Connection Success!\n";
     
     $stmt = $pdo->query("SHOW TABLES LIKE 'migrations'");
     $table = $stmt->fetch();
     echo "Migrations Table Found: " . ($table ? 'YES' : 'NO') . "\n";
     
     $stmt = $pdo->query("SHOW TABLES");
     $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
     echo "All Tables: " . implode(', ', $tables) . "\n";
     
} catch (\PDOException $e) {
     echo "ERROR: " . $e->getMessage() . "\n";
}
