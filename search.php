<?php
//
// Response to AJAX
//

require_once "xml.php";

$contents = file_get_contents("php://input");

$objData = json_decode($contents);
@$data = strtolower($objData->data);

header('Content-Type: application/json');

if (!$data) {
	echo '{"data":[';
	echo json_encode(array("error" => "Please input something"));
	echo ']}';
	exit();
}

echo '{"data":[';
array_filter($names, function($namesArray) use ($data) {
	if (strpos($namesArray['address'], $data) !== false) {
		echo json_encode(array(
			"id"      => (int) $namesArray['id'], 
			"name"    => $namesArray['name'],
			"address" => $namesArray['address']
		));
		echo ",";
	}
});
echo '{}]}';