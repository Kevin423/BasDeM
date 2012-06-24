<?php
define('INCMS',true);
define('NL',"<br>\r\n");
error_reporting("E_ALL & ~E_DEPRECATED & ~E_STRICT");

require_once('class/config.class.php');
require_once('class/mysql.class.php');
require_once('class/memplex.class.php');

Database::init();

$memplex = new Memplex(1);

?>