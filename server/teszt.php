<?php

require __DIR__.'./vendor/autoload.php';

use Firebase\JWT\JWT;

$accessToken = JWT::encode(
    //Szállítmány (payload),
    [
        "iat" => time(), //issued at
        "exp" => time() + 15,
        "sub" => "felhasznaloegyediazonosito", //lehetőség van egyénileg választott kulcsra is
    ],
    //Titkos kulcs (token secret), ami a validáláshoz lesz szükséges
    $_SERVER['JWT_TOKEN_SECRET'],
    'HS256'
);

echo $accessToken;
exit;
    
?>