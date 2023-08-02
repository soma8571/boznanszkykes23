<?php

function keszlet() {
    auth();
    $pdo = getConnection();
    $query = "SELECT s.*, k.name 
                FROM store s 
                LEFT JOIN knives k ON s.product_id = k.id_knives
                WHERE stock > 0";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

?>