<?php
// Inizializzazione della sessione in modo sicuro
session_set_cookie_params([
    'lifetime' => 86400, // 1 giorno
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'secure' => true, // True se vuoi che il cookie sia inviato solo su connessioni HTTPS
    'httponly' => true,
    'samesite' => 'Strict'
]);
session_start();

// Abilita la visualizzazione degli errori su schermo solo durante lo sviluppo
if (getenv('ENVIRONMENT') === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
} else {
    // Disabilita la visualizzazione degli errori su schermo in produzione
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
}

// Costante per il costo della ruota
define('WHEEL_COST', 199);

// Funzione per il logging degli errori delle query
function logQueryError($errorMessage) {
    error_log("Errore durante l'esecuzione della query: $errorMessage", 3, "error_log.txt");
}

// Connessione al database PS_UserData
$dbuser = getenv('DB_USER');
$dbpass = getenv('DB_PASSWORD');

try {
    $conn = new PDO('sqlsrv:Server=127.0.0.1;Database=PS_UserData', $dbuser, $dbpass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false // Disabilita le query emulate per prevenire SQL injection
    ]);
} catch (PDOException $e) {
    // Registra gli errori di connessione a entrambi i database
    error_log("Errore di connessione al database: " . $e->getMessage(), 0);
    // Termina lo script e mostra un messaggio di errore generico
    die("Errore di connessione ai database. Si prega di riprovare più tardi.");
}

// Pagine del sito web
$pages = [
    "news",
    "download",
    "login",
    "register",
    "password-recovery",
    "settings",
    "ucp",
    "ref",
    "contact",
    "support",
    "termsofservice",
    "refundpolicy",
    
    // Sezione del gioco
    "game",
    
    "events",
    "custom-ranking-system",
    "ranks",
    "boss-records",
    "guilds",
    "droplist",
    "drops",
    
    "resources",
    "video",
    "screenshots",
    "wallpaper",
    
    "itemmall",
    "billing",
    "history",
    "stripe",
    
    "pvp-reward",
    "grb-reward",
    "tiered",
    "vote",
    "gift-code",
    "forge",
    "forge-vp",
    "collectors",
    "daily-reward",
    "lastkills",
    
    "gm-panel-n3w"
];

// Ottenimento della pagina corrente in modo sicuro
$page = isset($_GET["p"]) && in_array($_GET["p"], $pages, true) ? $_GET["p"] : $pages[0];

// Array delle lingue (template)
$Languages = [
    "en" => "Shaiya Duff",
    // Altre lingue...
];

// Cambio lingua (template)
if (isset($_GET["lang"]) && array_key_exists($_GET["lang"], $Languages)) {
    $_SESSION["lang"] = $_GET["lang"];
}

// Caricamento lingua (template)
$lang = $_SESSION["lang"] ?? key($Languages);

// Pannello GM solo in inglese
if ($page === "gm-panel-n3w" && $lang !== "en") {
    $lang = "en";
}

// Ottenimento dell'indirizzo IP del client in modo sicuro
$user_ip = filter_input(INPUT_SERVER, 'REMOTE_ADDR', FILTER_VALIDATE_IP);

// Informazioni sui referral
if (isset($_GET["ref"]) && is_numeric($_GET["ref"])) {
    $_SESSION["ref"] = filter_input(INPUT_GET, "ref", FILTER_VALIDATE_INT);
}

$HomeUrl = "http://100.112.150.44:8080/";
$BackUrl = $_SERVER['HTTP_REFERER'] ?? $HomeUrl;
$TemplateUrl = "templates/$lang/"; // Link al template corrente
$AssetUrl = "$HomeUrl"; // Link alla cartella in cui sono collocati i file delle immagini, css, js
$PageUrl = "$TemplateUrl/pages/$page/"; // Link alla cartella della pagina corrente

include_once 'function.php'; // Funzioni
include_once 'maps.php'; // Mappe
include_once 'arrays.php'; // Array

// Nome del server
$ServerName = "Shaiya Duff";
// Nome della valuta
$currencyCode = "SP";
$currencyName = "Shaiya Points";
$currencyCode2 = "VP";
$currencyName2 = "Vote Points";
// Social
$DiscordUrl = "https://discord.gg/shaiyaDuff";
$FacebookUrl = "https://www.facebook.com/shaiyaDuff";
$VkUrl = "#";
$YoutubeUrl = "#";

// Link per il download
$DownloadLinks = [
    "en" => [
        "mega" => "https://mega.nz/file/edAWBSoI#4IwaqOMstAxHgANLJYRjfaFzCUcC-QjGfg6GQSqubqw",
        "drive" => "https://drive.google.com/file/d/1KzCev2hYDM5Le96IfsQf2tymGzXKf_Ad/view?usp=sharing",    
        "mediafire" => "https://www.mediafire.com/file/g996gbalztqurzr/Shaiya_Duff_2022.rar/file",
    ],
    "de" => [
        "mega" => "#",
        "drive" => "#",
        "mediafire" => "#",     
    ],
    "pt" => [
        "mega" => "#",
        "drive" => "#",
        "mediafire" => "#",         
    ],
];

// Data corrente in formato sicuro
$GetDate = date('d.m.y');

// Gestione dei referral in modo sicuro
if (isset($_GET["ref"]) && is_numeric($_GET["ref"])) {
    $_SESSION["ref"] = filter_input(INPUT_GET, "ref", FILTER_VALIDATE_INT);
}

// Inizializzazione delle variabili utente
$UserUID = $Status = $Point = $VotePoint = $IsGM = $IsStaff = 0;
$UserID = $Faction = "";

// Controllo della sessione utente in modo sicuro
if (isset($_SESSION["session_id"], $_SESSION["UserUID"]) && is_numeric($_SESSION["UserUID"])) {
    $query = "SELECT TOP 1 UM.UserUID, UM.UserID, UM.Point, UM.VotePoint, UM.Status, UM.AdminLevel, UM.Email, UMG.Country, C.CharName, ISNULL(C.K1, 0) AS K1 
                FROM PS_UserData.dbo.Users_Master UM 
                LEFT JOIN PS_GameData.dbo.UserMaxGrow UMG ON UMG.UserUID=UM.UserUID 
                LEFT JOIN PS_GameData.dbo.Chars C ON C.UserUID=UM.UserUID AND C.Del=0
                WHERE UM.UserUID=?";
    $stmt = $conn->prepare($query);
    $stmt->bindValue(1, $_SESSION["UserUID"], PDO::PARAM_INT);
    $stmt->execute();
    $UserInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($UserInfo) {
        $UserUID = $UserInfo["UserUID"];
        $Status = $UserInfo["Status"];
        $Faction = $UserInfo["Country"];
        $UserID = $UserInfo["UserID"];
        $Point = $UserInfo["Point"];
        $VotePoint = (int)$UserInfo["VotePoint"];
        $IsGM = $Status == 16;
    }
} else {
    // Logga l'errore
    logQueryError("Sessione utente non valida o mancante");
}
?>
