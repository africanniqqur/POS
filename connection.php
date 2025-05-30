<?php
    $servername = 'localhost';
    $username = 'root';
    $password = '';

    //connecting to database.
    try {
        $conn = new PDO("mysql:host=$servername;dbname=inventory", $username, $password);
        //set the PDO error mode to exeption
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
    } catch(\Exception $e){

    }

    //make the connection varialble global
    $GLOBALS['conn'] = $conn;

    
    //connecting to database.
    try {
        $conn2 = new PDO("mysql:host=$servername;dbname=point_of_sale", $username, $password);
        //set the PDO error mode to exeption
        $conn2->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
    } catch(\Exception $e){

    }

    //make the connection varialble global
    $GLOBALS['conn_pos'] = $conn2;
    


?>