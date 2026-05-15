<?php

$host = '127.0.0.1';
$port = '3306';
$user = 'root';
$pass = '';
$dbname = 'gravity_clinic_new';

try {
    // Connect to MySQL without a database
    $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Forcefully dropping database '$dbname' to clear InnoDB corruption...\n";
    $pdo->exec("DROP DATABASE IF EXISTS `$dbname` ");
    echo "Database dropped successfully.\n";

    echo "Recreating database '$dbname'...\n";
    $pdo->exec("CREATE DATABASE `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database created successfully.\n";

} catch (PDOException $e) {
    die("ERROR: " . $e->getMessage() . "\n");
}
