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
    $title = $body["newsLetter"]['title'] ?? "";
    $mail_body = $body["newsLetter"]['body'] ?? "";
    $sendDate = $body["newsLetter"]['sendDate'] ?? "";

    if ($title !== "" && $mail_body !== "" && $sendDate !== "") {
        $pdo = getConnection();
        $saved = 0;
        $not_saved = 0;
        if ($addresses = getEmailAddresses()) {
            for ($i = 0; $i < count($addresses); $i++) {
                $insert = "INSERT INTO newsletters (title, body, sendDate, status, address) VALUES (?, ?, ?, ?, ?)";
                $statement = $pdo->prepare($insert);
                $statement->execute([
                    $title,
                    $mail_body,
                    $sendDate,
                    'UNSENT',
                    $addresses[$i]["email"]
                ]);
                if ($pdo->lastInsertId()) {
                    $saved++;
                } else {
                    $not_saved++;
                }
            }
            echo json_encode(["msg" => "A hirlevél sikeresen mentésre került {$saved} alkalommal. {$not_saved} alkalommal sikertelen volt a mentés."]);
            return;
        }
        http_response_code(404);
        echo json_encode(["msg" => "Hiba. Nincsenek email címek."]);
        return;
    }
    http_response_code(404);
    echo json_encode(["msg" => "Hiba. A mentés sikertelen a megfelelő adatok hiányában."]);
}

function getEmailAddresses($onlyNewsletterTrue = true) {
    /* $pdo = getConnection();
    if ($onlyNewsletterTrue) {
        $query = "SELECT DISTINCT email FROM customers WHERE newsletter = 1";
    } else {
        $query = "SELECT DISTINCT email FROM customers";
    }
    $statement = $pdo->prepare($query);
    $statement->execute([]);
    if ($statement->rowCount() > 0) {
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    return false; */


    /* TESZTHEZ */
    $test_addresses = [
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "support@hrcpayouts.com"],
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "tamas.somloi@gmail.com"],
        ["email" => "tamas.somloi@gmail.com"]
    ];
    return $test_addresses;
}

?>