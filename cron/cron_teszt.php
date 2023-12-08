<?php

require __DIR__.'/smarty-init.php';
require __DIR__.'/phpmailer.php';

$smarty->assign("text", "végre talán jó lett???");
$mail_template = $smarty->fetch('newsletter.tpl');
   

function sendingTest() {
   global $mail_template;
   
   if ((sendMail("tamas.somloi@gmail.com", "my subject", $mail_template)) === true) {
      //a küldés sikeres volt
      echo "Sikeres küldés";
   } else {
      //a küldés sikertelen volt
      echo "Sikertelen küldés";
   }
}

sendingTest();

?>