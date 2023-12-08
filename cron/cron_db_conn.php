<?php

function getConnection() {
   try {
       $conn = new PDO(
           "mysql:host=" . $_SERVER['DB_HOST'] . 
           ";dbname=" . $_SERVER['DB_NAME'], 
           $_SERVER['DB_USER'], 
           $_SERVER['DB_PASS']);
       $query = "SET NAMES UTF8";
       $statement = $conn->prepare($query);
       $statement->execute();
       return $conn;

   } catch (PDOException $e) {
       echo json_encode(["DB connection error: " => $e->getMessage()]);
   }
}

?>