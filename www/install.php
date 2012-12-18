<?php
define('NL',"\r\n");
define('NLB',"<br>\r\n");

define('INCMS',true);
define('CONF_DIR','class/');
define('CONF_FILE','conf.php');

define('PRIMARY_VERSION','0');
define('SECONDARY_VERSION','2');
define('TERTIARY_VERSION','0');

require_once('class/config.class.php');
require_once('class/helper.class.php');

if ( file_exists(CONF_DIR.CONF_FILE) ) {
    define('LOADCONF',true);
} else {
    define('LOADCONF',false);
}

$installerVersion = PRIMARY_VERSION . '.' . SECONDARY_VERSION . '.' . TERTIARY_VERSION;

$error = '';
$acceptedVersions = array(
    '0.0.91' => true,
    '0.0.92' => true,
    '0.0.93' => true,
    '0.0.94' => true,
    '0.1.0' => true,
);
$version = null;

if ( !isset($_GET['step']) ) {
    $_GET['step'] = '1';
}
$_GET['step'] = (int)$_GET['step'];

switch ( $_GET['step'] ) {
    case 4:
        printForm(4);
    break;
    case 3:
        checkFinalSubmit();
        printForm(3);
    break;
    case 2:
        Helper::canHash();
        if ( is_null(Config::get('mail','sender')) ) {
            die('Configuration file is not up to date, the e-mail section is missing.' . NLB . ' Please go back and press overwrite in the first step!');
        }
        checkSQLSubmit();
        printForm(2);
    break;
    case 1:
    default:
        checkConfSubmit();
        printForm(1);
}

function printForm($selector) {
    global $error;
    echo '<html>',NL,'<body>',NL;
    echo '<h3>BasDeM Installer</h3>',NL;
    echo '<span>This installer allows you to install BasDeM without having to go through sql imports and config files yourself.</span>',NLB;
    echo '<span style="color: red;">' . $error . '</span>',NLB,NLB;
    switch ( $selector ) {
        case 4:
            echo '<span>Everything is done. Have fun using BasDeM!',NLB;
            echo 'You can register or login <a href="index.php">here</a></span>',NLB;
        break;
        case 3:
            echo '<span>Installation done. For your own security we advise you to delete the install.php in your installation directory.</span>',NLB,NLB;
            echo '<form action="?step=3" method="post">',NL;
            echo '<input type="submit" name="delete" value="Delete install files">',NL;
            echo '</form>',NL;
        break;
        case 2:
            echo '<span>Setting up the database.</span>',NLB,NLB;
            echo '<form action="?step=2" method="post">',NL;
            echo '<table>',NL;
            echo '<tr><td>Full (re-)install</td><td><input type="submit" name="full" value="Execute"></td></tr>',NL;
            echo '<tr><td>Update</td><td><input type="submit" name="update" value="Execute"></td></tr>',NL;
            echo '</table>',NL;
            echo '</form>',NL;
        break;
        case 1:
        default:
            echo '<span>Setting up the config. <a href="?step=2">Skip config.</a></span>',NLB,NLB;
            echo '<form action="?step=1" method="post">',NL;
            echo '<table border="1">',NL;
            echo '<tr><td width="200">Database User' , defaultValue('user') , '</td><td><input type="text" name="dbuser" value="' , postValue('dbuser') , '"></td></tr>',NL;
            echo '<tr><td>Database Password' , defaultValue('password') , '</td><td><input type="password" name="dbpassword" value="' , postValue('dbpassword') , '"></td></tr>',NL;
            echo '<tr><td>Database Host' , defaultValue('host') , '</td><td><input type="text" name="dbhost" value="' , postValue('dbhost') , '"></td></tr>',NL;
            echo '<tr><td>Database Database' , defaultValue('database') , '</td><td><input type="text" name="dbdb" value="' , postValue('dbdb') , '"></td></tr>',NL;
            echo '<tr><td>Salt' , defaultValue('salt') , '</td><td><input type="text" name="salt" value="' , postValue('salt') , '"></td></tr>',NL;
            echo '<tr><td>BaseURL' , defaultValue('baseurl') , '</td><td><input type="text" name="baseurl" value="' , postValue('baseurl') , '"></td></tr>',NL;
            echo '<tr><td>Guest Account</td><td><input type="checkbox" name="guest"' , ( postValue('guest') == 'on' )?' checked':'', '></td></tr>',NL;
            echo '<tr><td>Mail Sender' , defaultValue('mailsender') , '</td><td><input type="text" name="mailsender" value="' , postValue('mailsender') , '"></td></tr>',NL;
            echo '<tr><td>Mail Register Subject' , defaultValue('mailregistersubject') , '</td><td><input type="text" name="mailregistersubject" value="' , postValue('mailregistersubject') , '"></td></tr>',NL;
            echo '<tr><td>Mail Register Text' , defaultValue('mailregistertext') , '</td><td><textarea rows="20" cols="50" name="mailregistertext">' , postValue('mailregistertext') , '</textarea></td></tr>',NL;
            echo '<tr><td>Mail Password Subject' , defaultValue('mailpasswordsubject') , '</td><td><input type="text" name="mailpasswordsubject" value="' , postValue('mailpasswordsubject') , '"></td></tr>',NL;
            echo '<tr><td>Mail Password Text' , defaultValue('mailpasswordtext') , '</td><td><textarea rows="20" cols="50" name="mailpasswordtext">' , postValue('mailpasswordtext') , '</textarea></td></tr>',NL;
            echo '<tr><td></td><td><input type="submit" name="dbsubmit" value="Install"></td></tr>',NL;
            echo '</table>',NL;
            echo '</form>',NL;
    }
    echo '</body>',NL,'</html>';
}

function postValue($name) {
    if ( !isset($_POST[$name]) ) {
        return defaultConfValue($name);
    }
    return $_POST[$name];
}

function checkFinalSubmit() {
    global $error;
    if ( !isset($_POST['delete']) ) {
        return;
    }
    if ( !is_writeable('install.php') && file_exists('install.php') ) {
        $error = 'install.php is not writeable. Please remove it by hand.';
    } else {
        unlink('install.php');
        printForm(4);
        die;
    }
}

function createConf() {
    global $error;
    
    if ( !isset($_POST['guest']) ) {
        $_POST['guest'] = 'off';
    }
    
    $tmp = defaultConf();
    $tmp['database']['user'] = $_POST['dbuser'];
    $tmp['database']['password'] = $_POST['dbpassword'];
    $tmp['database']['host'] = $_POST['dbhost'];
    $tmp['database']['database'] = $_POST['dbdb'];
    $tmp['database']['salt'] = $_POST['salt'];
    $tmp['baseurl'] = $_POST['baseurl'];
    $tmp['guest'] = ( $_POST['guest'] == 'on' );
    $tmp['mail']['sender'] = $_POST['mailsender'];
    $tmp['mail']['register']['subject'] = $_POST['mailregistersubject'];
    $tmp['mail']['register']['text'] = $_POST['mailregistertext'];
    $tmp['mail']['password']['subject'] = $_POST['mailpasswordsubject'];
    $tmp['mail']['password']['text'] = $_POST['mailpasswordtext'];
    
    $out = '<?php' . NL . '$conf = ' . var_export($tmp,true) . ';' . NL . '?>';
    
    if ( ( file_exists(CONF_DIR.CONF_FILE) 
        && is_writeable(CONF_DIR.CONF_FILE) )
        || is_writeable(CONF_DIR) ) {
        if ( file_exists(CONF_DIR.CONF_FILE) 
            && ( !isset($_POST['overwrite']) 
            || $_POST['overwrite'] != 'Overwrite' ) ) {
            
            $error .= 'Config file exists, overwrite it?';
            $error .= '<form action="?step=1" method="post">';
            $error .= '<input type="hidden" name="dbuser" value="'.$_POST['dbuser'].'">';
            $error .= '<input type="hidden" name="dbpassword" value="'.$_POST['dbpassword'].'">';
            $error .= '<input type="hidden" name="dbhost" value="'.$_POST['dbhost'].'">';
            $error .= '<input type="hidden" name="dbdb" value="'.$_POST['dbdb'].'">';
            $error .= '<input type="hidden" name="salt" value="'.$_POST['salt'].'">';
            $error .= '<input type="hidden" name="baseurl" value="'.$_POST['baseurl'].'">';
            $error .= '<input type="hidden" name="guest" value="'.$_POST['guest'].'">';
            $error .= '<input type="hidden" name="mailsender" value="'.$_POST['mailsender'].'">';
            $error .= '<input type="hidden" name="mailregistersubject" value="'.$_POST['mailregistersubject'].'">';
            $error .= '<input type="hidden" name="mailregistertext" value="'.$_POST['mailregistertext'].'">';
            $error .= '<input type="hidden" name="mailpasswordsubject" value="'.$_POST['mailpasswordsubject'].'">';
            $error .= '<input type="hidden" name="mailpasswordtext" value="'.$_POST['mailpasswordtext'].'">';
            $error .= '<input type="submit" name="overwrite" value="Overwrite">';
            $error .= '</form>';
            return false;
        }
        file_put_contents(CONF_DIR.CONF_FILE,$out);
    } else {
        $error .= 'Config file exists and is unwriteable or config directory is unwriteable. Please check ' . CONF_DIR.CONF_FILE . ' and set appropriate rights.';
        return false;
    }
    
    return true;
}

function checkConfSubmit() {
    global $error;
    if ( isset($_POST['dbuser'])
        && isset($_POST['dbpassword'])
        && isset($_POST['dbhost'])
        && isset($_POST['dbdb'])
        && isset($_POST['salt'])
        && isset($_POST['baseurl']) ) {
        if ( createConf() == false ) {
            $error .= 'The config creation failed.';
            return;
        }
        header('Location: ?step=2');
        die;
    }
}

function SQLConnect() {
    mysql_connect(Config::get('database','host'),Config::get('database','user'),Config::get('database','password'));
    mysql_select_db(Config::get('database','database'));
    if ( mysql_errno() != 0 ) {
        return mysql_error();
    }
    return true;
}

function checkSQLSubmit() {
    global $error,$version,$installerVersion;
    if ( isset($_POST['full']) ) {
        $connect = SQLConnect();
        if ( $connect !== true ) {
            $error = $connect;
            return;
        }
        
        // Drop all foreign key constraints.
        dropForeignKeys();
        // Drop all tables.
        dropAllTables();
        // Create all tables.
        createAllTables();
        // Insert start values.
        insertDefaultValues();
        // Reset all foreign key constraints.
        setForeignKeys();
        
        header('Location: ?step=3');
        die;
    }
    if ( isset($_POST['update']) ) {
        SQLConnect();
        if ( !checkVersion() ) {
            $error = 'Sadly this feature is not available for your version of BasDeM. Please use the "Full (re-)install" Option.';
            return;
        }
        if ( $installerVersion == $version ) {
            $error .= 'Your installation is now or allready was at the installer version (' . $version . '). <a href="?step=3">Please proceed to the last step of the installation.</a>';
            return;
        }
        if ( $version == '0.0.91' ) {
            update0d0d91();
            checkSQLSubmit();
        }
        if ( $version == '0.0.92' ) {
            update0d0d92();
            checkSQLSubmit();
        }
        if ( $version == '0.0.93' ) {
            update0d0d93();
            checkSQLSubmit();
        }
        if ( $version == '0.0.94' ) {
            update0d0d94();
            checkSQLSubmit();
        }
    }
}

function update0d0d91() {
    mysql_query("update `version` set `primary` = 0, `secondary` = 0, `tertiary` = 92");
}

function update0d0d92() {

    // oldtexts
    mysql_query(
"CREATE TABLE IF NOT EXISTS `oldtexts` (
  `id` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `text` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // oldtitles
    mysql_query(
"CREATE TABLE IF NOT EXISTS `oldtitles` (
  `id` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // Supermoderator
    mysql_query(
"ALTER TABLE `userrights` ADD `supermoderator` TINYINT( 1 ) NOT NULL"
    );
    mysql_query(
"ALTER TABLE `userrights` ADD INDEX ( `supermoderator` ) "
    );
    // version updated
    mysql_query("update `version` set `primary` = 0, `secondary` = 0, `tertiary` = 93");
}

function update0d0d93() {
    mysql_query("update `version` set `primary` = 0, `secondary` = 0, `tertiary` = 94");
}

function update0d0d94() {
    mysql_query("update `version` set `primary` = 0, `secondary` = 1, `tertiary` = 0");
}

function checkVersion() {
    global $version,$acceptedVersions;
    $q = mysql_query('select * from version');
    if ( mysql_num_rows($q) != 1 ) {
        return false;
    }
    $r = mysql_fetch_array($q);
    $version = $r['primary'] . '.' . $r['secondary'] . '.' . $r['tertiary'];
    if ( isset($acceptedVersions[$version]) && $acceptedVersions[$version] === true ) {
        return true;
    }
    return false;
}

function setForeignKeys() {
    // Constraints for table `authors`
    mysql_query(
"ALTER TABLE `authors`
  ADD CONSTRAINT `authors_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION");

    // Constraints for table `children`
    mysql_query(
"ALTER TABLE `children`
  ADD CONSTRAINT `children_ibfk_2` FOREIGN KEY (`child`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `children_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;");

    // Constraints for table `favorite`
    mysql_query(
"ALTER TABLE `favorite`
  ADD CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;");

    // Constraints for table `moderation`
    mysql_query(
"ALTER TABLE `moderation`
  ADD CONSTRAINT `moderation_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;");

    // Constraints for table `texts`
    mysql_query(
"ALTER TABLE `texts`
  ADD CONSTRAINT `texts_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;");

    // Constraints for table `titles`
    mysql_query(
"ALTER TABLE `titles`
  ADD CONSTRAINT `titles_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;");
}

function insertDefaultValues() {
    global $installerVersion;
    // Create User System.
    mysql_query("INSERT INTO `users` (`id`, `password`, `email`, `nickname`, `verified`) VALUES
(1, '', 'System', 'System', '');");
    // Create Memplex System.
    mysql_query("INSERT INTO `memplex` (`id`, `layer`) VALUES (1, 1);");
    mysql_query("INSERT INTO `authors` (`id`, `userid`) VALUES (1, 1);");
    mysql_query("INSERT INTO `titles` (`id`, `content`) VALUES (1, 'System');");
    mysql_query("INSERT INTO `texts` (`id`, `content`) VALUES (1, 'System');");
    
    mysql_query("insert into `version` set `primary` = ".PRIMARY_VERSION.", `secondary` = ".SECONDARY_VERSION.", `tertiary` = ".TERTIARY_VERSION."");
}

function createAllTables() {
    // authors
    mysql_query(
"CREATE TABLE IF NOT EXISTS `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `content` (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;"
    );
    // children
    mysql_query(
"CREATE TABLE IF NOT EXISTS `children` (
  `parent` int(11) NOT NULL,
  `child` int(11) NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // favorite
    mysql_query(
"CREATE TABLE IF NOT EXISTS `favorite` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  UNIQUE KEY `id` (`id`,`user`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // memplex
    mysql_query(
"CREATE TABLE IF NOT EXISTS `memplex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layer` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `layer` (`layer`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;"
    );
    // moderation
    mysql_query(
"CREATE TABLE IF NOT EXISTS `moderation` (
  `id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  KEY `state` (`state`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // texts
    mysql_query(
"CREATE TABLE IF NOT EXISTS `texts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` mediumtext CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;"
    );
    // titles
    mysql_query(
"CREATE TABLE IF NOT EXISTS `titles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;"
    );
    // userrights
    mysql_query(
"CREATE TABLE IF NOT EXISTS `userrights` (
  `id` int(11) NOT NULL,
  `moderator` tinyint(1) NOT NULL,
  `supermoderator` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `moderator` (`moderator`),
  KEY `supermoderator` (`supermoderator`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // users
    mysql_query(
"CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(120) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `verified` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;"
    );
    // version
    mysql_query(
"CREATE TABLE IF NOT EXISTS `version` (
  `primary` int(2) NOT NULL,
  `secondary` int(2) NOT NULL,
  `tertiary` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // oldtexts
    mysql_query(
"CREATE TABLE IF NOT EXISTS `oldtexts` (
  `id` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `text` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
    // oldtitles
    mysql_query(
"CREATE TABLE IF NOT EXISTS `oldtitles` (
  `id` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
    );
}

function dropAllTables() {
    $q = mysql_query("show tables");
    if ( mysql_num_rows($q) == 0 ) {
        return;
    }
    while ( $r = mysql_fetch_array($q) ) {
        mysql_query("drop table " . $r[0] . ";");
    }
}

function dropForeignKeys() {
    $q = mysql_query("select table_name, constraint_name from information_schema.table_constraints where constraint_type = 'foreign key' and table_schema = '" . Config::get('database','database') . "'");
    if ( mysql_num_rows($q) == 0 ) {
        return;
    }
    while ( $r = mysql_fetch_array($q) ) {
        mysql_query("alter table " . $r['table_name'] . " drop foreign key " . $r['constraint_name'] . ";");
    }
}

function defaultValue($target) {
    $tmp = defaultConf();
    $out = ' (Default: "';
    switch ( $target ) {
        case 'user': $out .= $tmp['database']['user']; break;
        case 'password': $out .= $tmp['database']['password']; break;
        case 'host': $out .= $tmp['database']['host']; break;
        case 'database': $out .= $tmp['database']['database']; break;
        case 'salt': $out .= $tmp['database']['salt']; break;
        case 'baseurl': $out .= $tmp['baseurl']; break;
        case 'mailsender': $out .= $tmp['mail']['sender']; break;
        case 'mailregistersubject': $out .= $tmp['mail']['register']['subject']; break;
        case 'mailregistertext': $out .= $tmp['mail']['register']['text']; break;
        case 'mailpasswordsubject': $out .= $tmp['mail']['password']['subject']; break;
        case 'mailpasswordtext': $out .= $tmp['mail']['password']['text']; break;
    }
    $out .= '")';
    return $out;
}

function defaultConfValue($target) {
    $tmp = defaultConf();
    if ( LOADCONF === true ) {
        $tmp['database']['user'] = Config::get('database','user');
        $tmp['database']['host'] = Config::get('database','host');
        $tmp['database']['database'] = Config::get('database','database');
        $tmp['database']['salt'] = Config::get('database','salt');
        $tmp['baseurl'] = Config::get('baseurl');
        $tmp['mail'] = Config::get('mail');
    }
    switch ( $target ) {
        case 'dbuser': return $tmp['database']['user'];
        case 'dbpassword': return $tmp['database']['password'];
        case 'dbhost': return $tmp['database']['host'];
        case 'dbdb': return $tmp['database']['database'];
        case 'salt': return $tmp['database']['salt'];
        case 'baseurl': return $tmp['baseurl'];
        case 'mailsender': return $tmp['mail']['sender'];
        case 'mailregistersubject': return $tmp['mail']['register']['subject'];
        case 'mailregistertext': return $tmp['mail']['register']['text'];
        case 'mailpasswordsubject': return $tmp['mail']['password']['subject'];
        case 'mailpasswordtext': return $tmp['mail']['password']['text'];
    }
    return '';
}

function defaultConf() {
    return array(
		'database' => array(
			'engine' => 'mysql',
			'host' => 'localhost',
			'user' => 'root',
			'password' => '',
			'database' => 'basdem',
            // Important: Defines the algorithm. 6 = SHA512 make sure it is available.
            // This setting directly influences password security on your system!
            // rounds=50000 leads to 0.13 seconds per hash calculation. Whoever breaks this, he deserves it.
			'hashalgorithm' => '$6$rounds=50000$',
            // Adapt the salt to your wishes.
			'salt' => '16 chars long!!',
		),
        'baseurl' => 'http://www.basdem.de/demo/',
        'guest' => false,
        'mail' => array(
            'sender' => 'webmaster@basdem.de',
            'register' => array(
                'subject' => 'Registration auf BasDeM.de',
                'text' => 'Hallo,' . "\r\n"
                    . 'du hast dich erfolgreich auf BasDeM.de angemeldet. Bitte verifiziere deinen Account mit einem Klick auf folgenden Link:' . "\r\n"
                    . "%s\r\n"
                    . 'Wir danken fuer deine Mitarbeit und wuenschen dir viel Spass beim ausprobieren unserer Funktionalitaet.' . "\r\n"
                    . 'Gruss,' . "\r\n"
                    . 'Das Entwicklerteam',
            ),
            'password' => array(
                'subject' => 'Passwort reset.',
                'text' => 'Hallo,' . "\r\n"
                    . 'du hast dein Passwort zurueckgesetzt.' . "\r\n"
                    . 'Dein neues Passwort ist: %s' . "\r\n"
                    . 'Wir danken fuer deine Mitarbeit und wuenschen dir weiterhin viel Spass.' . "\r\n"
                    . 'Gruss,' . "\r\n"
                    . 'Das Entwicklerteam',
            ),
        ),
	);
}

?>
