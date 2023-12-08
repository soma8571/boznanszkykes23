<?php

require __DIR__.'/smarty-init.php';
require __DIR__.'/phpmailer.php';
require __DIR__.'/cron_db_conn.php';

//Az adatbázis 'newsletters' táblájából lekér x küldetlen levelet és megpróbálja azokat elküldeni a megfelelő adatokkal
function checkUnsentMails() {
   global $smarty;
   //$limit = isset($_SERVER['SENDED_NEWSLETTER_ONCE']) ? intval($_SERVER['SENDED_NEWSLETTER_ONCE']) : 5;
   $pdo = getConnection();
   $query = "SELECT * 
               FROM newsletters 
               WHERE sendDate <= NOW() AND 
               status = 'UNSENT'
               LIMIT 5"; //sajnos nem sikerült megoldást találni arra, hogy a LIMIT paraméterként való megoldása működjön
   $stmt = $pdo->prepare($query);
   $stmt->execute([]);
   if ($stmt->rowCount() > 0) {
      //ha van küldetlen levél
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $sent = 0;
      $failed = 0;
      
      //végigmegyünk a lekért 5 adatsoron és levélküldés
      for ($i = 0; $i < count($data); $i++) {
         $smarty->assign("text", $data[$i]["body"]);
         $mail_template = $smarty->fetch("newsletter.tpl");
         //$mail_template = $data[$i]["body"]; //smarty nélküli verzió
         $cc = null;

         if ((sendMail($data[$i]["address"], $data[$i]["title"], $mail_template, $cc)) === true) {
            //a küldés sikeres volt
            updateNewsletters($data[$i]["id_newsletters"], 'SENT');
            $sent++;
         } else {
            //a küldés sikertelen volt
            updateNewsletters($data[$i]["id_newsletters"], 'FAILED');
            $failed++;
         }
      }
      echo "Sikeresen küldve: {$sent} db, sikertelen küldés: {$failed} db.";
   } else {
      echo "Jelenleg nincs kiküldésre váró levél az adatbázisban.";
   }  
}

function updateNewsletters($newsletter_id, $status) {
   $pdo = getConnection();
   $update = "UPDATE newsletters 
               SET status = ?, 
               sent_datetime = NOW()
               WHERE id_newsletters = ?";
   $stmt = $pdo->prepare($update);
   $stmt->execute([
      $status,
      $newsletter_id
   ]);
}

checkUnsentMails();

?>