<?php
//
// Consuming XML
//

$doc = new DOMDocument();

$doc->preserveWhiteSpace = false;

// source: http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=d28b12f464151310VgnVCM1000003dd60f89RCRD&vgnextchannel=1a66e03bb8d1e310VgnVCM10000071d60f89RCRD
$doc->load('../xml/locations.xml');

$root = $doc->documentElement;

$locationNodes = $root->getElementsByTagName('Location');