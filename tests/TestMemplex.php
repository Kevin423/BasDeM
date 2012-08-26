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

require_once('../www/class/memplex.class.php');

// for tests depending on db:
require_once('../www/class/config.class.php');
require_once('../www/class/mysql.class.php');
require_once('../www/class/user.class.php');

class TestMemplex extends PHPUnit_Framework_TestCase {

    public function testConstruct() {
        // empty Memplex
        $memplex = new Memplex();
        $this->assertEquals(0,$memplex->getId());
        $this->assertEquals(0,count($memplex->getChildren()));
        $this->assertEquals('',$memplex->getAuthor());
        $this->assertEquals('',$memplex->getTitle());
        $this->assertEquals('',$memplex->getText());
        $this->assertEquals(0,$memplex->getLayer());

        // Memplex by array
        $data = array(
            'id' => 1,
            'author' => 'testauthor',
            'title' => 'testtitle',
            'text' => 'testtext',
            'layer' => 42,
            'children' => array(2,3,4,5)
        );

        $memplex2 = new Memplex($data);
        $this->assertEquals(0,$memplex2->getId());
        $this->assertEquals(0,count($memplex2->getChildren()));
        $this->assertEquals('testauthor',$memplex2->getAuthor());
        $this->assertEquals('testtitle',$memplex2->getTitle());
        $this->assertEquals('testtext',$memplex2->getText());
        $this->assertEquals('42',$memplex2->getLayer());

        // add a Memplex to test to the db
        $memplex3 = new Memplex($data);
        $memplex3->store();

        // Mempley by ID
        $memplex4 = new Memplex(1);
        $this->assertEquals(1,$memplex4->getId());
        $this->assertEquals(0,count($memplex4->getChildren()));
        $this->assertEquals('testauthor',$memplex4->getAuthor());
        $this->assertEquals('testtitle',$memplex4->getTitle());
        $this->assertEquals('testtext',$memplex4->getText());
        $this->assertEquals('42',$memplex4->getLayer());
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
            'id' => 0,
            'author' => 'testauthor',
            'title' => 'testtitle',
            'text' => 'testtext',
            'layer' => 42,
            'children' => null
        );

        $memplex = new Memplex($data);
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
     * @dataProvider stringProvider
     */
    public function testSetAndGetAuthor($a) {
        $memplex = new Memplex();
        $this->assertEquals('',$memplex->getAuthor());

        $memplex->setAuthor($a);
        $this->assertEquals($a,$memplex->getAuthor(false));
        $this->assertEquals(htmlentities($a),$memplex->getAuthor());
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
