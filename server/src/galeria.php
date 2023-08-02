<?php

function galeriaKepek() {
    auth();
    $pdo = getConnection();
    $query = "SELECT *
                FROM gallery";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    for ($i=0; $i < count($data); $i++) {
        foreach ($data[$i] as $key => $value) {
            //var_dump($key);
           if ($key === "img_path") {
                $temp = explode("/", $value);
                $temp2 = explode(".", $temp[1]);
                $fn = $temp2[0]."_tn.".$temp2[1];
                $data[$i][$key] = $fn;
           }
                
    
            
            // Ellenőrizzük, hogy a fájl létezik-e
            
    
            /* if (file_exists($filename)) {
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
            //var_dump($filename);*/
        }
    }
    
    echo json_encode($data);
    //var_dump($data);
}

function lathatosagModositas($vars, $body) {
    auth();
    $pdo = getConnection();
    $update = "UPDATE gallery SET img_visibility = ? WHERE id_gallery = ?";
    $statement = $pdo->prepare($update);
    $statement->execute([$body['visibility'], $vars['id']]);
    if (!$statement->rowCount()) {
        http_response_code(404);
        $error = ["error" => "A '".$vars['id']."' azonosítójú kép módosítása nem lehetséges."];
        echo json_encode($error);
        return;
    }
    $visibility = $body['visibility'] == 1 ? "látható" : "elrejtett";
    echo json_encode(["msg" => "A '".$vars['id']."' azonosítójú galéria kép láthatósága módosításra került '".$visibility."' értékre."]);
}

?>