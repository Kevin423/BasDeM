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
    private $childarray;
    private $author;
    private $title;
    private $text;
    private $layer;
    
    public function __construct($id = null) {
        $this->id = null;
        $this->children = array();
        $this->author = null;
        $this->title = null;
        $this->text = null;
        $this->layer = null;
        
        if ( is_null($id) ) {
            $this->createMemplex();
        } else if ( is_array($id) ) {
            $this->createMemplex($id);
        } else {
            $this->loadMemplex($id);
        }
    }
    
    private function loadMemplex($id) {
        $tmp = Database::getMemplex($id);
        if ( count($tmp) == 0 ) {
            return;
        }
        $this->id = $tmp[0]['id'];
        $this->author = $tmp[0]['author'];
        $this->title = $tmp[0]['title'];
        $this->text = $tmp[0]['text'];
        $this->layer = $tmp[0]['layer'];
        $this->children = array();
        foreach ( $tmp as $key => $value ) {
            if ( empty($value['child']) ) {
                continue;
            }
            $this->children[] = $value['child'];
        }
    }
    
    public function loadChildrenRecursive($level = -1) {
        $this->childarray = array();
        
        if ( $level-- == 0 ) {
            return;
        }
        foreach ( $this->children as $child ) {
            $tmp = MemplexRegister::get($child);
            if ( is_null(tmp) ) {
                continue;
            }
            $tmp->loadChildrenRecursive($level);
            $this->childarray[] = $tmp->toArray($level);
        }
    }
    
    private function createMemplex($id = null) {
        if ( is_null($id) || !is_array($id) ) {
            return;
        }
        
        if ( !isset($id['author'])
            || !isset($id['title'])
            || !isset($id['text'])
            || !isset($id['layer']) ) {
            return;
        }
        $this->author = $id['author'];
        $this->title = $id['title'];
        $this->text = $id['text'];
        $this->layer = $id['layer'];
    }
    
    public function store() {
        if ( is_null($this->id) ) {
            $this->id = Database::createMemplex(array(
                'author' => $this->author,
                'title' => $this->title,
                'text' => $this->text,
                'layer' => $this->layer,
            ));
        } else {
            Database::storeMemplex(array(
                'id' => $this->id,
                'author' => $this->author,
                'title' => $this->title,
                'text' => $this->text,
                'layer' => $this->layer,
            ));
        }
    }
    
    public function toArray() {
        return array(
            'id' => (int)$this->id,
            'author' => $this->author,
            'title' => $this->title,
            'text' => $this->text,
            'layer' => (int)$this->layer,
            'children' => $this->childarray,
        );
    }
    
    // public function toJSON() {
        // return json_encode(array(
            // 'id' => $this->id,
            // 'author' => $this->author,
            // 'title' => $this->title,
            // 'text' => $this->text,
            // 'layer' => $this->layer,
        // ));
    // }
    
    public function setId($id) {
        $this->id = $id;
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function addChild($id) {
        Database::addChild($this->id,$id);
        $this->children[] = $id;
    }
    
    public function getChildren() {
        return $this->children;
    }
    
    public function setAuthor($author) {
        $this->author = $author;
    }
    
    public function getAuthor() {
        return $this->author;
    }
    
    public function setTitle($title) {
        $this->title= $title;
    }
    
    public function getTitle() {
        return $this->title;
    }
    
    public function setText($text) {
        $this->text = $text;
    }
    
    public function getText() {
        return $this->text;
    }
    
    public function setLayer($layer) {
        $this->layer = $layer;
    }
    
    public function getLayer() {
        return $this->layer;
    }
}
?>
