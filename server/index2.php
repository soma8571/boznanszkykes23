<?php

require __DIR__.'./vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    
    $r->addRoute('POST', '/boznanszkykes23/server/index2.php', 'login2');

   
});


$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$routeInfo = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $path);
//echo "<pre>";
//var_dump($routeInfo);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        // ... 404 Not Found
        home();
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        // ... 405 Method Not Allowed
        home2();
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        // ... call $handler with $vars
        $body = json_decode(file_get_contents('php://input'), true);
        $handler($vars, $body);
        break;
}

/*
function login2() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if (isset($_POST["username"]) && !empty($_POST["username"])) {
        header('Content-type: application/json');

        echo json_encode(["msg" => "okés"]);
    } else {
        header('Content-type: application/json');
        echo json_encode(["msg" => "odsa"]);
    }
    
}
*/

function home2() {
    header('Content-type: application/json');
    
    echo json_encode(["error" => "Method not allowed"]);
}

function home() {
    header('Content-type: application/json');
    
    echo json_encode(["error" => "Nem található"]);
}


 function login2() {

    header('Content-type: application/json');
        echo json_encode(["msg" => "odsa"]);

 }
?>