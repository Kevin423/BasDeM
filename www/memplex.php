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

define('INCMS',true);
define('NL',"<br>\r\n");
error_reporting("E_ALL & ~E_DEPRECATED & ~E_STRICT");


require_once('class/config.class.php');
require_once('class/controller.class.php');
require_once('class/mysql.class.php');
require_once('class/user.class.php');
require_once('class/memplex.class.php');
require_once('class/memplex.register.class.php');

Database::init();

User::init();

if ( User::getId() == 2 ) {
    #sleep(1);
}

if ( User::isLoggedin() !== true ) {
    die(json_encode(array('login' => false)));
}

new Controller();




?>
