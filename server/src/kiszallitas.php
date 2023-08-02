<?php

function kiszallitas() {
    auth();
    $pdo = getConnection();
    $query = "SELECT * 
                FROM delivery_costs 
                ORDER BY price_from ASC";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function ujKiszallitasiKoltseg($vars, $body) {
    //auth();
    $pdo = getConnection();
    $insert = "INSERT INTO delivery_costs (price_from, price_to, cash_on_delivery_price, forward_paying_price) VALUES (?, ?, ?, ?)";
    $statement = $pdo->prepare($insert);
    $statement->execute([
        (int)$body["deliveryCost"]['priceFrom'],
        (int)$body["deliveryCost"]['priceTo'],
        (int)$body["deliveryCost"]['cashOnDeliveryPrice'],
        (int)$body["deliveryCost"]['forwardPayingPrice']
    ]);
    $id = $pdo->lastInsertId();
    echo json_encode(["msg" => "Az új kiszállítási költség sikeresen mentésre került '".$id."'-s azonosítóval."]);
}

function kiszallitasiKoltsegTorlese($vars) {
    auth();
    $pdo = getConnection();
    $delete = "DELETE FROM delivery_costs WHERE id_delivery_costs = ?";
    $statement = $pdo->prepare($delete);
    $statement->execute([$vars['id']]);
    if (!$statement->rowCount()) {
        http_response_code(404);
        $error = ["error" => "A '".$vars['id']."' azonosítójú kiszállítási költség törlése nem lehetséges."];
        echo json_encode($error);
        return;
    }
    echo json_encode(["msg" => "A '".$vars['id']."' azonosítójú kiszállítási költség törlésre került."]);
}

function kiszallitasStatuszModositas($vars, $body) {
    auth();
    $pdo = getConnection();
    $update = "UPDATE deliveries SET status = ? WHERE id_deliveries = ?";
    $statement = $pdo->prepare($update);
    $statement->execute([$body['status'], $vars['id']]);
    if (!$statement->rowCount()) {
        http_response_code(404);
        $error = ["error" => "A '".$vars['id']."' azonosítójú kiszállítási státusz módosítása nem lehetséges."];
        echo json_encode($error);
        return;
    }
    echo json_encode(["msg" => "A '".$vars['id']."' azonosítójú kiszállítás státusza módosításra került '".$body['status']."' értékkel."]);
}

?>