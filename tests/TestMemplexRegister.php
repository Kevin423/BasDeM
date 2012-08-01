<?php
/****************************************************************************************
 * Copyright (c) 2012 Sven Krohlas <sven@getamarok.com>                                 *
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
    define('INCMS',true);
}

require_once('../www/class/memplex.class.php');
require_once('../www/class/memplex.register.class.php');

class TestMemplexRegister extends PHPUnit_Framework_TestCase {

    public function testGetAndReg() {
        $register = new memplexRegister();
        $memplex = new Memplex();
        $this->assertEquals(null,$register->get('something non numeric'));

        // TODO: numeric, non existing get, requires DB

        $memplex->setId(0);
        $register->reg($memplex);
        $this->assertEquals(0,$register->get(0)->getId());

        $memplex2 = new memplex();
        $memplex2->setId(42);
        $register->reg($memplex2);
        $this->assertEquals(42,$register->get(42)->getId());
    }
}
?>
