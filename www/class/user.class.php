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
    private static $guest = false;

    /**
     * Starts a new session and initializes the object.
     */
    public static function init() {
        session_start();
        if ( isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true ) {
            self::$loggedin = true;
        }
        
        if ( isset($_GET['action']) && $_GET['action'] == 'guest' ) {
            self::setGuest();
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
        
        $_POST['email'] = strtolower($_POST['email']);
        
        $password = Helper::hash($_POST['password'].$_POST['email']);
        
        $verified = md5($_POST['email'].$password.microtime(true));
        
        $result = Database::createUser($_POST['email'],$password,$verified);
        
        if (  $result === false || !is_numeric($result) ) {
            return;
        }
        
        $_SESSION['user']['id'] = $result;
        $_SESSION['user']['email'] = $_POST['email'];
        $_SESSION['user']['verified'] = $verified;
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
            . Config::get('baseurl') . 'index.php?action=verify&key=' . $key . '' . "\r\n"
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
        $_POST['email'] = strtolower($_POST['email']);
        
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
        $_SESSION['user']['moderator'] = $result[0]['moderator'];
        $_SESSION['user']['supermoderator'] = $result[0]['supermoderator'];
        $_SESSION['loggedin'] = true;
        self::$loggedin = true;
    }

    /**
     * Logs the current user out.
     */
    public static function logout() {
        $_SESSION = array();
        self::$loggedin = false;
        self::$guest = false;
    }

    /**
     * Checks if email is valid.
     * Code slightly modified from http://www.linuxjournal.com/article/9585?page=0,3
     * @return False if email is invalid, else true.
     */
    private static function validEmail($email) {
        $atIndex = strrpos($email, "@");
        if (is_bool($atIndex) && !$atIndex) {
            return false;
        } else {
            $domain = substr($email, $atIndex+1);
            $local = substr($email, 0, $atIndex);
            $localLen = strlen($local);
            $domainLen = strlen($domain);
            if ($localLen < 1 || $localLen > 64) {
                // local part length exceeded
                return false;
            } else if ($domainLen < 1 || $domainLen > 255) {
                // domain part length exceeded
                return false;
            } else if ($local[0] == '.' || $local[$localLen-1] == '.') {
                // local part starts or ends with '.'
                return false;
            }
            else if (preg_match('/\\.\\./', $local)) {
                // local part has two consecutive dots
                return false;
            } else if (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain)) {
                // character not valid in domain part
                return false;
            } else if (preg_match('/\\.\\./', $domain)) {
                // domain part has two consecutive dots
                return false;
            } else if (
                !preg_match(
                    '/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/',
                    str_replace("\\\\","",$local)
                ) ) {
                // character not valid in local part unless 
                // local part is quoted
                if ( !preg_match(
                    '/^"(\\\\"|[^"])+"$/',
                    str_replace("\\\\","",$local)) ) {
                    return false;
                }
            }
            if ( !( checkdnsrr($domain,"MX") 
                || checkdnsrr($domain,"A") ) ) {
                // domain not found in DNS
                return false;
            }
        }
        return true;
    }
    
    /**
     * Checks if a necessary POST data has been sent with the request: email and password are required.
     * @return False if something is missing, else true.
     */
    private static function validatePost() {
        if ( !isset($_POST['email']) ) {
            return false;
        }
        if ( !isset($_POST['password']) ) {
            return false;
        }
        if ( empty($_POST['email']) ) {
            self::setError('Unbekannter Benutzername oder Passwort!<br>');
            return false;
        }
        if ( empty($_POST['password']) ) {
            self::setError('Unbekannter Benutzername oder Passwort!<br>');
            return false;
        }
        if ( !self::validEmail($_POST['email']) ) {
            self::setError('E-Mail Adresse ist nicht g&uuml;ltig!<br>');
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
     * @return String Possible values: red for unverified, green for verified.
     */
    public static function getVerifiedClass() {
        if ( self::getVerified() ) {
            return 'green';
        }
        return 'red';    
    }
    
    /**
     * Returns the verification status class.
     * @return String Possible values: red for unverified, green for verified.
     */
    public static function getVerified() {
        return empty($_SESSION['user']['verified']);
    }
    
    /**
     * Returns the verification key.
     * @return String Verification key.
     */
    public static function getVerificationKey() {
        return $_SESSION['user']['verified'];
    }
    
    /**
     * Returns the verification status class.
     * @return String Possible values: red for unverified, green for verified.
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
     * Returns the current user nickname.
     * @return Current user Nickname.
     */
    public static function getNickname() {
        if ( !isset($_SESSION['user']['nickname']) 
            || empty($_SESSION['user']['nickname']) ) {
            return "Anonym";
        }
        return $_SESSION['user']['nickname'];
    }
    
    /**
     * Set the current users Nickname.
     * @param $nickname string Current user nickname.
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
     * @return True if moderator, else false.
     */
    public static function isModerator() {
        return (int)$_SESSION['user']['moderator'] === 1;
    }
    
    /**
     * Returns the user supermoderator status.
     * @return True if supermoderator, else false.
     */
    public static function isSuperModerator() {
        return (int)$_SESSION['user']['supermoderator'] === 1;
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
     * Sets the guest state to true.
     */
    private static function setGuest() {
        if ( Config::get('guest') !== true ) {
            User::setError('Der Gastzugang wurde deaktiviert!');
            return;
        }
        $_SESSION['user']['verified'] = 'no';
        $_SESSION['user']['guest'] = true;
    }
    
    /**
     * Returns the guest state.
     * @return Boolean Guest.
     */
    public static function isGuest() {
        return isset($_SESSION['user']['guest']) && $_SESSION['user']['guest'] === true;
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
