<?php
/****************************************************************************************
 * Copyright (c) 2012 Justus Wingert <justus_wingert@web.de>                            *
 *
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

define('INCMS',true);
define('NL',"<br>\r\n");
error_reporting("E_ALL & ~E_DEPRECATED & ~E_STRICT");


require_once('class/config.class.php');
require_once('class/controller.class.php');
require_once('class/mysql.class.php');
require_once('class/user.class.php');
require_once('class/memplex.class.php');
require_once('class/memplex.register.class.php');
require_once('class/template.class.php');
require_once('class/helper.class.php');

Database::init();

User::init();

if ( isset($_GET['action']) && $_GET['action'] == 'logout' ) {
    User::logout();
}

if ( User::isLoggedin() !== true ) {
    if ( !isset($_GET['action']) ) {
        $tpl = new Template('index',array('noload','login'));
    } else {
        switch ( $_GET['action'] ) {
            case 'register': $tpl = new Template('index',array('noload','register')); break;
            default:
            case 'login': 
                $login = 'login';
                if ( User::hasError() === true ) {
                    $login = 'loginerror';
                }
                $tpl = new Template('index',array('noload',$login)); break;
        }
    }
} else {
    if ( !isset($_GET['action']) ) {
        $_GET['action'] = '';
    }
    switch ( $_GET['action'] ) {
        case 'settings':
            User::update();
            
            $tpl = new Template('index',array('noload','settings'));
            $tpl->replace(
                array(
                    ':::email:::',
                    ':::nickname:::',
                    ':::error:::',
                    ':::verified:::',
                ),
                array(
                    User::getEmail(),
                    User::getNickname(),
                    User::getError(),
                    User::getVerified(),
                )
            );
        break;
        case 'verify':
            User::verify();
        default:
            $tpl = new Template('index',array('load','default'));
    }
}
echo $tpl;
?>
