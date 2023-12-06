<?php

require './vendor/autoload.php';
require __DIR__."/megrendelesek.php";
require __DIR__."/vasarlok.php";
require __DIR__."/keszlet.php";
require __DIR__."/felhivas.php";
require __DIR__."/kiszallitas.php";
require __DIR__."/hirlevel.php";
require __DIR__."/galeria.php";
require __DIR__."/autentikacio.php";
require __DIR__."/termek.php";
require __DIR__."/phpmailer.php";
require __DIR__."/smarty.php";

function generateRandomString($length = 21) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}

?>