<?php
// Funzione per verificare se un giocatore è connesso
// Restituisce: 1 se è connesso, 0 se non è connesso, -1 se non esiste o c'è un errore
function getPlayerStatus($conn, $userUID){
    // Definizione della query
    $query = $conn->prepare('SELECT Leave FROM PS_UserData.dbo.Users_Master WHERE UserUID=?');
    // Impostazione ed esecuzione della query
    if (!$query || !$query->bindParam(1, $userUID, PDO::PARAM_INT) || !$query->execute()){
        return -1;
    }
    // Ottieni la risposta e verifica lo stato (Leave è '1' quando l'utente è connesso)
    if (($row = $query->fetch(PDO::FETCH_NUM)) == null){
        return -1;
    }
    $status = $row[0];
    // Rilascio delle risorse
    $query->closeCursor();
    // Restituzione dello stato del giocatore
    return $status;
}

// Connessione al server MSSQL con le credenziali di Shaiya utilizzando PDO
$dbuser = getenv('DB_USER');        // NOME DEL TUO ACCOUNT SHAIYA
$dbpass = getenv('DB_PASSWORD');    // PASSWORD DEL TUO ACCOUNT SHAIYA
$database = 'PS_UserData';

try {
    $conn  = new PDO("sqlsrv:Server=127.0.0.1;Database=$database", $dbuser, $dbpass);
    $conn->setAttribute(PDO::SQLSRV_ATTR_ENCODING, PDO::SQLSRV_ENCODING_UTF8);
} catch (PDOException $e) {
    die($e->getMessage());
}
// Funzione per il logging degli errori delle query
function logQueryError($errorMessage) {
    error_log("Errore durante l'esecuzione della query: $errorMessage", 3, "error_log2.txt");
}
?>

