<?php

//header('Content-type: application/json');

/* require __DIR__.'./vendor/autoload.php';

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
exit; */

/* $path = "/web/boznanszkyk/boznanszkykes.hu/";

if (file_exists($path."index.php")) {
    echo "test passed".$_SERVER['SERVER_NAME'];
} else {
    echo "test failed";
} */
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = 'example_key';
$payload = [
    'iss' => 'http://example.org',
    'aud' => 'http://example.com',
    'iat' => 1356999524,
    'nbf' => 1357000000
];

/**
 * IMPORTANT:
 * You must specify supported algorithms for your application. See
 * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40
 * for a list of spec-compliant algorithms.
 */
$jwt = JWT::encode($payload, $key, 'HS256');
$decoded = JWT::decode($jwt, new Key($key, 'HS256'));
print_r($decoded);

// Pass a stdClass in as the third parameter to get the decoded header values
$decoded = JWT::decode($jwt, new Key($key, 'HS256'), $headers = new stdClass());
print_r($headers);

/*
 NOTE: This will now be an object instead of an associative array. To get
 an associative array, you will need to cast it as such:
*/

$decoded_array = (array) $decoded;

/**
 * You can add a leeway to account for when there is a clock skew times between
 * the signing and verifying servers. It is recommended that this leeway should
 * not be bigger than a few minutes.
 *
 * Source: http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#nbfDef
 */
JWT::$leeway = 60; // $leeway in seconds
$decoded = JWT::decode($jwt, new Key($key, 'HS256'));




?>