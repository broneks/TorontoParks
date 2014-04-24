<?php
//
// Response to AJAX
//

require_once 'xml.php';

// create info array containing all park ids, names and addresses
$info = array();
foreach ($locationNodes as $l) {
	$info[] = array(
		'id'      => $l->firstChild->nodeValue,
		'name'    => strtolower($l->getElementsByTagName('LocationName')->item(0)->nodeValue),
		'address' => strtolower($l->getElementsByTagName('Address')->item(0)->nodeValue)
	);
}

// read ajax request
$contents = file_get_contents('php://input');

// get contents of ajax request
$objData  = json_decode($contents);
$searchBy = $objData->searchBy;
@$data    = strtolower($objData->data);
@$substr  = substr($data, 1);

// set return type to json
header('Content-Type: application/json');

// if an empty object was sent by ajax, prompt the user for input
if (!$data) {
	echo '{"data":[';
	echo json_encode(array('error' => 'Please input something'));
	echo ']}';
	exit();
} 
elseif ($data === '*') {
	echo '{"data":';
	echo json_encode($info);
	echo '}';
	exit();
}
elseif (is_numeric($substr) && $substr < count($info)) {
	echo '{"data":';
	echo json_encode(array_slice($info, 0, $substr, true));
	echo '}';
	exit();
}

// otherwise, find and return the parks that (partially) match the search words
echo '{"data":[';
array_filter($info, function($infoArray) use ($data, $searchBy) {
	if (strpos($infoArray[$searchBy], $data) !== false) {
		echo json_encode(array(
			'id'      => (int) $infoArray['id'], 
			'name'    => $infoArray['name'],
			'address' => $infoArray['address']
		));
		echo ',';
	}
});
echo '""]}';