<?php

//Перекодировать из Windows-1251 в UTF-8
function toUTF8(array $arr) {
	foreach ($arr as $k => $v)
		$arr[$k] = mb_convert_encoding($arr[$k], "UTF-8", "Windows-1251");
	
	return $arr;
}

// Get alerts
function GetAlerts() {
	$out = "";
	// Success
	if (isset($_SESSION["success"])) {
		$labels = "";
		foreach($_SESSION["success"] as $label)
			$labels .= $label."<br />";
		$out .= "<div class='alert alert-success' role='alert'> $labels </div>";
		unset($_SESSION["success"]);
	}
	// Errors
	if (isset($_SESSION["errors"])) {
		$labels = "";
		foreach($_SESSION["errors"] as $label)
			$labels .= $label."<br />";
		$out .= "<div class='alert alert-danger' role='alert'> $labels </div>";
		unset($_SESSION["errors"]);
	}
	return $out;
}

// Alerts
function SetErrorAlert($message) {
	$_SESSION["errors"][] = $message;
}
function SetSuccessAlert($message) {
	$_SESSION["success"][] = $message;
}
function anyErrors() {
	return isset($_SESSION["errors"]);
}

// 
function PrintError($err, $msg=null) {
	$Msg = "";
	if ($msg!=null)
		$Msg .= "<div class='alert alert-success' role='alert'> $msg </div>";

	if ($err!=null)
		$Msg .= "<div class='alert alert-danger' role='alert'> $err </div>";
	return $Msg;
}

// User status info
function getStatusName($status, $blockEndDate = null) {
	if ($status < 0)
		return "Blocked";
	elseif ($status == 0 && $blockEndDate == null)
		return "Active";
	elseif ($status == 0 && $blockEndDate != null)
		return "Blocked up to $blockEndDate";
	elseif($status == 2)
		return "Game Helper";
	elseif($status==16 || $status==32 || $status==48 || $status==64 || $status==80)
		return "Game Master";
	else
		return "Unknown";
}

function generate_code(){
    $num1 = rand(11111, 99999);
    $num2 = rand(11111, 99999);
    $num3 = rand(11111, 99999);
    $code = md5($num1);
    return $code;
}

function getRandomString($length) { 
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    $randomString = ''; 
  
    for ($i = 0; $i < $length; $i++) { 
        $index = rand(0, strlen($characters) - 1); 
        $randomString .= $characters[$index]; 
    } 
  
    return $randomString; 
} 

function secondsToTime($inputSeconds) {

    $secondsInAMinute = 60;
    $secondsInAnHour  = 60 * $secondsInAMinute;
    $secondsInADay    = 24 * $secondsInAnHour;

    // extract days
    $days = floor($inputSeconds / $secondsInADay);

    // extract hours
    $hourSeconds = $inputSeconds % $secondsInADay;
    $hours = floor($hourSeconds / $secondsInAnHour);

    // extract minutes
    $minuteSeconds = $hourSeconds % $secondsInAnHour;
    $minutes = floor($minuteSeconds / $secondsInAMinute);

    // extract the remaining seconds
    $remainingSeconds = $minuteSeconds % $secondsInAMinute;
    $seconds = ceil($remainingSeconds);

    // return the final array
    $obj = array(
        'd' => (int) $days,
        'h' => (int) $hours,
        'm' => (int) $minutes,
        's' => (int) $seconds,
    );
    return $obj;
}

function GetClear($data) {
        if ( !isset($data) or empty($data) ) return '';
        if ( is_numeric($data) ) return $data;

        $non_displayables = array(
            '/%0[0-8bcef]/',            // url encoded 00-08, 11, 12, 14, 15
            '/%1[0-9a-f]/',             // url encoded 16-31
            '/[\x00-\x08]/',            // 00-08
            '/\x0b/',                   // 11
            '/\x0c/',                   // 12
            '/[\x0e-\x1f]/'             // 14-31
        );
        foreach ( $non_displayables as $regex )
            $data = preg_replace( $regex, '', $data );
        $data = str_replace("'", "", $data );
        return $data;
    }

function stringDecode($str) {
	return mb_convert_encoding($str, "UTF-8", "windows-1251");
}

function unsetSession ($SessionVariable) {
   unset($GLOBALS['_SESSION'][$SessionVariable]);
}

function createSession ($UserID){
	$md5 = md5($_SERVER['REMOTE_ADDR'].$UserID.$_SERVER['HTTP_USER_AGENT']);
	return $md5;
}

function checkSession ($Session,$UserID){
	$md5 = md5($_SERVER['REMOTE_ADDR'].$UserID.$_SERVER['HTTP_USER_AGENT']);
	if($Session != $md5){
		unsetSession('UserID');
		unsetSession('session_id');
		exit(header("location:/"));
	} else
		return true;
}

// Get name of the map by MapID
function getMapName($mapid) {
	switch ($mapid) {
		case 0:
			return 'D-Water';
			
		case 1:
			return 'Map 1 Light';
			
		case 2:
			return 'Map 1 Dark';
			
		case 3:
			return 'D1';
			
		case 4:
			return 'D1.2';
			
		case 5:
			return 'Cornwells 1';
			
		case 6:
			return 'Cornwells 2';
			
		case 7:
			return 'Argilla 1';
			
		case 8:
			return 'Argilla 2';
			
		case 9:
			return 'D2';
			
		case 10:
			return 'D2.2';
			
		case 11:
			return 'D2 [Floor3]';
			
		case 12:
			return 'Cloron 1';
			
		case 13:
			return 'Cloron 2';
			
		case 14:
			return 'Clorons Lair [Floor3]';
			
		case 15:
			return 'Fantasma Lair 1';
			
		case 16:
			return 'Fantasma Lair 2';
			
		case 17:
			return 'Fantasma Lair [Floor3]';
			
		case 18:
			return 'Proelium Frontier';
			
		case 19:
			return 'Willieoseu [Map2]';
			
		case 20:
			return 'Keuraijen [Map2]';
			
		case 21:
			return 'Maitreian 1';
			
		case 22:
			return 'Maitreian 2';
			
		case 23:
			return 'Aidion 1';
			
		case 24:
			return 'Aidion 2';
			
		case 25:
			return 'Elemental Cave';
			
		case 26:
			return 'Ruber Chaos';
			
		case 27:
			return 'Ruber Chaos';
			
		case 28:
			return 'Map 3 Light';
			
		case 29:
			return 'Map 3 Dark';
			
		case 30:
			return 'Cantabilian';
			
		case 31:
			return '20-30 Dungeon Light';
			
		case 32:
			return '20-30 Dungeon Dark';
			
		case 33:
			return 'Fedion';
			
		case 34:
			return 'Kalamus';
			
		case 35:
			return 'Apulune';
			
		case 36:
			return 'Iris';
			
		case 37:
			return 'Stigma';
			
		case 38:
			return 'Aurizen';
			
		case 39:
			return 'Small Stadium';
			
		case 40:
			return 'Arena';
			
		case 41:
			return 'Jail';
			
		case 42:
			return 'Auction House';
			
		case 43:
			return 'Skulleron (Pandoria)';
			
		case 44:
			return 'Astenes (Ranhaar)';
			
		case 45:
			return 'Deep Desert 1';
			
		case 46:
			return 'Deep Desert 2';
			
		case 47:
			return 'Jungle';
			
		case 48:
			return 'Cryptic Throne Light';
			
		case 49:
			return 'Cryptic Throne Dark';
			
		case 50:
			return 'GRB Map';
			
		case 51:
			return 'Light Guild House';
			
		case 52:
			return 'Dark Guild House';
			
		case 53:
			return 'Light Managment';
			
		case 54:
			return 'Dark Managment';
			
		case 55:
			return 'Sky City 1';
			
		case 56:
			return 'Sky City 1';
			
		case 57:
			return 'Sky City 2';
			
		case 58:
			return 'Caelum Greendieta [Floor3]';
			
		case 59:
			return 'Dung?';
			
		case 60:
			return 'Stadium';
			
		case 61:
			return 'Stigma ?';
			
		case 62:
			return 'Aurizen ?';
			
		case 63:
			return 'Dung?';
			
		case 64:
			return 'Oblivion';
			
		case 65:
			return 'Caleum Sacra 1';
			
		case 66:
			return 'Caleum Sacra 1';
			
		case 67:
			return 'Caelum Sacra [Dios Floor]';
			
		case 68:
			return 'Valdemar Regnum';
			
		case 69:
			return 'Palaion Regnum';
			
		case 70:
			return 'Kanos Illum';
			
		case 71:
			return 'Servus Colony';
			
		case 72:
			return 'Queen Caput';
			
		case 73:
			return 'Dung?';
			
		case 74:
			return 'Dung?';
			
		case 75:
			return 'Dung?';
			
		case 76:
			return 'Dung?';
			
		case 77:
			return 'Dung?';
			
		case 78:
			return 'Dung?';
			
		case 79:
			return 'Dung?';
			
		case 80:
			return 'Dung?';
			
		case 81:
			return 'Canyon of Greed';
		
		case 82:
			return 'Conwell Ruin (PvP)';
			
		case 87:
			return 'Castle Siege';
			
		case 88:
			return 'Locus Graveyard';	
			
		case 97:
			return 'Castle of Queens';	
			
		case 103:
			return 'Ice Valley';
			
		case 105:
			return 'Dimension Crack';
			
		default:
			return $mapid;
			
	}
}

function datediff($interval, $datefrom, $dateto, $using_timestamps = false) {
	if (!$using_timestamps) {
		$datefrom = strtotime($datefrom, 0);
		$dateto = strtotime($dateto, 0);
	}
	$difference = $dateto - $datefrom; // Difference in seconds
	switch ($interval) {
		case 'yyyy':
			$years_difference = floor($difference / 31536000);
			if (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom), date("j", $datefrom), date("Y", $datefrom) + $years_difference) > $dateto) {
				$years_difference--;
			}
			if (mktime(date("H", $dateto), date("i", $dateto), date("s", $dateto), date("n", $dateto), date("j", $dateto), date("Y", $dateto) - ($years_difference + 1)) > $datefrom) {
				$years_difference++;
			}
			$datediff = $years_difference;
			break;
		case "q":
			$quarters_difference = floor($difference / 8035200);
			while (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom) + ($quarters_difference * 3), date("j", $dateto), date("Y", $datefrom)) < $dateto) {
				$months_difference++;
			}
			$quarters_difference--;
			$datediff = $quarters_difference;
			break;

		case "m":
			$months_difference = floor($difference / 2678400);
			while (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom) + ($months_difference), date("j", $dateto), date("Y", $datefrom)) < $dateto) {
				$months_difference++;
			}
			$months_difference--;
			$datediff = $months_difference;
			break;
		case 'y':
			$datediff = date("z", $dateto) - date("z", $datefrom);
			break;
		case "d":
			$datediff = floor($difference / 86400);
			break;
		case "w":
			$days_difference = floor($difference / 86400);
			$weeks_difference = floor($days_difference / 7); // Complete weeks
			$first_day = date("w", $datefrom);
			$days_remainder = floor($days_difference % 7);
			$odd_days = $first_day + $days_remainder; // Do we have a Saturday or Sunday in the remainder?
			if ($odd_days > 7) {
				$days_remainder--;
			}
			if ($odd_days > 6) {
				$days_remainder--;
			}
			$datediff = ($weeks_difference * 5) + $days_remainder;
			break;

		case "ww": // Number of full weeks

			$datediff = floor($difference / 604800);
			break;

		case "h": // Number of full hours

			$datediff = floor($difference / 3600);
			break;

		case "n": // Number of full minutes

			$datediff = floor($difference / 60);
			break;

		default: // Number of full seconds (default)

			$datediff = $difference;
			break;
	}

	return $datediff;
}


function castToUInt($int) {
	return $int < 0 ? 4294967295 + $int : $int; // Cast to uint
}


function getItemType($itemType) {
	global $ArmorTypes;
	return in_array($itemType, $ArmorTypes) ? "armor" : "weapon";
}

function getTypeSlot($itemType) {
	switch ($itemType) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
			return 5;
		case 16:
		case 31:
			return 0;
		case 17:
		case 32:
			return 1;
		case 18:
		case 33:
			return 2;
		case 20:
		case 35:
			return 3;
		case 21:
		case 36:
			return 4;
		case 19:
		case 34:
			return 6;
		case 22:
			return 9;
		case 23:
			return 8;
		case 40:
			return 11;
		default:
			return -1;
	}
}

function canLinkLapis($lapis, $type) {
	$typeSlot = getTypeSlot($type);
	switch ($typeSlot) {
		case 0: // Helmet
			return $lapis["Country"] > 0;
		case 1: // Armor
			return $lapis["Attackfighter"] > 0;
		case 2: // Pants
			return $lapis["Defensefighter"] > 0;
		case 3: // Gantlet
			return $lapis["Shootrogue"] > 0;
		case 4: // Shoes
			return $lapis["Attackmage"] > 0;
		case 5: // Weapon
			return $lapis["Reqlevel"] > 0;
		case 6: // Shields
			return $lapis["Patrolrogue"] > 0;
		case 8: // Necklace
			return $lapis["Grow"] > 0;
		case 9: // Ring
		case 10:
			return $lapis["Defensemage"] > 0;
		case 11: // Loop
		case 12:
			return $lapis["ReqStr"] > 0;
		default:
			return false;
	}
}
