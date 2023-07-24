<?php

require __DIR__.'./vendor/autoload.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Origin, Pragma, Cache-control, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Válasz az OPTIONS kérésre
    header("HTTP/1.1 200 OK");
    exit;
}

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    
    $r->addRoute('POST', '/boznanszkykes23/server/index.php', 'login');
    $r->addRoute('GET', '/boznanszkykes23/server/index.php', 'home');
    $r->addRoute('GET', '/boznanszkykes23/server/megrendelesek', 'megrendelesek');
    $r->addRoute('GET', '/boznanszkykes23/server/keszlet', 'keszlet');
    $r->addRoute('GET', '/boznanszkykes23/server/vasarlok', 'vasarlok');
    $r->addRoute('GET', '/boznanszkykes23/server/vasarlo/{id}', 'vasarloAdatok');
    $r->addRoute('GET', '/boznanszkykes23/server/hirlevel', 'hirlevel');
    $r->addRoute('GET', '/boznanszkykes23/server/felhivas', 'felhivas');
    $r->addRoute('POST', '/boznanszkykes23/server/felhivas', 'ujFelhivas');
    $r->addRoute('DELETE', '/boznanszkykes23/server/felhivas/{id}', 'felhivasTorlese');
    $r->addRoute('GET', '/boznanszkykes23/server/galeria', 'galeria');
   
});


$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$routeInfo = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $path);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        // ... 404 Not Found
        home();
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        // ... 405 Method Not Allowed
        home();
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        // ... call $handler with $vars
        $body = json_decode(file_get_contents('php://input'), true);
        $handler($vars, $body);
        break;
}

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
            "exp" => time() + 60 * 60,
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
    return $body['username'] === "admin" && $body['password'] === "soma85";
}

function auth() {
    $accessToken = getTokenFromHeaderOrSendErrorResponse();
    $decoded = decodeJwtOrSendErrorResponse($accessToken);
}

function home() {
    //Termékek listája
    auth();
    $pdo = getConnection();
    $query = "SELECT name, k.type, subcategory_name, price
                FROM knives k 
                    LEFT JOIN knives_subcategories ks
                    ON k.type_subcategory = ks.idknives_subcategories";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

}

function megrendelesek() {
    auth();
    $pdo = getConnection();
    $query = "SELECT d.id_deliveries, d.status, o.date, d.modify_date 
                FROM deliveries d 
                    INNER JOIN orders o 
                    ON o.deliveries_id_deliveries = d.id_deliveries
                    WHERE d.status = 'PENDING'
                    ORDER BY o.date ASC";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function keszlet() {
    auth();
    $pdo = getConnection();
    $query = "SELECT s.*, k.name 
                FROM store s 
                LEFT JOIN knives k ON s.product_id = k.id_knives
                WHERE stock > 0";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function vasarlok() {
    auth();
    $pdo = getConnection();
    $query = "SELECT name, email, id_customers AS id 
                FROM customers 
                ORDER BY name ASC";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

function vasarloAdatok($vars) {
    auth();
    $pdo = getConnection();
    $query = "SELECT email, phone, pa.post_code, pa.settlement, pa.street, pa. details, ba.post_code AS bill_post_code, ba.settlement AS bill_settlement, ba.street AS bill_street, ba.details AS bill_details, ba.bill_name
                FROM customers c
                    LEFT JOIN post_addresses pa ON c.   post_addresses_idpost_addresses = pa.id_post_addresses
                    LEFT JOIN bill_addresses ba ON c.bill_addresses_idbill_addresses = ba.id_bill_addresses
                WHERE id_customers = ?";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $customer_data = $statement->fetchAll(PDO::FETCH_ASSOC);

    //Rendelési adatok lekérése
    $query = "SELECT o.date, k.name, o.quantity, o.price 
                FROM orders o
                JOIN knives k ON o.knives_id_knives = k.id_knives
                WHERE o.customers_id_customers = ?
                ORDER BY o.date DESC";
    $statement = $pdo->prepare($query);
    $statement->execute([$vars['id']]);
    $order_data = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    $all_data = [
                0 => $customer_data, 
                1 => $order_data
                ];
    echo json_encode($all_data, JSON_PRETTY_PRINT);
}

function hirlevel() {
    $custom = [
        "name" => "Soma",
        "title" => "hirlevel",
        "age" => 38
    ];
    echo json_encode($custom);
}

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

function galeria() {
    $custom = [
        "name" => "Soma",
        "title" => "galeria",
        "age" => 38
    ];
    echo json_encode($custom);
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

function getConnection() {
    
    try {
        return new PDO(
            "mysql:host=" . $_SERVER['DB_HOST'] . 
            ";dbname=" . $_SERVER['DB_NAME'], 
            $_SERVER['DB_USER'], 
            $_SERVER['DB_PASS']);
    } catch (PDOException $e) {
        echo json_encode(["DB connection error: " => $e->getMessage()]);
    }
} 

function getTokenFromHeaderOrSendErrorResponse()
{
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

function decodeJwtOrSendErrorResponse($token)
{
    try {
        $decoded = JWT::decode(
            $token ?? '', 
            new Key(
                $_SERVER['JWT_TOKEN_SECRET'],
                'HS256'
            )
        );
        return (array)$decoded;

    } catch(\Firebase\JWT\ExpiredException) {
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