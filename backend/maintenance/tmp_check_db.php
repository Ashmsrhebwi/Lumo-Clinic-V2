<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    $stmt = $pdo->query("SHOW VARIABLES LIKE 'datadir'");
    $row = $stmt->fetch();
    echo "Data dir: " . $row['Value'] . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
