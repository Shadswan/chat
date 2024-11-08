<?php
$user='root';
$pass='';
try{
    $connect=new PDO('mysql:host=localhost;dbname=chat',$user,$pass);
}catch(PDOException $e){
    echo $e->getMessage("ХАХААХ лох");
}