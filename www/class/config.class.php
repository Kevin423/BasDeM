<?php
if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

class Config {
	static private $conf = array(
		'database' => array(
			'engine' => 'mysql',
			'host' => 'localhost',
			'user' => 'root',
			'password' => '',
			'database' => 'basdem',
			'salt' => 'This is my salt... it is really stupid, but long!',
		),
	);
	
	static public function get() {
		$tmp = Config::$conf;
		foreach ( func_get_args() as $arg ) {
			if ( !isset($tmp[$arg]) )
				return null;
			$tmp = $tmp[$arg];
		}
		return $tmp;
	}
}

?>