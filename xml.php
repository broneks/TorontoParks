<?php
//
// Consuming XML
//

$doc = new DOMDocument();

$doc->preserveWhiteSpace = false;
$doc->load("xml/locations.xml");

$root = $doc->documentElement;

$locations = $root->getElementsByTagName("Location");

$names = array();
foreach ($locations as $l) {
	$names[] = array(
		'id'      => $l->firstChild->nodeValue,
		'name'    => strtolower($l->getElementsByTagName("LocationName")->item(0)->nodeValue),
		'address' => strtolower($l->getElementsByTagName("Address")->item(0)->nodeValue)
	);
}