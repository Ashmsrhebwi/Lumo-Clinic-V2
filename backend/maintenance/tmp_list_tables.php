<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=Lumo_clinic_new', 'root', '');
$stmt = $pdo->query('SHOW TABLES');
$tables = [];
while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
    $tables[] = $row[0];
}
echo implode("\n", $tables) . "\n";
