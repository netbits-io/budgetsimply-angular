<?php

$DB_host = "95.87.217.208";
$DB_port = "5422";
$DB_user = "bills";
$DB_pass = "bills123";
$DB_name = "bills";

try {
    $DB_con = new PDO("pgsql:host={$DB_host};port={$DB_port};dbname={$DB_name}", $DB_user, $DB_pass);
    $DB_con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo $e->getMessage();
}

include_once 'class.crud.php';

$crud = new crud($DB_con);
