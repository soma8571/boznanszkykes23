<?php

function vasarlok() {
    auth();
    $pdo = getConnection();
    $query = "SELECT name, email, id_customers AS id 
                FROM customers 
                ORDER BY name ASC";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function vasarloAdatok($vars) {
    auth();
    $pdo = getConnection();
    $query = "SELECT email, phone, pa.post_code, pa.settlement, pa.street, pa. details, ba.post_code AS bill_post_code, ba.settlement AS bill_settlement, ba.street AS bill_street, ba.details AS bill_details, ba.bill_name
                FROM customers c
                    LEFT JOIN post_addresses pa ON c.   post_addresses_idpost_addresses = pa.id_post_addresses
                    LEFT JOIN bill_addresses ba ON c.bill_addresses_idbill_addresses = ba.id_bill_addresses
                WHERE id_customers = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $customer_data = $statement->fetchAll(PDO::FETCH_ASSOC);

    //Rendelési adatok lekérése
    $query = "SELECT o.date, k.name, o.quantity, o.price 
                FROM orders o
                JOIN knives k ON o.knives_id_knives = k.id_knives
                WHERE o.customers_id_customers = ?
                ORDER BY o.date DESC";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $order_data = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    $all_data = [
                0 => $customer_data, 
                1 => $order_data
                ];
    echo json_encode($all_data, JSON_PRETTY_PRINT);
}

?>