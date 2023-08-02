<?php

require __DIR__."/src/common.php";

if ($_SERVER['SERVER_NAME'] === "localhost") {
    header("Access-Control-Allow-Origin: http://localhost:3000");
} else {
    header("Access-Control-Allow-Origin: http://admin.boznanszkykes.hu");
}

header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS, DELETE");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Origin, Pragma, Cache-control, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Válasz az OPTIONS kérésre
    header("HTTP/1.1 200 OK");
    exit;
}

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    
    $r->addRoute('POST', '/boznanszkykes23/server/login', 'login');
    $r->addRoute('GET', '/boznanszkykes23/server/index.php', 'home');

    //termek.php
    $r->addRoute('GET', '/boznanszkykes23/server/termek/{id}', 'termekAdatok');
    $r->addRoute('GET', '/boznanszkykes23/server/termekkepek/{id}', 'termekKepek');
    $r->addRoute('GET', '/boznanszkykes23/server/termekakcio/{id}', 'termekAkcio');
    $r->addRoute('POST', '/boznanszkykes23/server/termekakcio/{id}', 'termekAkcioMentese');
    $r->addRoute('DELETE', '/boznanszkykes23/server/termekakcio/{id}', 'termekAkcioTorlese');
    $r->addRoute('GET', '/boznanszkykes23/server/termekalkategoriak', 'termekalkategoriak');
    $r->addRoute('PATCH', '/boznanszkykes23/server/termek/{id}', 'termekAdatUpdate');
    //új termék: visszaad egy rekordot a knives táblából, ez alapján a sablon alapján képezünk kliens oldalon egy üres termék objektumot
    $r->addRoute('GET', '/boznanszkykes23/server/termeksablon/', 'termekSablon');
    $r->addRoute('POST', '/boznanszkykes23/server/uj-termek/', 'ujTermek');
    
    //megrendelesek.php
    $r->addRoute('GET', '/boznanszkykes23/server/megrendelesek', 'megrendelesek');
    $r->addRoute('GET', '/boznanszkykes23/server/megrendeles/{id}', 'megrendelesAdatok');

    //vasarlok.php
    $r->addRoute('GET', '/boznanszkykes23/server/vasarlok', 'vasarlok');
    $r->addRoute('GET', '/boznanszkykes23/server/vasarlo/{id}', 'vasarloAdatok');

    //keszlet.php
    $r->addRoute('GET', '/boznanszkykes23/server/keszlet', 'keszlet');
    
    //felhivas.php
    $r->addRoute('GET', '/boznanszkykes23/server/felhivas', 'felhivas');
    $r->addRoute('POST', '/boznanszkykes23/server/felhivas', 'ujFelhivas');
    $r->addRoute('DELETE', '/boznanszkykes23/server/felhivas/{id}', 'felhivasTorlese');

    //kiszallitas.php
    $r->addRoute('GET', '/boznanszkykes23/server/kiszallitas', 'kiszallitas');
    $r->addRoute('POST', '/boznanszkykes23/server/kiszallitas', 'ujKiszallitasiKoltseg');
    $r->addRoute('DELETE', '/boznanszkykes23/server/kiszallitas/{id}', 'kiszallitasiKoltsegTorlese');
    $r->addRoute('PATCH', '/boznanszkykes23/server/kiszallitas/{id}', 'kiszallitasStatuszModositas');

    //hirlevel.php
    $r->addRoute('POST', '/boznanszkykes23/server/hirlevel', 'hirlevelMentese');

    //galeria.php
    $r->addRoute('GET', '/boznanszkykes23/server/galeria', 'galeriaKepek');
    $r->addRoute('PATCH', '/boznanszkykes23/server/galeria/{id}', 'lathatosagModositas');
   
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

function home() {
    //Termékek listája
    auth();
    $pdo = getConnection();
    $query = "SELECT id_knives, name, k.type, subcategory_name, price
                FROM knives k 
                    LEFT JOIN knives_subcategories ks
                    ON k.type_subcategory = ks.idknives_subcategories";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

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


?>