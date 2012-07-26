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
        $mail = $_POST['email'];
        $password = self::hashPassword($_POST['password'],$mail);
        print_r($password);
        return;
        Database::createUser($mail,$password);
    }
    
    private static function hashPassword($password,$username) {
        // Crypt with the salt. Make sure the used hashing algorithm is available!
        // Default is 6 = SHA512. Change in Config!
        return crypt($password . $username,Config::get('database','hashalgorithm') . Config::get('database','salt'));
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
    
    private static function login() {
        
    }
    
    public static function isLoggedin() {
        return true || self::$loggedin;
    }
}

?>