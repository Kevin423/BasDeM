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
require_once('class/mysql.class.php');
require_once('class/memplex.class.php');
require_once('class/memplex.register.class.php');

Database::init();

if ( !isset($_POST['id'])
    && isset($_POST['parent'])
    && isset($_POST['description'])
    && isset($_POST['layer'])
    && isset($_POST['title'])
    && isset($_POST['author']) ) {
    
    // Create a new Memplex.
    $m = new Memplex(array(
        'text' => $_POST['description'],
        'layer' => $_POST['layer'],
        'title' => $_POST['title'],
        'author' => $_POST['author'],
    ));
    $m->store();
    MemplexRegister::reg($m);
    
    $parent = MemplexRegister::get($_POST['parent']);
    $parent->addChild($m->getId());
    echo json_encode(array('success' => true));
}

if ( isset($_POST['id']) ) {
    $action = false;
    $child = MemplexRegister::get($_POST['id']);
    
    if ( is_null($child->getTitle()) ) {
        echo json_encode(array('success' => false));
        return;
    }
    if ( 
        isset($_POST['description'])
        && isset($_POST['layer'])
        && isset($_POST['title'])
        && isset($_POST['author']) ) {
        
        $action = true;
        
        // Update a Memplex.
        
        $child->setText($_POST['description']);
        $child->setLayer($_POST['layer']);
        $child->setTitle($_POST['title']);
        $child->setAuthor($_POST['author']);
        
        $child->store();
    }
    
    if ( isset($_POST['children']) && is_array($_POST['children']) ) {
        foreach ( $_POST['children'] as $child ) {
            $child->addChild($child);
        }
    }
    
    if ( isset($_POST['parent']) ) {
        $parent = MemplexRegister::get($_POST['parent']);
        $parent->addChild($child->getId());
    }
    
    $child->loadChildrenRecursive();
    
    echo json_encode(array(
        'success' => true,
        'data' => $child->toArray(),
    ));
}


?>
