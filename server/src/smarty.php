<?php

require 'vendor/autoload.php';
$smarty = new Smarty();

$smarty->setTemplateDir('./smarty/templates/');
$smarty->setConfigDir('./smarty/config/');
$smarty->setCompileDir('./smarty/compile/');
$smarty->setCacheDir('./smarty/cache/');

?>