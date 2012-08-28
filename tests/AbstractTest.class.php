<?php

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

