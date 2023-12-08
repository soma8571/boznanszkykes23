<?php

/* A mediacenter szerverén ez a 'admin2023/cron/' mappában van és a cron működéshez szükséges csak */
require __DIR__. '/vendor/autoload.php';
$smarty = new Smarty();

$smarty->setTemplateDir('/web/boznanszkyk/admin2023/cron/smarty/templates/');
$smarty->setConfigDir('/web/boznanszkyk/admin2023/cron/smarty/config/');
$smarty->setCompileDir('/web/boznanszkyk/admin2023/cron/smarty/compile/');
$smarty->setCacheDir('/web/boznanszkyk/admin2023/cron/smarty/cache/');
//$smarty->testInstall();


?> 