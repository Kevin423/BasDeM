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

if ( !defined('INCMS') || INCMS !== true ) {
        die;
}
/**
 * A Memplex is the central datastructure of BasDeM, representing everything the user
 * may want to add or view in the system.
 */
class Memplex {
    private $id;
    private $children;
    private $childarray;
    private $author;
    private $title;
    private $text;
    private $layer;
    
    /** Constructor.
     * @param integer $id ID of the memplex to load or array with 'author', 'title', 'text'
     * and 'layer' keys to create a new one. An empty memplex is created if $id is omitted.
     *
     * @return The new Memplex.
     */
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
    
    /**
     * Loads all children of this Memplex.
     * WARNING: If ID is 1 (the Memplex ist the root Memplex) and level is undefined or -1
     * the whole database is being loaded.
     *
     * @param integer $level Level to load (optional).
     */
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
    
    /**
     * Stores the Memplex permanently in the database.
     */
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
    
    /**
     * Returns the Memplex contents as array.
     *
     * @return Array with Keys: 'id', 'author', 'title', 'text', 'layer' and 'children'.
     */
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
    
    /**
     * Sets the ID of the Memplex.
     *
     * @param integer $id The new ID.
     */
    public function setId($id) {
        $this->id = $id;
    }
    
    /**
     * Returns the ID of the Memplex.
     *
     * @return The ID of the Memplex.
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Adds a child to the Memplex.
     *
     * @param integer $id ID of the new child.
     */
    public function addChild($id) {
        Database::addChild($this->id,$id);
        $this->children[] = $id;
    }

    /**
     * Returns the IDs of the children of the Memplex.
     *
     * @return Array with IDs of the children.
     */
    public function getChildren() {
        return $this->children;
    }
    
    /**
     * Sets the author of the Memplex.
     *
     * @param string $author The new author.
     */
    public function setAuthor($author) {
        $this->author = $author;
    }
    
    /**
     * Returns the author of the Memplex.
     *
     * @return The author of the Memplex.
     */
    public function getAuthor() {
        return $this->author;
    }

    /**
     * Sets the title of the Memplex.
     *
     * @param string $title The new title.
     */
    public function setTitle($title) {
        $this->title= $title;
    }
    
    /**
     * Returns the title of the Memplex.
     *
     * @return The title of the Memplex.
     */
    public function getTitle() {
        return $this->title;
    }
    
    /**
     * Sets the text of the Memplex.
     *
     * @param string $text The new text.
     */
    public function setText($text) {
        $this->text = $text;
    }
    
    /**
     * Returns the text of the Memplex.
     *
     * @return The text of the Memplex.
     */
    public function getText() {
        return $this->text;
    }
    
    /**
     * Sets the layer of the Memplex.
     *
     * The various layers are documented in our UML documentation at
     * https://github.com/Kevin423/BasDeM/blob/master/docs/BasDeM.png
     *
     * @param integer $layer The new layer.
     */
    public function setLayer($layer) {
        $this->layer = $layer;
    }
    
    /**
     * Returns the layer of the Memplex.
     *
     * The various layers are documented in our UML documentation at
     * https://github.com/Kevin423/BasDeM/blob/master/docs/BasDeM.png
     *
     * @return The layer of the Memplex.
     */
    public function getLayer() {
        return $this->layer;
    }
}
?>
