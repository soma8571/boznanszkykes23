<?php

function felhivas() {
    auth();
    $pdo = getConnection();
    $query = "SELECT *
                FROM appeals 
                ORDER BY start_date ASC";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function ujFelhivas($vars, $body) {
    auth();
    $pdo = getConnection();
    $insert = "INSERT INTO appeals (start_date, end_date, title, body) VALUES (?, ?, ?, ?)";
    $statement = $pdo->prepare($insert);
    $statement->execute([
        $body["appeal"]['startDate'],
        $body["appeal"]['endDate'],
        $body["appeal"]['title'],
        $body["appeal"]['body']
    ]);
    $id = $pdo->lastInsertId();
    echo json_encode(["msg" => "Az új felhívás sikeresen mentésre került '".$id."'-s azonosítóval."]);
}

function felhivasTorlese($vars) {
    auth();
    $pdo = getConnection();
    $delete = "DELETE FROM appeals WHERE id_appeals = ?";
    $statement = $pdo->prepare($delete);
    $statement->execute([$vars['id']]);
    if (!$statement->rowCount()) {
        http_response_code(404);
        $error = ["error" => "A '".$vars['id']."' azonosítójú felhívás törlése nem lehetséges."];
        echo json_encode($error);
        return;
    }
    echo json_encode(["msg" => "A '".$vars['id']."' azonosítójú felhívás törlésre került."]);
}

?>