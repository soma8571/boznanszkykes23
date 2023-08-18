<?php

function galeriaKepek() {
    auth();
    $pdo = getConnection();
    $query = "SELECT *
                FROM gallery";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
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

function galeriaKepTorlese($vars) {
    auth();
    //1. fájl elérési útvonalak lekérése
    $query = "SELECT img_path, thumbnail_path 
                FROM gallery 
                WHERE id_gallery = ?";
    $pdo = getConnection();
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    if ($_SERVER['SERVER_NAME'] !== "localhost") {
        $root = "/web/boznanszkyk/boznanszkykes.hu/";
    } else {
        $root = "./";
    }
    
    //elérési útvonalak meghatározása
    $thumbnail_path = $root . $data[0]["thumbnail_path"];
    $image_path = $root . $data[0]["img_path"];
    $errors = [];

    //törlések megkísérlése
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
        $delete = "DELETE FROM gallery WHERE id_gallery = ?";
        $statement = $pdo->prepare($delete);
        $statement->execute([$vars['id']]);
        if ($statement->rowCount() > 0)
            echo json_encode(["msg" => "A kép törlése sikeres volt."]);
        else
            echo json_encode(["msg" => "A kép törlésre került a fájlrendszerből, az adatbázis törlés viszont nem járt sikerrel."]);

    } else echo json_encode($errors);
}

?>