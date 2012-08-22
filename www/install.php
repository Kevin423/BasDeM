<?php
define('NL',"\r\n");
define('NLB',"<br>\r\n");

define('INCMS',true);
define('CONF_DIR','class/');
define('CONF_FILE','conf.php');

$error = '';

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
            echo '<span>Everything is done. Have fun using BasDeM!</span>',NLB,NLB;
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
            echo '<span>Setting up the config. <a href="?step=2">Skip config.</span>',NLB,NLB;
            echo '<form action="?step=1" method="post">',NL;
            echo '<table>',NL;
            echo '<tr><td>Database User' , defaultValue('user') , '</td><td><input type="text" name="dbuser"></td></tr>',NL;
            echo '<tr><td>Database Password' , defaultValue('password') , '</td><td><input type="password" name="dbpassword"></td></tr>',NL;
            echo '<tr><td>Database Host' , defaultValue('host') , '</td><td><input type="text" name="dbhost"></td></tr>',NL;
            echo '<tr><td>Database Database' , defaultValue('database') , '</td><td><input type="text" name="dbdb"></td></tr>',NL;
            echo '<tr><td>Salt' , defaultValue('salt') , '</td><td><input type="text" name="salt"></td></tr>',NL;
            echo '<tr><td></td><td><input type="submit" name="dbsubmit" value="Install"></td></tr>',NL;
            echo '</table>',NL;
            echo '</form>',NL;
    }
    echo '</body>',NL,'</html>';
}

function checkFinalSubmit() {
    global $error;
    if ( !isset($_POST['delete']) ) {
        return;
    }
    if ( !is_writeable('install.php') && file_exists('install.php') ) {
        $error = 'install.php is not writeable. Please remove it by hand.';
    } else {
        header('Location: ?step=4');
    }
}

function createConf() {
    global $error;
    $tmp = defaultConf();
    $tmp['database']['user'] = $_POST['dbuser'];
    $tmp['database']['password'] = $_POST['dbpassword'];
    $tmp['database']['host'] = $_POST['dbhost'];
    $tmp['database']['database'] = $_POST['dbdb'];
    $tmp['database']['salt'] = $_POST['salt'];
    
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
        && isset($_POST['salt']) ) {
        if ( createConf() == false ) {
            $error .= 'The config creation failed.';
            return;
        }
        header('Location: ?step=2');
        die;
    }
}

function SQLConnect() {
    require_once('class/config.class.php');
    mysql_connect(Config::get('database','host'),Config::get('database','user'),Config::get('database','password'));
    mysql_select_db(Config::get('database','database'));
}

function checkSQLSubmit() {
    if ( isset($_POST['full']) ) {
        SQLConnect();
        
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
        echo "update".NLB;
    }
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
    // Create User System.
    mysql_query("INSERT INTO `users` (`id`, `password`, `email`, `nickname`, `verified`) VALUES
(1, '', 'System', 'System', '');");
    // Create Memplex System.
    mysql_query("INSERT INTO `memplex` (`id`, `layer`) VALUES (1, 1);");
    mysql_query("INSERT INTO `authors` (`id`, `userid`) VALUES (1, 1);");
    mysql_query("INSERT INTO `titles` (`id`, `content`) VALUES (1, 'System');");
    mysql_query("INSERT INTO `texts` (`id`, `content`) VALUES (1, 'System');");
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
  PRIMARY KEY (`id`),
  KEY `moderator` (`moderator`)
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
}

function dropAllTables() {
    $q = mysql_query("show tables") or die(mysql_error());
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
    }
    $out .= '")';
    return $out;
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
	);
}

?>