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
    auth();
    $pdo = getConnection();
    $query = "SELECT idproduct_images as id, thumbnail_path, profil, knives_id 
                FROM product_images
                WHERE knives_id = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function termekProfilThumbnail($vars) {
    $pdo = getConnection();
    $query = "SELECT thumbnail_path 
                FROM product_images
                WHERE knives_id = ? AND profil = 1";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);

    if ($_SERVER['SERVER_NAME'] !== "localhost") {
        $root = "/web/boznanszkyk/boznanszkykes.hu/";
    } else {
        $root = "./";
    }
    
    foreach ($data as $value) {
        // Ellenőrizzük, hogy a fájl létezik-e
        $filename = $root . $value["thumbnail_path"];
        if (file_exists($filename)) {
            // Beállítjuk a HTTP fejléceket a megfelelő képtípusra
            header('Content-Type: image/jpeg');
            header('Content-Length: ' . filesize($filename));

            // Elküldjük a képet a válaszban
            readfile($filename);
        } else {
            // Ha a fájl nem létezik, akkor hibaüzenetet adunk vissza
            //http_response_code(404);
            //echo 'A képfájl nem található.';
            echo json_encode(["msg" => "A képfájl nem található. ".$filename]);
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
    $insert = "INSERT INTO knives (name, full_length, blade_length, blade_width, blade_material, handle_material, hardness, price, type, available, type_subcategory, hide_if_sold_out, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        $body["newSale"]["deadline"] . " 23:59:59",
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

//Galéria kép feltöltésekor is ez hívodik, csak akkor 0-ás ID-val
function kepfeltoltes($vars, $body) {
    $id = $vars['id'];

    if ($_SERVER['SERVER_NAME'] !== "localhost") {
        $root = "/web/boznanszkyk/boznanszkykes.hu/";
    } else {
        $root = "";
    }

    if ($id == 0) {
        //galéria képről van szó
        $path = "assets/gallery/"; 
        $tn_path = "assets/gallery/thumbnails/";
    } else {
        //termékkép
        $path = "assets/product_pictures/";
        $tn_path = "assets/product_pictures/thumbnails/";
    } 

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
        $tmp_name = $_FILES['file']['tmp_name'];
        $fname = $_FILES['file']['name'];

        if (isValidImage($tmp_name)) {
            //'productXXX_randstrg.jpg' formátum, ahol XXX a termék azonosítója, randstrg pedig 8 karakteres generált string
            $store_fname = createImageName($id, $fname);

            if (move_uploaded_file($tmp_name, $root . $path.$store_fname)) {

                //Thumbnail létrehozás
                require __DIR__."/imagehandler.php";
                $img = new Image();
                $source_path = $path.$store_fname;
                $thumbnail_fname = createThumbnailName($store_fname);
                $dest_path = $tn_path.$thumbnail_fname;
                $img->createThumbnail_16_9($root . $source_path, $root . $dest_path, 240, 135);

                //Adatbázis mentés
                $pdo = getConnection();
                if (!$id) {
                    //Galéria képet mentünk
                    $insert = "INSERT INTO gallery (img_path, thumbnail_path, img_description, img_visibility) VALUES (?, ?, ?, ?)";
                    $statement = $pdo->prepare($insert);
                    $statement->execute([
                        $source_path,
                        $dest_path,
                        $_POST["comment"],
                        1
                    ]);

                    if ($statement->rowCount() > 0) {
                        echo json_encode(['success' => true, 'message' => 'A fájl letárolva: '.$store_fname." néven."]);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Hiba a kép letárolása során.']);
                    }

                } else {
                    //Termék képet mentünk
                    //ha a termékhez még nem tartozik képfájl a product_image táblában akkor az aktuális feltöltés profilkép lesz, ellenkező esetben nem
                    $query = "SELECT image_path 
                                FROM product_images 
                                WHERE knives_id = ?";
                    $statement = $pdo->prepare($query);
                    $statement->execute([$vars['id']]);
                    if ($statement->rowCount() > 0) $profil = 0;
                    else $profil = 1;

                    $insert = "INSERT INTO product_images (image_path, thumbnail_path, profil, knives_id) VALUES (?, ?, ?, ?)";
                    $statement = $pdo->prepare($insert);
                    $statement->execute([$source_path, $dest_path, $profil, $vars['id']]);
                }

                echo json_encode(['success' => true, 'message' => 'A fájl letárolva: '.$store_fname." néven."]);
                
            } else {
                echo json_encode(['success' => false, 'message' => 'Hiba a kép letárolása során.']);
            }

           
        } else {
            echo json_encode(['success' => false, 'message' => 'A fájl nem megfelelő formátumú.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Érvénytelen kérés']);
    }

}

function isValidImage($filename) {
    if (exif_imagetype($filename) == IMAGETYPE_GIF ||
		exif_imagetype($filename) == IMAGETYPE_JPEG ||
		exif_imagetype($filename) == IMAGETYPE_PNG ||
		exif_imagetype($filename) == IMAGETYPE_GIF) 
    return true;
    else return false;
}

function createImageName($product_id, $tmp_name) {
    if ((int)$product_id !== 0) {
        $temp = explode(".", strtolower($tmp_name));
        $ext = end($temp);
        $randomStr = generateRandomString(8);
        return "product".$product_id."_".$randomStr.".".$ext;
    } else {
        $temp = explode(".", strtolower($tmp_name));
        $ext = end($temp);
        $randomStr = generateRandomString(8);
        return "gallery_".$randomStr.".".$ext;
    }
    
}

function createThumbnailName($filename) {
    $temp = explode(".", $filename);
	$ext = end($temp);
    return $temp[0]."_tn.".$ext;
}

//Termék képének törlése
function termekKepTorlese($vars) {
    auth();
    //0. lépés: adatbázisból megszerezni az ID-hoz tartozó kép elérési útvonalakat
    $pdo = getConnection();
    $query = "SELECT image_path, thumbnail_path 
                FROM product_images 
                WHERE idproduct_images = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);

    if ($_SERVER['SERVER_NAME'] !== "localhost") {
        $root = "/web/boznanszkyk/boznanszkykes.hu/";
    } else {
        $root = "./";
    }
    
    $thumbnail_path = $root . $data[0]["thumbnail_path"];
    $image_path = $root . $data[0]["image_path"];
    $errors = [];

    if (file_exists($image_path)) {
        if (!unlink($image_path)) 
            array_push($errors, "A képfájl törlése meghiúsult.");
    } else 
        //a fájl nem létezik
        array_push($errors, "A képfájl nem érhető el.");
    
    if (file_exists($thumbnail_path)) {
        if (!unlink($thumbnail_path)) 
            array_push($errors, "A thumbnail törlése meghiúsult.");
    } else 
        //a fájl nem létezik
        array_push($errors, "A thumbnail nem érhető el.");
    
    //Ha eddig nincs hiba
    //2, Adatbázisból is törölni kell a termékhez tartozó képet és thumbnailt
    if (count($errors) === 0) {
        $delete = "DELETE FROM product_images WHERE idproduct_images = ?";
        $statement = $pdo->prepare($delete);
        $statement->execute([$vars['id']]);
        if ($statement->rowCount() > 0)
            echo json_encode(["msg" => "A kép törlése sikeres volt."]);
        else
            echo json_encode(["msg" => "A kép törlésre került a fájlrendszerből, az adatbázis törlés viszont nem járt sikerrel."]);

    } else echo json_encode($errors);
}

//Termék Profilképének módosítása
function termekProfilModositas($vars, $body) {
    auth();
    //1. a termékhez tartozó összes képnél 0-ra állítjuk a profil mezőt
    $update1 = "UPDATE product_images 
                    SET profil = 0 WHERE knives_id = ?";
    $pdo = getConnection();
    $statement = $pdo->prepare($update1);
    $statement->execute([$body['productId']]);

    //2. a választott képre (vars[id] tartalmazza) updatelni a profil mezőt
    $update2 = "UPDATE product_images 
                    SET profil = 1 WHERE idproduct_images = ?";
    $statement = $pdo->prepare($update2);
    $statement->execute([$vars['id']]);
    if ($statement->rowCount() > 0)
        echo json_encode(["msg" => "A profilkép sikeresen módosításra került."]);
    else
        echo json_encode(["msg" => "Nem történt módosítás a profilképben."]);
}

?>