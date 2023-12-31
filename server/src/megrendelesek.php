<?php

function megrendelesek() {
    auth();
    $pdo = getConnection();
    $query = "SELECT d.id_deliveries, d.status, o.date, d.modify_date, k.name as kname, c.name AS cname
                FROM deliveries d 
                    INNER JOIN orders o 
                        ON o.deliveries_id_deliveries = d.id_deliveries
                    INNER JOIN knives k
                        ON o.knives_id_knives = k.id_knives
                    INNER JOIN customers c
                        ON o.customers_id_customers = c.id_customers
                    WHERE d.status = 'PENDING'
                    GROUP BY d.id_deliveries
                    ORDER BY o.date ASC";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data_pending = $statement->fetchAll(PDO::FETCH_ASSOC);

    //legutóbbi 20 teljesült megrendelés lekérése
    $query = "SELECT d.id_deliveries, d.status, o.date, d.modify_date, k.name as kname, c.name AS cname
                FROM deliveries d 
                    INNER JOIN orders o 
                        ON o.deliveries_id_deliveries = d.id_deliveries
                    INNER JOIN knives k
                        ON o.knives_id_knives = k.id_knives
                    INNER JOIN customers c
                        ON o.customers_id_customers = c.id_customers
                    WHERE d.status = 'COMPLETED'
                    ORDER BY o.date DESC
                    LIMIT 20";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data_completed = $statement->fetchAll(PDO::FETCH_ASSOC);

    /* $all_data = [
        0 => $data_pending,
        1 => $data_completed
        ]; */
    $all_data = array_merge($data_pending, $data_completed);
    echo json_encode($all_data, JSON_PRETTY_PRINT);
}

function megrendelesAdatok($vars) {
    auth();
    $pdo = getConnection();
    $query = "SELECT k.name AS kname, k.blade_material, k.description, o.*, d.*
                FROM orders o
                    INNER JOIN knives k ON o.knives_id_knives = k.id_knives  
                    INNER JOIN deliveries d ON o.deliveries_id_deliveries = d.id_deliveries
                WHERE o.deliveries_id_deliveries = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $order_data = $statement->fetchAll(PDO::FETCH_ASSOC);

    $query = "SELECT DISTINCT c.name AS cname, c.phone, c.email, pa.post_code, pa.settlement, pa.street, pa.post_number, ba.post_code AS bill_post_code, ba.settlement AS bill_settlement, ba.street AS bill_street, ba.details AS bill_details, bill_name, tax_number
                FROM orders o 
                    INNER JOIN customers c ON o.customers_id_customers = c.id_customers 
                    INNER JOIN deliveries d ON o.deliveries_id_deliveries = d.id_deliveries
                    INNER JOIN post_addresses pa ON c.post_addresses_idpost_addresses = pa.id_post_addresses 
                    LEFT JOIN bill_addresses ba ON c.bill_addresses_idbill_addresses = ba.id_bill_addresses
                WHERE o.deliveries_id_deliveries = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $customer_data = $statement->fetchAll(PDO::FETCH_ASSOC);
    $all_data = [
                0 => $order_data,
                1 => $customer_data
                ];
    echo json_encode($all_data, JSON_PRETTY_PRINT);
}

?>