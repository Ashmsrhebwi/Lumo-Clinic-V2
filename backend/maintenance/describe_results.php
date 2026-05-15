<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'gravity_clinic_new');
if (!$conn) die("Connection failed: " . mysqli_connect_error());
$res = mysqli_query($conn, "DESCRIBE results");
while ($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . "\n";
}
mysqli_close($conn);
