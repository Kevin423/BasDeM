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

if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

class User {
    private static $loggedin = false;

    public static function init() {
        session_start();
        if ( isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true ) {
            self::$loggedin = true;
        }
        
        if ( isset($_GET['action']) && $_GET['action'] == 'register' ) {
            self::register();
        }
        if ( isset($_GET['action']) && $_GET['action'] == 'login' ) {
            self::login();
        }
        
    }
    
    private static function register() {
        if ( !self::validatePost() ) {
            return;
        }
        $password = Helper::hash($_POST['password'].$_POST['email']);

        $result = Database::createUser($_POST['email'],$password);
        
        if (  $result === false || !is_numeric($result) ) {
            return;
        }
        
        $_SESSION['user']['id'] = $result;
        $_SESSION['user']['email'] = $_POST['email'];
        $_SESSION['loggedin'] = true;
        self::$loggedin = true;
    }
    
    private static function login() {
        if ( !self::validatePost() ) {
            return;
        }
        $password = Helper::hash($_POST['password'].$_POST['email']);
        
        $result = Database::getUser($_POST['email'],$password);
        
        if (  $result === false || !is_array($result) ) {
            return;
        }
        
        if (  count($result) != 1 ) {
            return;
        }
        
        $_SESSION['user']['id'] = $result[0]['id'];
        $_SESSION['user']['email'] = $result[0]['email'];
        $_SESSION['loggedin'] = true;
        self::$loggedin = true;
    }
    
    public static function logout() {
        $_SESSION = array();
        self::$loggedin = false;
    }
    
    private static function validatePost() {
        if ( !isset($_POST['email']) ) {
            return false;
        }
        if ( !isset($_POST['password']) ) {
            return false;
        }
        return true;
    }
    
    public static function isLoggedin() {
        return false || self::$loggedin;
    }
}

?>