<?php
/****************************************************************************************
 * Copyright (c) 2012 Justus Wingert <justus_wingert@web.de>                            *
 *                                                                                      *
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

/****************************************************************************************
 * This Source Code Form is subject to the terms of the Mozilla Public                  *
 * License, v. 2.0. If a copy of the MPL was not distributed with this                  *
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.                             *
 ****************************************************************************************/

if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

/**
 * Manages config settings.
 */
class Config {
	static private $conf = null;
    
    /**
    * Returns specific parts of the config or the config array itself.
    * @param ... Various keys to look up in the array.
    *
    * Config array layout:
    * Key 'database' which itself contains an array with keys 'engine', 'host', 'user',
    * 'password', 'database' and 'salt'.
    *
    * @return Excerpts of the config array or a copy of the array itself.
    * 
    * Examples:
    * - get(); // returns the config array
    * - get('database'); // returns the database array
    * - get('database','host'); // returns the host
    */	
	static public function get() {
        if ( is_null(self::$conf) ) {
            self::load();
        }
		$tmp = Config::$conf;
		foreach ( func_get_args() as $arg ) {
			if ( !isset($tmp[$arg]) )
				return null;
			$tmp = $tmp[$arg];
		}
		return $tmp;
	}
    
    static private function load() {
        require_once('conf.php');
        self::$conf = $conf;
    }
}

?>
