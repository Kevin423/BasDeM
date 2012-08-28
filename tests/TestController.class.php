<?php
/****************************************************************************************
 * Copyright (c) 2012 defel <defel@gmx.de>                                              *
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

require_once(__DIR__ . '/AbstractTest.class.php');

class TestController extends AbstractTest {

  public function setUp() {
    $this->reset_postdata();

    $this->mock_db = $this->getMock('Database');
    $this->mock_db
      ->staticExpects($this->any())
      ->method('getMemplex')
      ->will($this->returnCallback(function($id) {
        $data = array();
        $data['id'] = $id;
        $data['author'] = 'testuser';
        $data['authorid'] = 1;
        $data['state'] = 1;
        $data['title'] = 'testtitle';
        $data['text'] = 'testtext';
        $data['layer'] = 42;
        $data['children'] = array(2,3,4,5);
        $data['favored'] = 0;
        $data['selffavored'] = 0;

        return array(
          $data
        );
      }));

    MemplexRegister::setDatabase($this->mock_db);

    $_SESSION['loggedin'] = true;
    $_SESSION['user'] = array();
    $_SESSION['user']['id'] = 'testauthor';
    $_SESSION['user']['email'] = 'test@basdem.de';
    $_SESSION['user']['moderator'] = 0;
    $_SESSION['user']['supermoderator'] = 0;
  }

  public function testController_should_be_constructable() {
    ob_start();
    $ctrl = new Controller();
    ob_end_clean();
  }

  public function testConstructor_should_return_success_false_on_empty() {
    $result = $this->start_controller_ob();
    $this->assertEquals($result, json_encode(array('success' => false)));
  }

  public function testController_should_get_memplex_when_id_isset() {
    $this->set_test_memplex_postdata();
    $result = $this->start_controller_ob();
    $result_data = json_decode($result);
    $this->assertTrue($result_data->success);
    $this->assertEquals(100, $result_data->createdid);
    $this->assertEquals(200, $result_data->data->id);
    $this->assertEquals('testuser', $result_data->data->author->nick);
    $this->assertEquals('testtitle', $result_data->data->title);
  }

  public function TestController_should_create_memplex_when_no_id_isset() {
    $this->set_test_memplex_postdata();
    $result = $this->start_controller_ob();
    $result_data = json_decode($result);

    $this->mock_db
      ->staticExpects($this->once())
      ->method('createMemplex');

    $this->assertTrue($result_data->success);
    $this->assertEquals(100, $result_data->createdid);
    $this->assertEquals(200, $result_data->data->id);
    $this->assertEquals('testuser', $result_data->data->author->nick);
    $this->assertEquals('testtitle', $result_data->data->title);
  }
}

?>