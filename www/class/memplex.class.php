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

if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

class Memplex {
    private $id;
    private $children;
    private $author;
    private $title;
    private $text;
    private $layer;
    
    public function __construct($id = null) {
        if ( is_null($id) ) {
            $this->createMemplex();
        } else {
            $this->loadMemplex($id);
        }
    }
    
    private function loadMemplex($id) {
        $tmp = Database::getMemplex($id);
        $this->id = $tmp[0]['id'];
        $this->author = $tmp[0]['author'];
        $this->title = $tmp[0]['title'];
        $this->text = $tmp[0]['text'];
        $this->layer = $tmp[0]['layer'];
        
        foreach ( $tmp as $key => $value ) {
            echo $value['child'],NL;
        }
    }
    
    private function createMemplex($id) {
        $this->id = null;
        $this->children = array();
        $this->author = null;
        $this->title = null;
        $this->text = null;
        $this->layer = null;
    }
    
    public function store() {
        Database::setMemplex(array(
            'id' => $this->id,
            'author' => $this->author,
            'title' => $this->title,
            'text' => $this->text,
            'layer' => $this->layer,
        ));
    }
    
    public function __toArray() {
        
        return array(
            'id' => $this->id,
            'author' => $this->author,
            'title' => $this->title,
            'text' => $this->text,
            'layer' => $this->layer,
        );
    }
    
    public function setId($id) {
        $this->id = $id;
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function addChild($id) {
        $this->children[] = $id;
    }
    
    public function getChildren() {
        return $this->children;
    }
    
    public function setAuthor($author) {
        $this->author = $author;
    }
    
    public function getAuthor($author) {
        return $this->author;
    }
    
    public function setTitle($title) {
        $this->title= $title;
    }
    
    public function getTitle($title) {
        return $this->title;
    }
    
    public function setText($text) {
        $this->text = $text;
    }
    
    public function getText($text) {
        return $this->text;
    }
    
    public function setLayer($layer) {
        $this->layer = $layer;
    }
    
    public function getLayer($layer) {
        return $this->layer;
    }
}
?>
