<?php
// Imposta le variabili di ambiente per l'utente e la password del database
$dbuser = getenv('DB_USER');
$dbpass = getenv('DB_PASSWORD');

try {
    // Utilizza le variabili di ambiente per la connessione al database
    $conn = new PDO('sqlsrv:Server=127.0.0.1;Database=PS_UserData', $dbuser, $dbpass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Imposta il PDO in modalità eccezione
} catch (PDOException $e) {
    // Gestisci eventuali errori nella connessione al database
    die($e->getMessage());
}

if (session_id() == "") {
    session_start();
}
// Funzione per il logging degli errori delle query
function logQueryError($errorMessage) {
    error_log("Errore durante l'esecuzione della query: $errorMessage", 3, "error_log1.txt");
}
$uid = 0;
$userid = 'guest';
$status = 0;
$point = 0;
$lang = 'en';

if (isset($_SESSION['UserUID'])) {
    $uid = $_SESSION['UserUID'];

    // Controllo sullo status dell'utente
    $queryCheck = $conn->prepare('SELECT Status FROM PS_UserData.dbo.Users_Master WHERE UserUID = ?');
    $queryCheck->bindValue(1, $uid, PDO::PARAM_INT);
    $queryCheck->execute();
    $banCase = $queryCheck->fetch(PDO::FETCH_NUM);

    if ($banCase[0] == -5) {
        // Utente bannato
        $queryBan = $conn->prepare('SELECT * FROM PS_UserData.dbo.Users_Bann WHERE UserUID = ?');
        $queryBan->bindValue(1, $uid, PDO::PARAM_INT);
        $queryBan->execute();
        $ban = $queryBan->fetch(PDO::FETCH_NUM);

        if ($ban !== false) {
            if ($ban[4] == 0) {
                $banDate = $ban[3];
                $banTime = strtotime($banDate);
                $endTime = $banTime + 100000;
            } else {
                $sbanDate = $ban[4];
                $endTime = strtotime($sbanDate);
            }

            $daysText = $ban[2];
            $banReason = $ban[5];
            $date = date("Y-m-d G:i");
            $actualTime = strtotime($date);

            if ($endTime < $actualTime) {
                // Rimuovi il ban
                $queryBanRemove = $conn->prepare("DELETE FROM PS_UserData.dbo.Users_Bann WHERE UserUID = ?");
                $queryBanRemove->bindValue(1, $uid, PDO::PARAM_INT);
                $queryBanRemove->execute();

                $queryStatusBan = $conn->prepare("UPDATE PS_UserData.dbo.Users_Master SET Status = '0' WHERE UserUID = ?");
                $queryStatusBan->bindValue(1, $uid, PDO::PARAM_INT);
                $queryStatusBan->execute();
            }
        }
    }

    // Recupero informazioni utente
    $queryUser = $conn->prepare('SELECT UserID, Status, Point, Pw, JoinDate, Email, Lang, VotePoint FROM PS_UserData.dbo.Users_Master WHERE UserUID = ?');
    $queryUser->bindValue(1, $uid, PDO::PARAM_INT);
    $queryUser->execute();
    $userData = $queryUser->fetch(PDO::FETCH_ASSOC);

    if ($userData !== false) {
        $userid = $userData["UserID"];
        $status = $userData["Status"];
        $point = $userData["Point"];
        $votePoint = $userData["VotePoint"];
        $pw = $userData["Pw"];
        $joinDate = $userData["JoinDate"];
        $email = $userData["Email"];
        $lang = $userData["Lang"];
    }
}

$userip = $_SERVER['HTTP_X_FORWARDED_FOR'];
# $userip = $_SERVER['REMOTE_ADDR'];

function showTop($t, $l) {
    $t = strip_tags($t);
    if (strlen($t) <= $l) {
        return $t;
    }
    $u = strrpos(substr($t, 0, $l), ' ');
    $a = substr($t, 0, $u) . ' ...';
    return $a;
}
?>
