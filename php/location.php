<?php
//
//	Returning all info for the selected location
//

require_once 'xml.php';

if (!isset($_GET['id']) && empty($_GET['id'])) {
	echo 'An unexpected error occurred';
	exit();
}

// query string id
$id = $_GET['id'];

header('Content-Type: application/json');

foreach ($locationNodes as $l) {

	// find the Location node with the matching id
	if ($l->firstChild->nodeValue == $id) {
		$facilityNodes = $l->getElementsByTagName('Facility');

		// get info about location's facilities
		$facilities = array();
		foreach ($facilityNodes as $f) {
			$arr = array(
				'type' => $f->getElementsByTagName('FacilityType')->item(0)->nodeValue, 
				'name' => $f->getElementsByTagName('FacilityDisplayName')->item(0)->nodeValue,
			);

			$facilities[] = $arr;
		}

		// response
		echo '{"data": [';
		echo json_encode(array(
			'name'       => ucwords(strtolower($l->getElementsByTagName('LocationName')->item(0)->nodeValue)),
			'address'    => $l->getElementsByTagName('Address')->item(0)->nodeValue,
			'pcode'      => $l->getElementsByTagName('PostalCode')->item(0)->nodeValue,
			'facilities' => $facilities
		));
		echo ']}';
	}
}