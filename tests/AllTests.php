<?php
/****************************************************************************************
 * Copyright (c) 2012 Sven Krohlas <sven@getamarok.com>                                 *
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

class Framework_AllTests {
    public static function suite() {
        $suite = new PHPUnit_Framework_TestSuite('BasDeM Testsuite');

        $suite->addTestFile('TestConfig.php');
        $suite->addTestFile('TestMemplex.php');
        $suite->addTestFile('TestMemplexRegister.php');

        // let's prepare a fake session
        session_save_path(sys_get_temp_dir());

        Database::init();
        User::init();

        $_SESSION['loggedin'] = true;
        $_SESSION['user'] = array();
        $_SESSION['user']['id'] = 'testauthor';
        $_SESSION['user']['email'] = 'test@basdem.de';

        return $suite;
    }
}

?>
