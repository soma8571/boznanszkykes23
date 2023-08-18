<?php

require __DIR__."/src/common.php";

$folder = "";
if ($_SERVER['SERVER_NAME'] === "localhost") {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    $folder = "/boznanszkykes23/";
} else {
    header("Access-Control-Allow-Origin: http://admin.boznanszkykes.hu");
    $folder = "/";
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

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) use ($folder) {
    
    $r->addRoute('POST', $folder.'server/login', 'login');
    $r->addRoute('GET', $folder.'server/index.php', 'home');

    //termek.php
    $r->addRoute('GET', $folder.'server/termek/{id}', 'termekAdatok');
    $r->addRoute('GET', $folder.'server/termekkepek/{id}', 'termekKepek');
    $r->addRoute('GET', $folder.'server/termekakcio/{id}', 'termekAkcio');
    $r->addRoute('POST', $folder.'server/termekakcio/{id}', 'termekAkcioMentese');
    $r->addRoute('DELETE', $folder.'server/termekakcio/{id}', 'termekAkcioTorlese');
    $r->addRoute('GET', $folder.'server/termekalkategoriak', 'termekalkategoriak');
    $r->addRoute('PATCH', $folder.'server/termek/{id}', 'termekAdatUpdate');
    //új termék: visszaad egy rekordot a knives táblából, ez alapján a sablon alapján képezünk kliens oldalon egy üres termék objektumot
    $r->addRoute('GET', $folder.'server/termeksablon/', 'termekSablon');
    $r->addRoute('POST', $folder.'server/uj-termek/', 'ujTermek');
    $r->addRoute('POST', $folder.'server/kepfeltoltes/{id}', 'kepfeltoltes');
    $r->addRoute('GET', $folder.'server/termekProfilTn/{id}', 'termekProfilThumbnail');

    //Termék kép törlése
    $r->addRoute('DELETE', $folder.'server/termekkeptorlese/{id}', 'termekKepTorlese');

    //Termék Profilkép megváltoztatása
    $r->addRoute('PATCH', $folder.'server/termekprofilmodositas/{id}', 'termekProfilModositas');

    //megrendelesek.php
    $r->addRoute('GET', $folder.'server/megrendelesek', 'megrendelesek');
    $r->addRoute('GET', $folder.'server/megrendeles/{id}', 'megrendelesAdatok');

    //vasarlok.php
    $r->addRoute('GET', $folder.'server/vasarlok', 'vasarlok');
    $r->addRoute('GET', $folder.'server/vasarlo/{id}', 'vasarloAdatok');

    //keszlet.php
    $r->addRoute('GET', $folder.'server/keszlet', 'keszlet');
    
    //felhivas.php
    $r->addRoute('GET', $folder.'server/felhivas', 'felhivas');
    $r->addRoute('POST', $folder.'server/felhivas', 'ujFelhivas');
    $r->addRoute('DELETE', $folder.'server/felhivas/{id}', 'felhivasTorlese');

    //kiszallitas.php
    $r->addRoute('GET', $folder.'server/kiszallitas', 'kiszallitas');
    $r->addRoute('POST', $folder.'server/kiszallitas', 'ujKiszallitasiKoltseg');
    $r->addRoute('DELETE', $folder.'server/kiszallitas/{id}', 'kiszallitasiKoltsegTorlese');
    $r->addRoute('PATCH', $folder.'server/kiszallitas/{id}', 'kiszallitasStatuszModositas');

    //hirlevel.php
    $r->addRoute('POST', $folder.'server/hirlevel', 'hirlevelMentese');

    //galeria.php
    $r->addRoute('GET', $folder.'server/galeria', 'galeriaKepek');
    $r->addRoute('PATCH', $folder.'server/galeria/{id}', 'lathatosagModositas');
    $r->addRoute('DELETE', $folder.'server/galeria/{id}', 'galeriaKepTorlese');
   
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
    $query = "SELECT id_knives, name, k.type, k.available, subcategory_name, price, pi.thumbnail_path
                FROM knives k 
                    LEFT JOIN knives_subcategories ks
                        ON k.type_subcategory = ks.idknives_subcategories
                    LEFT JOIN product_images pi
                        ON k.id_knives = pi.knives_id
                WHERE pi.profil = 1 OR pi.profil IS NULL";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
    //echo json_encode(["msg" => "home lefut"]);

}

function getConnection() {
    
    try {
        $conn = new PDO(
            "mysql:host=" . $_SERVER['DB_HOST'] . 
            ";dbname=" . $_SERVER['DB_NAME'], 
            $_SERVER['DB_USER'], 
            $_SERVER['DB_PASS']);
        $query = "SET NAMES UTF8";
        $statement = $conn->prepare($query);
        $statement->execute();
        return $conn;

    } catch (PDOException $e) {
        echo json_encode(["DB connection error: " => $e->getMessage()]);
    }
}  


?>