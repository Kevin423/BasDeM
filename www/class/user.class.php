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
     * Update the User Object based on POST data.
     */
    public static function update() {
        if ( isset($_POST['nickname']) ) {
            self::setNickname($_POST['nickname']);
        } 
        if ( isset($_POST['password'])
            && isset($_POST['password2'])
            && isset($_POST['passwordold'])
            && !empty($_POST['password'])
            && !empty($_POST['password2'])
            && !empty($_POST['passwordold'])
            && $_POST['password'] == $_POST['password2'] ) {
            
            $passwordold = Helper::hash($_POST['passwordold'].self::getEmail());
            
            $result = Database::getUser(self::getEmail(),$passwordold);
            
            if ( $result === false || !is_array($result) ) {
                self::setError('Falsches Passwort!<br>');
                return;
            }
            
            if ( count($result) != 1 ) {
                self::setError('Falsches Passwort!<br>');
                return;
            }
            
            $password = Helper::hash($_POST['password'].self::getEmail());
            $success = Database::setPassword(self::getId(),$passwordold,$password);
            
            self::setError('Passwort ge&auml;ndert!<br>');
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
        
        $verified = md5($_POST['email'].$password.microtime(true));
        
        $result = Database::createUser($_POST['email'],$password,$verified);
        
        if (  $result === false || !is_numeric($result) ) {
            return;
        }
        
        $_SESSION['user']['id'] = $result;
        $_SESSION['user']['email'] = $_POST['email'];
        $_SESSION['loggedin'] = true;
        self::$loggedin = true;
        
        self::registerMail($verified);
    }

    /**
     * Send Registration Mail.
     */
    private static function registerMail($key) {
        $header = 'From: webmaster@basdem.de' . "\r\n" .
                'Reply-To: webmaster@basdem.de' . "\r\n" .
                'X-Mailer: PHP/' . phpversion();
    
        mail(
            self::getEmail(),
            'Registration auf BasDeM.de',
            'Hallo,' . "\r\n"
            . 'du hast dich erfolgreich auf BasDeM.de angemeldet. Bitte verifiziere deinen Account mit einem Klick auf folgenden Link:' . "\r\n"
            . 'http://www.basdem.de/demo/index.php?action=verify&key=' . $key . '' . "\r\n"
            . 'Wir danken fuer deine Mitarbeit und wuenschen dir viel Spass beim ausprobieren unserer Funktionalitaet.' . "\r\n"
            . 'Gruß,' . "\r\n"
            . 'Das Entwicklerteam',
            $header
        );
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
        $_SESSION['user']['nickname'] = $result[0]['nickname'];
        $_SESSION['user']['verified'] = $result[0]['verified'];
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
        return (int)$_SESSION['user']['id'];
    }
    
    /**
     * Returns the current user Email.
     * @return Current user Email.
     */
    public static function getEmail() {
        return $_SESSION['user']['email'];
    }
    
    /**
     * Returns the verification status class.
     * @return String red for unverified, green for verified.
     */
    public static function getVerifiedClass() {
        if ( self::getVerified() ) {
            return 'green';
        }
        return 'red';    
    }
    
    /**
     * Returns the verification status class.
     * @return String red for unverified, green for verified.
     */
    public static function getVerified() {
        return empty($_SESSION['user']['verified']);
    }
    
    /**
     * Returns the verification key.
     * @return String key.
     */
    public static function getVerificationKey() {
        return $_SESSION['user']['verified'];
    }
    
    /**
     * Returns the verification status class.
     * @return String red for unverified, green for verified.
     */
    public static function verify() {
        if ( !isset($_GET['key']) 
            || $_GET['key'] != self::getVerificationKey() ) {
            return;
        }
        Database::setVerified(self::getId());
        $_SESSION['user']['verified'] = '';
    }
    
    /**
     * Returns the current user Nickname.
     * @return Current user Nickname.
     */
    public static function getNickname() {
        return $_SESSION['user']['nickname'];
    }
    
    /**
     * Set the current users Nickname.
     * @param Current user Nickname.
     */
    public static function setNickname($nickname) {
        if ( self::getNickname() == $nickname ) {
            return;
        }
        Database::setNickname(self::getId(),$nickname);
        $_SESSION['user']['nickname'] = $nickname;
        self::setError('Nickname ge&auml;ndert!<br>');
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
