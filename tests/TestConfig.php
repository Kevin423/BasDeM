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

define('INCMS',true);

require_once('../www/class/config.class.php');

class TestConfig extends PHPUnit_Framework_TestCase {

    public function testGet() {
        $this->assertEquals(1,count(Config::get()));
        $this->assertEquals(6,count(Config::get('database')));
        $this->assertEquals('mysql',Config::get('database','engine'));
        $this->assertEquals('localhost',Config::get('database','host'));
        $this->assertEquals('root',Config::get('database','user'));
        $this->assertEquals('',Config::get('database','password'));
        $this->assertEquals('basdem',Config::get('database','database'));
        $this->assertEquals('This is my salt... it is really stupid, but long!',Config::get('database','salt'));
    }
}
?>
