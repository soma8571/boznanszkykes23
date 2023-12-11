<?php

/* A mediacenter szerverén ez a 'admin2023/cron/' mappában van és a cron működéshez szükséges csak */

//Load Composer's autoloader
//require 'vendor/autoload.php';

//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
//use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;


function sendMail($to, $subject, $body, $cc = null) {

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        //$mail->Host = "pop3.mediacenter.hu";
        $mail->Host = "smtp.mediacenter.hu"; //dedikált SMTP beállítás
        $mail->Port = 465;
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = "ssl";
        $mail->CharSet = "UTF-8";
        //$mail->Username = "noreply@boznanszkykes.hu";
        $mail->Username = "boznanszkykes"; //dedikált SMTP beállítás
        //$mail->Password = "Benedek2012";
        $mail->Password = "D6RdmPzs"; //dedikált SMTP beállítás
        $mail->setFrom("noreply@boznanszkykes.hu", "boznanszkykes.hu");

        $mail->addAddress($to);
        $mail->isHTML(true);
        
        if ($cc !== null)
            $mail->addCC($cc);

        $mail->Subject = $subject;
        $mail->Body = $body;

        //Debug infó
        //$mail->SMTPDebug = SMTP::DEBUG_SERVER;
        
        //Valós küldés
        //$mail->SMTPDebug = SMTP::DEBUG_OFF;

        $mail->send();
        return true;

    } catch (Exception $e) {
        return "Hiba a levél küldése során: {$mail->ErrorInfo}";
    }
}

?>