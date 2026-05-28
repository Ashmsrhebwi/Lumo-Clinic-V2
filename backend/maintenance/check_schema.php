<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'Lumo_clinic_new');
$res = mysqli_query($conn, "DESCRIBE results");
while($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}
mysqli_close($conn);
