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

/****************************************************************************************
 * This Source Code Form is subject to the terms of the Mozilla Public                  *
 * License, v. 2.0. If a copy of the MPL was not distributed with this                  *
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.                             *
 ****************************************************************************************/

if ( !defined('INCMS') || INCMS !== true ) {
    define('INCMS',true);
}

require_once(__DIR__ . '/../www/class/memplex.class.php');
require_once(__DIR__ . '/../www/class/user.class.php');
require_once(__DIR__ . '/../www/class/memplex.register.class.php');

class TestMemplexRegister extends PHPUnit_Framework_TestCase {
    private $mock;

    /**
     * setup system under test and mocked db
     */
    public function setUp() {
        // setup test session
        $_SESSION['loggedin'] = true;
        $_SESSION['user'] = array();
        $_SESSION['user']['id'] = '1';
        $_SESSION['user']['email'] = 'test@basdem.de';

        // reset register before each test
        MemplexRegister::reset();
    }

    public function testLoad() {
        // setup mocked db
        $this->mock = $this->getMock('Database', array('getMemplex'));
        
        // stub database queries
        $this->mock
            ->expects($this->once())
            ->method('getMemplex')
            ->with(1, 1)
            ->will($this->returnValue(array($this->getTestData(1))));

        MemplexRegister::setDatabase($this->mock);

        // test load
        $memplex = MemplexRegister::load(1);
        $this->assertEquals(1, $memplex->getId());
        $this->assertEquals('testuser', $memplex->getAuthor());
        $this->assertEquals('testtitle', $memplex->getTitle());
    }

    public function testGetEmptyMemplex() {
        $empty1 = MemplexRegister::getEmptyMemplex();
        $empty2 = MemplexRegister::load();
        $empty3 = new Memplex(); 
        $this->assertEquals($empty1, $empty2);
        $this->assertEquals($empty2, $empty3);
    }

    public function testGetAndReg() {
        // setup mocked db
        $this->mock = $this->getMock('Database', array('getMemplex'));
        
        // stub database queries
        $this->mock
            ->expects($this->once())
            ->method('getMemplex')
            ->with(23, 1)
            ->will($this->returnValue(array($this->getTestData(23))));

        MemplexRegister::setDatabase($this->mock);
        
        $register = new memplexRegister();
        
        $this->assertEquals(null, MemplexRegister::get('something non numeric'));

        MemplexRegister::register($this->getTestMemplex(42));
        $this->assertEquals(42, MemplexRegister::get(42)->getId());
        $this->assertEquals('testtitle', MemplexRegister::get(42)->getTitle());

        $memplex3 = MemplexRegister::get(23);
        $this->assertEquals(23, $memplex3->getId());
        $this->assertEquals('testtitle', $memplex3->getTitle());
        $this->assertEquals('testuser', $memplex3->getAuthor());
    }

    public function testRegister() {
        $memplex1 = $this->getTestMemplex(1);
        MemplexRegister::register($memplex1);
        $this->assertEquals($memplex1, MemplexRegister::get(1));
        $this->assertEquals(1, $memplex1->getId());

        $memplex2 = $this->getTestMemplex(2);
        MemplexRegister::register($memplex2);
        $this->assertEquals($memplex2, MemplexRegister::get(2));
        $this->assertEquals(2, $memplex2->getId());
    }

    public function testGet() {

    }

    /**
     * @expectedException MemplexNotFoundException
     */
    public function testGetNonExistent() {
        // setup mocked db
        $this->mock = $this->getMock('Database', array('getMemplex'));
        
        // stub database queries
        $this->mock
            ->expects($this->once())
            ->method('getMemplex')
            ->with(1, 1)
            ->will($this->returnValue(array()));

        MemplexRegister::setDatabase($this->mock);

        // this call should throw a MemplexNotFoundException
        // when the Database return an empty resultset:
        MemplexRegister::get(1);
    }

    private function getTestData($id=NULL) {
        $data = array();
        if(!is_null($id)) $data['id'] = $id;
        $data['author'] = 'testuser';
        $data['authorid'] = 1;
        $data['state'] = 1;
        $data['title'] = 'testtitle';
        $data['text'] = 'testtext';
        $data['layer'] = 1;
        $data['favored'] = 0;
        $data['selffavored'] = 0;
        return $data;
    }

    private function getTestMemplex($id=NULL) {
        return MemplexRegister::load($this->getTestData($id));
    }
}
?>
