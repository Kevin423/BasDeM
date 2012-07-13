<?php
/****************************************************************************************
 * Copyright (c) 2012 Justus Wingert <justus_wingert@web.de>                            *
 *
 * This file is part of BasDeM.                                                         *
 *                                                                                      *
 * BasDeM is free software; you can redistribute it and/or modify it under              *
 * the terms of the GNU General Public License as published by the Free Software        *
 * Foundation; either version 3 of the License, or (at your option) any later           *
 * version.                                                                             *
 *                                                                                      *
 * BasDeM is distributed in the hope that it will be useful, but WITHOUT ANY            *
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A      *
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.             *
 *                                                                                      *
 * You should have received a copy of the GNU General Public License along with         *
 * BasDeM. If not, see <http://www.gnu.org/licenses/>.                                  *
 ****************************************************************************************/

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
