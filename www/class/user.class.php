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

/****************************************************************************************
 * This Source Code Form is subject to the terms of the Mozilla Public                  *
 * License, v. 2.0. If a copy of the MPL was not distributed with this                  *
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.                             *
 ****************************************************************************************/

if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

/**
 * Class managing a user session and logins.
 */
class User {
    private static $loggedin = false;
    private static $error = '';

    /**
     * Starts a new session and initializes the object.
     */
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

    /**
     * Registers a new user.
     */
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

    /**
     * Logs a user in.
     */
    private static function login() {
        if ( !self::validatePost() ) {
            return;
        }
        $password = Helper::hash($_POST['password'].$_POST['email']);
        
        $result = Database::getUser($_POST['email'],$password);
        
        if (  $result === false || !is_array($result) ) {
            self::setError('Unbekannter Benutzername oder Passwort!<br>');
            return;
        }
        
        if (  count($result) != 1 ) {
            self::setError('Unbekannter Benutzername oder Passwort!<br>');
            return;
        }
        
        $_SESSION['user']['id'] = $result[0]['id'];
        $_SESSION['user']['email'] = $result[0]['email'];
        $_SESSION['loggedin'] = true;
        self::$loggedin = true;
    }

    /**
     * Logs the current user out.
     */
    public static function logout() {
        $_SESSION = array();
        self::$loggedin = false;
    }

    /**
     * Checks if a necessary POST data has been sent with the request: email and password are required.
     * @return False if something is missing, else true.
     */
    private static function validatePost() {
        if ( !isset($_POST['email']) ) {
            self::setError('Unbekannter Benutzername oder Passwort!<br>');
            return false;
        }
        if ( !isset($_POST['password']) ) {
            self::setError('Unbekannter Benutzername oder Passwort!<br>');
            return false;
        }
        return true;
    }

    /**
     * Returns the current user ID.
     * @return Current user ID.
     */
    public static function getId() {
        return $_SESSION['user']['id'];
    }

    /**
     * Returns the current login status.
     * @return True if logged in, else false.
     */
    public static function isLoggedin() {
        return self::$loggedin;
    }
    
    /**
     * Returns the user moderator status.
     * TODO: Dummy function.
     * @return True if moderator, else false.
     */
    public static function isModerator() {
        return true;
    }
    
    private static function setError($error) {
        self::$error .= $error;
    }
    
    /**
     * Returns the error string.
     * @return String Errordescription.
     */
    public static function getError() {
        return self::$error;
    }
    
    /**
     * Returns wether an error exists.
     * @return Boolean True if error exists.
     */
    public static function hasError() {
        return !empty(self::$error);
    }
}

?>
