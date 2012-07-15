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
#error_reporting("E_ALL & ~E_DEPRECATED & ~E_STRICT");
error_reporting("E_ALL & ~E_STRICT");

require_once('class/config.class.php');
require_once('class/mysql.class.php');
require_once('class/memplex.class.php');
require_once('class/memplex.register.class.php');

Database::init();

if ( !isset($_POST['id'])
    && isset($_POST['parent'])
    && isset($_POST['text'])
    && isset($_POST['layer'])
    && isset($_POST['title'])
    && isset($_POST['author']) ) {
    // Create a new Memplex.
    $m = new Memplex(array(
        'text' => $_POST['text'],
        'layer' => $_POST['layer'],
        'title' => $_POST['title'],
        'author' => $_POST['author'],
    ));
    $m->store();
    MemplexRegister::reg($m);
    
    $parent = MemplexRegister::get($_POST['parent']);
    $parent->addChild($m->getId());
    
    unset($_POST);
    $_POST['id'] = $m->getId();
}

if ( isset($_POST['id']) ) {
    if ( $_POST['id'] == 0 ) {
        echo json_encode(array(
            "data" => array(
                'id' => 0,
                'author' => 'System',
                'title' => 'Themenbereiche',
                'text' => "",
                'layer' => 1,
                'children' => array(array(
                    'id' => 1,
                    'author' => 'System',
                    'title' => 'Testthemenbereich',
                    'text' => "",
                    'layer' => 2,
                    'children' => array(),
                )),
        )));
        return;
    }
    $action = false;
    
    $child = MemplexRegister::get($_POST['id']);
    
    if ( is_null($child->getTitle()) ) {
        echo json_encode(array('success' => false));
        return;
    }
    if ( 
        isset($_POST['text'])
        && isset($_POST['layer'])
        && isset($_POST['title'])
        && isset($_POST['author']) ) {
        
        $action = true;
        
        // Update a Memplex.
        
        $child->setText($_POST['text']);
        $child->setLayer($_POST['layer']);
        $child->setTitle($_POST['title']);
        $child->setAuthor($_POST['author']);
        
        $child->store();
    }
    
    if ( isset($_POST['children']) && is_array($_POST['children']) ) {
        foreach ( $_POST['children'] as $child ) {
            $action = true;
            $child->addChild($child);
        }
    }
    
    if ( isset($_POST['parent']) ) {
        $action = true;
        $parent = MemplexRegister::get($_POST['parent']);
        $parent->addChild($child->getId());
    }
    
    if ( $child->getLayer() == 1
        || $child->getLayer() == 2
        || $child->getLayer() == 3
        || $child->getLayer() == 4 ) {
        $child->loadChildrenRecursive(1);
    } else if ( $child->getLayer() == 5
        || $child->getLayer() == 6
        || $child->getLayer() == 7 ) {
        $child->loadChildrenRecursive(-1);
    } else if ( $child->getLayer() == 8 ) {
        $child->loadChildrenRecursive(0);
    }
    
    echo json_encode(array(
        'success' => true,
        'action' => $action,
        'data' => $child->toArray(),
    ));
}


?>
