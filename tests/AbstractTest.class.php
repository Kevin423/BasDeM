<?php
/****************************************************************************************
 * Copyright (c) 2012 Justus Wingert <justus_wingert@web.de>                            *
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

require_once(__DIR__ . '/../www/class/controller.class.php');
require_once(__DIR__ . '/../www/class/memplex.class.php');
require_once(__DIR__ . '/../www/class/memplex.register.class.php');

// for tests depending on db:
require_once(__DIR__ . '/../www/class/config.class.php');
require_once(__DIR__ . '/../www/class/mysql.class.php');
require_once(__DIR__ . '/../www/class/user.class.php');

abstract class AbstractTest extends PHPUnit_Framework_TestCase {
  
  /**
   * return test data
   *
   * @see TestMemplex
   * @see TestController
   * @return array
   */
  protected final function getTestDataArray($id=NULL) {
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
  
  /**
   * set test memplex as HTTP POST request data
   *
   * @see TestController
   * @return array
   */
  protected final function set_test_memplex_postdata() {
    foreach($this->get_memplex_testdata() as $kk => $vv) {
      $_POST[$kk] = $vv;
    }
    return $_POST;
  }

  /**
   * get memplex testdata
   *
   * @see TestController
   * @return array
   */
  protected final function get_memplex_testdata() {
    $data = array();
    $data['id'] = 100;
    $data['parent'] = 1; 
    $data['text'] = 'testtext'; 
    $data['layer'] = 1; 
    $data['loadid'] = 200;
    $data['title'] = 'testtitle';
    return $data;
  }

  /**
   *  reset HTTP POST request data
   * 
   * @see TestController
   */
  protected final function reset_postdata() {
    // reset post
    $_POST = array();
  }

  protected final function start_controller_ob() {
    ob_start();
    $ctrl = new Controller();
    $result = ob_get_clean();
    return $result;
  }  
}

