<?php

function hirlevel() {
    $custom = [
        "name" => "Soma",
        "title" => "hirlevel",
        "age" => 38
    ];
    echo json_encode($custom);
}

function hirlevelMentese($vars, $body) {
    auth();
    $pdo = getConnection();
    $insert = "INSERT INTO newsletters (title, body, sendDate) VALUES (?, ?, ?)";
    $statement = $pdo->prepare($insert);
    $statement->execute([
        $body["newsLetter"]['title'],
        $body["newsLetter"]['body'],
        $body["newsLetter"]['sendDate']
    ]);
    $id = $pdo->lastInsertId();
    echo json_encode(["msg" => "A hirlevél sikeresen mentésre került '".$id."'-s azonosítóval."]);
}

?>