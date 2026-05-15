<?php

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$newDb = 'gravity_clinic_rebuilt';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Creating new database '$newDb'...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$newDb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "SUCCESS: Database created or already exists.\n";

} catch (Exception $e) {
    die("ERROR: " . $e->getMessage() . "\n");
}
