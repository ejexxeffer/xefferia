<?php
  $to = 'admin@xefferia.com';
  $name = $_POST['name'];
  $email = $_POST['email'];
  $theme = $_POST['theme'];
  $text = $_POST['text'];
  $date = $_POST['date'];


  $subject = "=?utf-?8?B?".base64encode($theme)."?=";
  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type: text/html; charset=utf-8\r\n";
  $headers .= "From: $name <$email>\r\n";
  $headers .= "Reply-to: $email\r\n";

  $success = mail($to, $subject, $text, $headers);
  echo $success;
?>