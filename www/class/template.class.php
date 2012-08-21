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
 * Loads and prints HTML templates.
 */
class Template {
/** Known templates. */
    private $assignments = array(
        'index' => 'tpl/index.html',
        'default' => 'tpl/default.html',
        'load' => 'tpl/load.html',
        'noload' => '',
        'settings' => 'tpl/settings.html',
        'login' => 'tpl/login.html',
        'loginerror' => 'tpl/loginerror.html',
        'register' => 'tpl/register.html',
    );
    private $base = '';
    private $adder = array();
    private $output = '';

/**
 * Loads the given templates. All templates can be found in the www/tpl/ directory.
 * To select a template use the file name without '.html'.
 * @param $base String naming base template to load.
 * @param $adder Array of further templates to append to $base.
 */
    public function __construct($base,$adder = null,$addString = null) {
        if ( !isset($this->assignments[$base]) ) {
            return;
        }
        
        $this->base = file_get_contents($this->assignments[$base]);
        
        if ( !is_null($adder) && is_array($adder) ) {
            foreach ( $adder as $add ) {
                if ( !isset($this->assignments[$add]) ) {
                    return;
                }
                if ( empty($this->assignments[$add]) ) {
                    $this->adder[] = '';
                    continue;
                }
                $this->adder[] = file_get_contents($this->assignments[$add]);
            }
            if ( count($this->adder) == 0 && is_string($addString) ) {
                $this->adder[] = $addString;
            }
            $this->output = vsprintf($this->base,$this->adder);
            return;
        }
        $this->output = $this->base;
    }
    
/** Replace the given needle or needle array with the given replacer or replacer array in the output string.
 * @param $search String/Array needle.
 * @param $replace String/Array replace.
 */
    public function replace($needle,$replace) {
        $this->output = str_replace($needle,$replace,$this->output);
    }

/**
 * Returns the loaded template.
 * @return The resulting template as a string.
 */
    public function __toString() {
        return $this->output;
    }
}
?>
