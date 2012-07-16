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

if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

/**
 * An array containing Memplex objects.
 */
class MemplexRegister {
    private static $memplexlist = array();
    
    /**
     * Returns the Memplex identified by $id and automatically registers it.
     * No database access is needed if the Memplex has alredy been registered using reg().
     *
     * @param $id ID of the Memplex to load.
     *
     * @return null if the ID is not numeric, the Memplex to load if the ID is valid
     * or an empty Memplex if the ID does not yet exist.
     */
    public static function get($id) {
        if ( !is_numeric($id) ) {
            return null;
        }
        if ( !isset(self::$memplexlist[$id]) ) {
            self::$memplexlist[$id] = new Memplex($id);
        }
        return self::$memplexlist[$id];
    }
    
    /**
     * Registers a new Memplex.
     *
     * @param Memplex $memplex The Memplex to register.
     */
    public static function reg($memplex) {
        self::$memplexlist[$memplex->getId()] = $memplex;
    }
}

?>
