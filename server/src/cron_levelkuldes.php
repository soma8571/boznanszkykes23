<?php

//Az adatbázis 'newsletters' táblájából lekér 5 még küldetlen levelet és megpróbálja azokat elküldeni a megfelelő adatokkal
function checkUnsentMails() {
   $pdo = getConnection();
   $query = "SELECT * 
               FROM newsletters 
               WHERE sendDate <= NOW() AND 
               status = 'UNSENT'
               LIMIT 5";
   $stmt = $pdo->prepare($query);
   $stmt->execute([]);
   if ($stmt->rowCount() > 0) {
      //ha van küldetlen levél
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

      require 'smarty.php';
      
      //végigmegyünk a lekért 5 adatsoron és levélküldés
      for ($i = 0; $i < count($data); $i++) {
         $smarty->assign("text", $data[$i]["body"]);
         $mail_template = $smarty->fetch("newsletter.tpl");
         $cc = null;

         if ((sendMail($data[$i]["address"], $data[$i]["title"], $mail_template, $cc)) === true) {
            //a küldés sikeres volt
            updateNewsletters($data[$i]["id_newsletters"], 'SENT');
         } else {
            //a küldés sikertelen volt
         }
      }
  
   }

}

function updateNewsletters($newsletter_id, $status) {
   $pdo = getConnection();
   $update = "UPDATE newsletters 
               SET status = ?, 
               sent_datetime = ?
               WHERE id_newsletters = ?";
   $stmt = $pdo->prepare($update);
   $stmt->execute([
      $status,
      'NOW()',
      $newsletter_id
   ]);
}

?>