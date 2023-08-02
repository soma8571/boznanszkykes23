<?php

function termekalkategoriak() {
    auth();
    $pdo = getConnection();
    $query = "SELECT * FROM knives_subcategories"; 
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function termekAdatok($vars) {
    auth();
    $pdo = getConnection();
    $query = "SELECT k.*, s.stock 
                FROM knives k
                LEFT JOIN store s ON k.id_knives = s.product_id
                WHERE id_knives = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function termekKepek($vars) {
    //auth();
    $pdo = getConnection();
    $query = "SELECT thumbnail_path 
                FROM product_images
                WHERE knives_id = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    //echo json_encode($data);
    //$filename = './assets/product_pictures/thumbnails/1psag_iohFXezU_tn.jpg';
    foreach ($data as $value) {
        //var_dump($value["thumbnail_path"]);
        // Ellenőrizzük, hogy a fájl létezik-e
        $filename = "./assets/".$value["thumbnail_path"];
        if (file_exists($filename)) {
            // Beállítjuk a HTTP fejléceket a megfelelő képtípusra
            header('Content-Type: image/jpeg');
            header('Content-Length: ' . filesize($filename));

            // Elküldjük a képet a válaszban
            readfile($filename);
        } else {
            // Ha a fájl nem létezik, akkor hibaüzenetet adunk vissza
            http_response_code(404);
            echo 'A képfájl nem található.';
        }
    }
}

function termekAdatUpdate($vars, $body) {
    auth();
    $pdo = getConnection();
    $update = "UPDATE knives SET 
                    `name` = ?,
                    `full_length` = ?,
                    `blade_length` = ?,
                    `blade_width` = ?,
                    `blade_material` = ?,
                    `handle_material` = ?,
                    `hardness` = ?,
                    `price` = ?,
                    `type` = ?,
                    `available` = ?,
                    `type_subcategory` = ?,
                    `hide_if_sold_out` = ?,
                    `buyable` = ?,
                    `description` = ?
                WHERE id_knives = ?";
    $statement = $pdo->prepare($update);
    $statement->execute([
        $body['productData']['name'], 
        (int)$body['productData']['full_length'], 
        (int)$body['productData']['blade_length'], 
        (float)$body['productData']['blade_width'], 
        $body['productData']['blade_material'], 
        $body['productData']['handle_material'], 
        (int)$body['productData']['hardness'], 
        (int)$body['productData']['price'], 
        $body['productData']['type'], 
        (int)$body['productData']['available'], 
        (int)$body['productData']['type_subcategory'], 
        (int)$body['productData']['hide_if_sold_out'], 
        (int)$body['productData']['buyable'], 
        $body['productData']['description'], 
        $body['productData']['id_knives']
    ]);

    
    if ($statement->rowCount() > 0) {
        $knifeModified = "A termék adatainak mentése sikeres volt.";
    } else {
        $knifeModified = "A termék adataiban nem történt változás.";
    }
    //Készlet update
    //Előszőr meg kell nézni, hogy az adott termék szerepel-e már a store táblában
    $query = "SELECT stock FROM store WHERE product_id = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$body['productData']['id_knives']]);
    
    //ha már szerepel, akkor csak updatelni kell a rekordot
    if ($statement->rowCount() > 0) {
        $update = "UPDATE store 
                    SET stock = ?,
                        last_change_type = ?,
                        last_change_date = NOW()
                    WHERE product_id = ?";
        $statement = $pdo->prepare($update);
        $statement->execute([
            (int)$body['productData']['stock'],
            "Admin módosítás",
            (int)$body['productData']['id_knives']
        ]);
    
    //ha még nem szerepel, akkor új rekordot szúrunk be
    } else {
        $insert = "INSERT INTO store (stock, last_change_type, last_change_date, product_id) VALUES (?, ?, NOW(), ?)";
        $statement = $pdo->prepare($insert);
        $statement->execute([
            (int)$body['productData']['stock'],
            "Admin módosítás",
            (int)$body['productData']['id_knives']
        ]);
    }

    if ($statement->rowCount() > 0) {
        $store_update_msg = "A készletadatok frissítése megtörtént.";
    } else {
        $store_update_msg = "A készletadatokban nem történt változás.";
    }

    echo json_encode(["msg" => $knifeModified." ".$store_update_msg]);
}

function termekSablon() {
    //auth();
    $pdo = getConnection();
    $query = "SELECT * 
                FROM knives
                LIMIT 1";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function ujTermek($vars, $body) {
    auth();
    $pdo = getConnection();
    $insert = "INSERT INTO knives (name, full_length, blade_length, blade_width, blade_material, handle_material, hardness, price, type, available, type_subcategory, hide_if_sold_out, buyable, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $statement = $pdo->prepare($insert);
    $statement->execute([
        $body["newProductData"]["name"],
        (int)$body["newProductData"]["full_length"],
        (int)$body["newProductData"]["blade_length"],
        (float)$body["newProductData"]["blade_width"],
        $body["newProductData"]["blade_material"],
        $body["newProductData"]["handle_material"],
        (int)$body["newProductData"]["hardness"],
        (int)$body["newProductData"]["price"],
        $body["newProductData"]["type"],
        (int)$body["newProductData"]["available"],
        (int)$body["newProductData"]["type_subcategory"],
        (int)$body["newProductData"]["hide_if_sold_out"],
        (int)$body["newProductData"]["buyable"],
        $body["newProductData"]["description"]
    ]);
    $id = $pdo->lastInsertId();
    echo json_encode(["msg" => "Az új termék sikeresen mentésre került '".$id."'-s azonosítóval."]);
}

function termekAkcio($vars) {
    auth();
    $pdo = getConnection();
    $query = "SELECT * 
                FROM on_sale 
                WHERE product_id = ? AND deadline > NOW()"; 
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function termekAkcioMentese($vars, $body) {
    auth();
    $pdo = getConnection();
    $insert = "INSERT INTO on_sale (deadline, sale_percentage, active, product_id, until_in_stock) VALUES (?, ?, ?, ?, ?)"; 
    $statement = $pdo->prepare($insert);
    $statement->execute([
        $body["newSale"]["deadline"],
        (int)$body["newSale"]["sale_percentage"],
        (int)$body["newSale"]["active"],
        (int)$vars['id'],
        (int)$body["newSale"]["until_in_stock"]
    ]);
    if ($statement->rowCount() > 0) {
        echo json_encode(["msg" => "Az akció sikeresen mentésre került."]);
    } else {
        http_response_code(404);
        $error = ["error" => "Hiba. Az akció létrehozása nem sikerült."];
        echo json_encode($error);
        return;
    }
}

function termekAkcioTorlese($vars) {
    auth();
    $pdo = getConnection();
    $delete = "DELETE FROM on_sale WHERE product_id = ?";
    $statement = $pdo->prepare($delete);
    $statement->execute([$vars['id']]);
    if (!$statement->rowCount()) {
        http_response_code(404);
        $error = ["error" => "Az akció törlése nem sikerült."];
        echo json_encode($error);
        return;
    }
    echo json_encode(["msg" => "Az akció törlésre került."]);
    //echo json_encode(["msg" => "okddsad"]);
}

?>