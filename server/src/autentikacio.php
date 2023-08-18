<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function login($vars, $body) {
    
    if (!isUserValid($body)) {
        http_response_code(401);
        echo json_encode(['error' => 'helytelen belépési adatok']);
        return;
    }
    
    //1, Access token kigenerálása és elküldése
    $accessToken = JWT::encode(
        //Szállítmány (payload),
        [
            "iat" => time(), //issued at
            "exp" => time() + 60 * 60 * 24,
            "username" => "admin" //lehetőség van egyénileg választott kulcsra is
        ],
        //Titkos kulcs (token secret), ami a validáláshoz lesz szükséges
        $_SERVER['JWT_TOKEN_SECRET'],
        'HS256'
    );

    echo json_encode(["accessToken" => $accessToken]);
    //echo json_encode(["accessToken" => "soma"]);
/* 
    //2, Refresh token
    $refreshToken = JWT::encode(
        //Szállítmány (payload),
        [
            "iat" => time(), //issued at
            "exp" => time() + 60 * 60 * 24 * 30,
            "username" => "felhasznaloegyediazonosito" //lehetőség van egyénileg választott kulcsra is
        ],
        //Titkos kulcs (token secret), ami a validáláshoz lesz szükséges
        $_SERVER['JWT_TOKEN_SECRET'],
        'HS256'
    );

    setcookie('bkesRefreshToken', $refreshToken, [
        'expires' => time() + 60 * 60 * 24 * 30,
        'path' => "/",
        'httponly' => true,
        'secure' => true,
        'samesite' => 'None', //csak fejlesztési célokkal none, amúgy Lax 
    ]);
 
    
    */
    
}

function isUserValid($body)
{
    return $body['username'] === "admin" && $body['password'] === "bozi2023";
}

function auth() {
    $accessToken = getTokenFromHeaderOrSendErrorResponse();
    $decoded = decodeJwtOrSendErrorResponse($accessToken);
}

function getNewAccessToken() 
{
    $decoded = decodeJwtOrSendErrorResponse($_COOKIE['bkesRefreshToken']);
    $accessToken = JWT::encode(
        //Szállítmány (payload),
        [
            "iat" => time(), //issued at
            "exp" => time() + 15,
            "username" => $decoded['username'] //lehetőség van egyénileg választott kulcsra is
        ],
        //Titkos kulcs (token secret), ami a validáláshoz lesz szükséges
        $_SERVER['JWT_TOKEN_SECRET'],
        'HS256'
    );

    header('Content-type: application/json');

}

function logout() {
    //Refresh token törlése - sütit beállítjuk egy múltbéli időpontra
    setcookie('bkesRefreshToken', false, [
        'expires' => 1,
        'path' => "/",
        'httponly' => true,
        'secure' => true,
        'samesite' => 'Lax', //csak fejlesztési célokkal none, amúgy Lax 
    ]);
}

function getTokenFromHeaderOrSendErrorResponse() {
    $headers = getallheaders();
    /* $isFound = preg_match(
        '/Bearer\s(\S+)/',
        $headers['Authorization'] ?? '',
        $matches
    ); */
    /* $isFound = preg_match(
        '/accessToken\s(\S+)/',
        $headers['Cookie'] ?? '',
        $matches
    );
    if (!$isFound) {
        http_response_code(401);
        echo json_encode(['error' => 'unauthorized']);
        exit;
    }
    return $matches[1]; */
    
    //return substr($headers['Authorization'], 12);
    return $headers['Authorization'];
}

function decodeJwtOrSendErrorResponse($token) {
    try {
        $decoded = JWT::decode(
            $token ?? '', 
            new Key(
                $_SERVER['JWT_TOKEN_SECRET'],
                'HS256'
            )
        );
        return (array)$decoded;

    } catch(\Firebase\JWT\ExpiredException $e) {
        http_response_code(401);
        header('Content-type: application/json');
        echo json_encode(['error' => 'token expired']);
        exit;

    } catch(Exception $exception) {
        http_response_code(401);
        header('Content-type: application/json');
        echo json_encode(['error' => 'validation failed']);
        exit;
    }
    
}

?>
