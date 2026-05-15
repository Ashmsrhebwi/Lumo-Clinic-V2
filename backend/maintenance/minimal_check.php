<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'gravity_clinic_new');

$expected = ['dental-implant', 'hollywood-smile', 'male-hair-transplant', 'female-hair-transplant', 'beard-moustache-transplant', 'eyebrow-transplant'];
foreach ($expected as $slug) {
    $r = mysqli_query($conn, "SELECT id FROM treatments WHERE slug='$slug'");
    if (mysqli_num_rows($r) == 0) echo "MISSING_TREATMENT: $slug\n";
    else {
        $row = mysqli_fetch_assoc($r);
        $tid = $row['id'];
        $ni = mysqli_query($conn, "SELECT id, treatment_id FROM navbar_items WHERE treatment_id=$tid");
        if (mysqli_num_rows($ni) == 0) echo "MISSING_NAV_LINK_FOR: $slug (TID: $tid)\n";
        else echo "OK: $slug\n";
    }
}
mysqli_close($conn);
