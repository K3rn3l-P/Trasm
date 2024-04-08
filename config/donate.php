<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/config/config.php");

$uid = $_GET['uid'];
$dp = $_GET['currency'];
$type = $_GET['type'];
$ref = $_GET['ref'];
$status = $_GET['status'];

if (isset($_GET['method'])) {
    $method = $_REQUEST['method'];
} else {
    $method = 'Unset';
}

if (isset($_GET['time'])) {
    $time = $_GET['time'];
} else{
    $time = date('Y-m-d H:i:s');
}

$ip = ip2long($userip);
$checkMin = ip2long('216.127.71.0');
$checkMax = ip2long('216.127.71.255');

if (($ip >= $checkMin) && ($ip <= $checkMax)){

	$querytxn = $conn->prepare('SELECT Ref FROM PS_WebSite.dbo.Payments WHERE Ref= ? AND uid = ?');
    $querytxn->bindValue(1, $ref, PDO::PARAM_INT);
    $querytxn->bindValue(2, $uid, PDO::PARAM_INT);
    $querytxn->execute();
	$txn = $querytxn->FETCH(PDO::FETCH_NUM);
    
    if ($txn[0] == NULL){
        
        echo "OK";
		
        $query = $conn->prepare("UPDATE PS_UserData.dbo.Users_Master SET Point += ? WHERE UserUID = ?");
        $query->bindValue(1, $dp, PDO::PARAM_INT);
        $query->bindValue(2, $uid, PDO::PARAM_INT);
        $query->execute();	

        $query1 = $conn->prepare("INSERT INTO PS_WebSite.dbo.Payments (Ref, uid, point, method, date, status) VALUES (?, ?, ?, ?, ?, 'Delivered')");
        $query1->bindValue(1, $ref, PDO::PARAM_INT);
        $query1->bindValue(2, $uid, PDO::PARAM_INT);
        $query1->bindValue(3, $dp, PDO::PARAM_INT);
        $query1->bindValue(4, $method, PDO::PARAM_INT);
        $query1->bindValue(5, $time, PDO::PARAM_INT);
		$query1->bindValue(6, $status, PDO::PARAM_INT);
        $query1->execute();
		
		// Add extra reward
		if ($method == "E-Wallet") {
			$itemID = 0;
			$itemCount = 0;
			
			// FROM LARGER TO SMALLER!
			if ($dp >= 6250) {
				$itemID = 25165;
				$itemCount = 255;
			} else if ($dp >= 4500) {
				$itemID = 100001;
				$itemCount = 15;
			} else if ($dp >= 2875) {
				$itemID = 100001;
				$itemCount = 10;
			} else if ($dp >= 1375) {
				$itemID = 100001;
				$itemCount = 5;
			} else if ($dp >= 500) {
				$itemID = 100001;
				$itemCount = 2;
			} else if ($dp >= 250) {
				$itemID = 100001;
				$itemCount = 1;
			}
			
			// Reward exists
			if ($itemID && $itemCount) {
				// Find free bank slot
				$odbcResult = odbc_exec($odbcConn, "SELECT Slot FROM PS_Billing.dbo.Users_Product WHERE UserUID=$UserUID ORDER BY Slot");
				$slot = 0;
				while ($row = odbc_fetch_array($odbcResult)) {
					if ($row["Slot"] != $slot) 
						break;
					$slot++;
				}
				// Have free slots
				if ($slot < 240) {
					// Add item to bank
					odbc_exec($odbcConn, "INSERT INTO PS_Billing.dbo.Users_Product (UserUID, Slot, ItemID, ItemCount, ProductCode, BuyDate) VALUES ($uid, $slot, $itemID, $itemCount, 'Donate reward', CURRENT_TIMESTAMP)");
				}
			}
		}
        
  
	} elseif ($type == 2) {
        
        echo "OK";
        
        $query = $conn->prepare("UPDATE PS_UserData.dbo.Users_Master SET Point += ? WHERE UserUID = ?");
        $query->bindValue(1, $dp, PDO::PARAM_INT);
        $query->bindValue(2, $uid, PDO::PARAM_INT);
        $query->execute();	
        
        $query1 = $conn->prepare("UPDATE PS_WebSite.dbo.Payments SET status = 'Chargeback' WHERE Ref = ?");
        $query1->bindValue(1, $ref, PDO::PARAM_INT);
        $query1->bindValue(2, $uid, PDO::PARAM_INT);
        $query1->bindValue(3, $dp, PDO::PARAM_INT);
        $query1->bindValue(4, $method, PDO::PARAM_INT);
        $query1->bindValue(5, $time, PDO::PARAM_INT);
		$query1->bindValue(6, $status, PDO::PARAM_INT);
        $query1->execute();
    }
}
