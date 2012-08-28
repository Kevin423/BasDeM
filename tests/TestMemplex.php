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
require_once(__DIR__ . '/../www/class/memplex.register.class.php');

// for tests depending on db:
require_once(__DIR__ . '/../www/class/config.class.php');
require_once(__DIR__ . '/../www/class/mysql.class.php');
require_once(__DIR__ . '/../www/class/user.class.php');

class TestMemplex extends PHPUnit_Framework_TestCase {
    private $mock_db;

    public function setUp() {
        $_SESSION['loggedin'] = true;
        $_SESSION['user'] = array();
        $_SESSION['user']['id'] = 'testauthor';
        $_SESSION['user']['email'] = 'test@basdem.de';

        $this->mock_db = $this->getMock('Database');
        MemplexRegister::setDatabase($this->mock_db);
    }


    public function testConstruct() {
        // mock database
        $this->mock_db
            ->staticExpects($this->any())
            ->method('getMemplex')
            ->with(1)
            ->will($this->returnValue(array($this->getTestDataArray(1))));
        
        

        // Memplex by ID
        $memplex4 = MemplexRegister::load(1);
        $this->assertEquals(1,$memplex4->getId());
        $this->assertEquals(0,count($memplex4->getChildren()));
        $this->assertEquals('testuser',$memplex4->getAuthor());
        $this->assertEquals('testtitle',$memplex4->getTitle());
        $this->assertEquals('testtext',$memplex4->getText());
        $this->assertEquals('42',$memplex4->getLayer());
    }

    public function testConstructEmpty() {
        // empty Memplex
        $memplex = new Memplex();
        $this->assertEquals(0,$memplex->getId());
        $this->assertEquals(0,count($memplex->getChildren()));
        $this->assertEquals('Anonym',$memplex->getAuthor());
        $this->assertEquals('',$memplex->getTitle());
        $this->assertEquals('',$memplex->getText());
        $this->assertEquals(0,$memplex->getLayer());
    }

    private function getTestDataArray($id=NULL) {
        $data = array();
        if(!is_null($id)) $data['id'] = $id;
        $data['author'] = 'testuser';
        $data['authorid'] = 1;
        $data['state'] = 1;
        $data['title'] = 'testtitle';
        $data['text'] = 'testtext';
        $data['layer'] = 42;
        $data['children'] = array(2,3,4,5);
        $data['favored'] = 0;
        $data['selffavored'] = 0;
        return $data;
    }

    private function getTestMemplex($id=NULL) {
        return MemplexRegister::load($this->getTestDataArray($id));
    }

    public function testSetupWithValues() {
        // Memplex by array
        $memplex = MemplexRegister::load($this->getTestDataArray(1));
        $this->assertEquals(1,$memplex->getId());
        $this->assertEquals(0,count($memplex->getChildren()));
        $this->assertEquals('testuser',$memplex->getAuthor());
        $this->assertEquals('testtitle',$memplex->getTitle());
        $this->assertEquals('testtext',$memplex->getText());
        $this->assertEquals('42',$memplex->getLayer());
    }

    public function testStoreCreate() {
        // mock database
        $mock = $this->getMock('Database', array('createMemplex'), array(), 'DatabaseMock');
        $mock
            ->staticExpects($this->once())
            ->method('createMemplex')
            ->will($this->returnValue(1));

        MemplexRegister::setDatabase($mock);

        // 
        $memplex = MemplexRegister::load(array());
        $this->assertEquals(1, $memplex->store());
    }

    public function testStoreUpdate() {
        // mock database
        $database = $this->getMock('Database', array('storeMemplex'));
        $database
            ->staticExpects($this->once())
            ->method('storeMemplex')
            ->will($this->returnValue(1));
        
        MemplexRegister::setDatabase($database);

        $memplex3 = MemplexRegister::load(array('id' => 1));
        $this->assertEquals(1, $memplex3->store());
    }

    public function testIsNew() {
        $memplex1 = $this->getTestMemplex();
        $this->assertTrue($memplex1->isNew());
        $memplex2 = $this->getTestMemplex(1);
        $this->assertFalse($memplex2->isNew());
    }


    public function testSetId_accepts_only_numeric() {
        $memplex = new Memplex();
        $memplex->setId('non numeric');
        $this->assertEquals(null, $memplex->getId());
    }

    public function testLoadChildrenRecursive() {
        // TODO
    }

    public function testStore() {
        // TODO
    }

    public function testToArray() {
        $data = array(
            'id' => 23,
            'author' => 'testauthor',
            'title' => 'testtitle',
            'text' => 'testtext',
            'layer' => 42,
            'children' => array(1,2,3,4)
        );

        $expected = array(
            'id' => 23,
            'author' => array(
                'nick' => 'testauthor',
                'id' => null
            ),
            'title' => 'testtitle',
            'text' => 'testtext',
            'layer' => 42,
            'children' => array(),
            'moderationstate' => null,
            'favored' => 0,
            'selffavored' => 0
        );

        $memplex = MemplexRegister::load($data);
        $result = $memplex->toArray();

        $this->assertEquals($expected,$result);
    }

    /**
     * @dataProvider integerProvider
     */
    public function testSetAndGetId($a) {
        $memplex = new Memplex();
        $this->assertEquals(0,$memplex->getId());

        $memplex->setId($a);
        $this->assertEquals($a,$memplex->getId());
    }

    public function testAddChildAndGetChildren() {
        $memplex = new Memplex();
        $this->assertEquals(0,count($memplex->getChildren()));

        // TODO: adding children, requires db
    }

    /**
     * @dataProvider authorProvider
     */
    public function testSetAndGetAuthor($val, $expect) {
        $memplex = new Memplex();
        $this->assertEquals('Anonym',$memplex->getAuthor());

        $memplex->setAuthor($val);
        $this->assertEquals($expect,$memplex->getAuthor(false));
        $this->assertEquals(htmlentities($expect),$memplex->getAuthor());
    }

    /**
     * @dataProvider stringProvider
     */
    public function testSetAndGetTitle($a) {
        $memplex = new Memplex();
        $this->assertEquals('',$memplex->getTitle());

        $memplex->setTitle($a);
        $this->assertEquals($a,$memplex->getTitle(false));
        $this->assertEquals(htmlentities($a),$memplex->getTitle());
    }

    /**
     * @dataProvider stringProvider
     */
    public function testSetAndGetText($a) {
        $memplex = new Memplex();
        $this->assertEquals('',$memplex->getText());

        $memplex->setText($a);
        $this->assertEquals($a,$memplex->getText(false));
        $this->assertEquals(htmlentities($a),$memplex->getText());
    }

    /**
     * @dataProvider integerProvider
     */
    public function testSetAndGetLayer($a) {
        $memplex = new Memplex();
        $this->assertEquals(0,$memplex->getLayer());

        $memplex->setLayer($a);
        $this->assertEquals($a,$memplex->getLayer());
    }


/* Data providers */

    public function authorProvider() {
        return array(
            array('', 'Anonym'),
            array('test', 'test'),
            array('äöüß', 'äöüß'),
            array('<br/>', '<br/>')
        );
    }

    public function stringProvider() {
        return array(
            array(''),
            array('test'),
            array('äöüß'),
            array('<br/>')
        );
    }

    public function integerProvider() {
        return array(
            array(0),
            array(8),
            array(42)
        );
    }
}
?>
