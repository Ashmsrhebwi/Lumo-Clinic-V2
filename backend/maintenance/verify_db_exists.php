<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'Lumo_clinic_new';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $dbs = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Existing Databases:\n";
    foreach ($dbs as $db) {
        echo " - $db\n";
    }
    
    if (in_array($dbname, $dbs)) {
        echo "\nSUCCESS: '$dbname' exists.\n";
    } else {
        echo "\nFAILURE: '$dbname' does NOT exist.\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
