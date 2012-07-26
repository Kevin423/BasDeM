<?
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

class Template {
    private $assignments = array(
        'index' => 'tpl/index.html',
        'default' => 'tpl/default.html',
        'load' => 'tpl/load.html',
        'noload' => '',
        'login' => 'tpl/login.html',
        'register' => 'tpl/register.html',
    );
    private $base = '';
    private $adder = array();
    private $output = '';
    
    public function __construct($base,$adder = null) {
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
            $this->output = vsprintf($this->base,$this->adder);
            return;
        }
        $this->output = $this->base;
    }
    
    public function __toString() {
        return $this->output;
    }
}
?>