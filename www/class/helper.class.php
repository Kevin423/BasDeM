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
 * Helper class containing various helper methods.
 */
class Helper {

/** Returns a hash of the given string. The hashing method is defined in Config, default is SHA512.
 * @param string $string String to hash.
 * @return Hash of the string.
 */
    public static function hash($string) {
        self::canHash();
        
        // Crypt with the salt. Make sure the used hashing algorithm is available!
        // Default is 6 = SHA512. Change in Config!
        $hash = crypt($string,Config::get('database','hashalgorithm') . Config::get('database','salt'));
        
        // Select the password itself.
        return substr($hash,strlen(Config::get('database','hashalgorithm')) + 17);
    }

/** Checks if the selected hashing algorithm is available.
 * @return True, if hashing works with the current Config settings. Else we die here.
 */
    public static function canHash() {
        switch ( substr(Config::get('database','hashalgorithm'),1,1) ) {
            case '5': 
                if ( CRYPT_SHA256 != 1 ) {
                    die('Das System unterstützt den ausgewählten Hashalgoritmus nicht.');
                }
            break;
            case '6': 
                if ( CRYPT_SHA512 != 1 ) {
                    die('Das System unterstützt den ausgewählten Hashalgoritmus nicht.');
                }
            break;
            default:
                die('Sie haben einen nicht unterstützten Hashalgorithmus ausgesucht.');
            break;
        } 
        return true;
    }
}
?>
