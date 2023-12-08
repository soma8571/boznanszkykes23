<?php

require 'cron_db_conn.php';

function deleteExpiredSales() {
   $pdo = getConnection();
   $delete = "DELETE FROM on_sale
               WHERE deadline < NOW()";
   $stmt = $pdo->prepare($delete);
   $stmt->execute([]);
}

deleteExpiredSales();

?>