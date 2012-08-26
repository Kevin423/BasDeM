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

/****************************************************************************************
 * This Source Code Form is subject to the terms of the Mozilla Public                  *
 * License, v. 2.0. If a copy of the MPL was not distributed with this                  *
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.                             *
 ****************************************************************************************/

if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

require 'memplex.register.class.php';

/**
 * A Memplex is the central datastructure of BasDeM, representing everything the user
 * may want to add or view in the system.
 */
class Memplex {
    private $id;
    private $children = array();
    private $childarray = array();
    private $favored = 0;
    private $selffavored = 0;
    private $author = 'Anonym';
    private $authorId;
    private $title = '';
    private $text = '';
    private $layer;
    private $moderationState = null;

    private $memplexRegister;
    
    /** Constructor.
     * @param integer $id ID of the memplex to load or array with 'author', 'title', 'text'
     * and 'layer' keys to create a new one. An empty memplex is created if $id is omitted.
     *
     * @return The new Memplex.
     */
    public function __construct(MemplexRegister $memplexRegister = null) {
        $this->reset(); 

        $this->memplexRegister = is_null($memplexRegister)
            ? new MemplexRegister
            : $memplexRegister;
    }

    private function reset() {
        $this->id = null;
        $this->children = array();
        $this->setAuthor(null);
        $this->setTitle(null);
        $this->setText(null);
        $this->setLayer(null);
        $this->setFavored(0);
        $this->setSelfFavored(0);
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
            $tmp = $this->memplexRegister->get($child);
            if ( is_null($tmp) ) {
                continue;
            }
            $tmp->loadChildrenRecursive($level);
            $array = $tmp->toArray($level);
            if ( count($array) == 0 ) {
                continue;
            }
            $this->childarray[] = $array;
        }
    }
    
    private function createMemplex($id = null) {
        if ( is_null($id) || !is_array($id) ) {
            return;
        }
        
        if ( !isset($id['title'])
            || !isset($id['text'])
            || !isset($id['layer']) ) {
            return;
        }
        
        $this->setAuthorId(User::getId());
        $this->setTitle($id['title']);
        $this->setText($id['text']);
        $this->setLayer($id['layer']);
    }
    
    /**
     * Stores the Memplex permanently in the database.
     */
    public function store() {
        if($this->isNew()) {
            $this->id = $this->memplexRegister->create($this);
        } else {
            $this->id = $this->memplexRegister->update($this);
        }
    }

    public function isNew() {
        return (bool) $this->id;
    }
    
    /**
     * Returns the Memplex contents as array.
     *
     * @return Array with Keys: 'id', 'author', 'title', 'text', 'layer' and 'children'.
     */
    public function toArray() {
        if ( $this->getLayer() === 0 ) {
            return array();
        }
        return array(
            'id' => $this->getId(),
            'author' => array(
                'nick' => $this->getAuthor(),
                'id' => $this->getAuthorId(),
            ),
            'title' => $this->getTitle(),
            'text' => $this->getText(),
            'layer' => $this->getLayer(),
            'moderationstate' => $this->getModerationState(),
            'favored' => $this->getFavored(),
            'selffavored' => $this->getSelfFavored(),
            'children' => $this->childarray,
        );
    }
    
    /**
     * Sets the ID of the Memplex.
     *
     * @param int $id The new ID.
     */
    public function setId($id) {
        $this->id = (int) $id;
    }
    
    /**
     * Returns the ID of the Memplex.
     *
     * @return int The ID of the Memplex.
     */
    public function getId() {
        return $this->id;
    }
    
    /**
     * Sets the number of selffavors of the Memplex. FIXME: what distinguished selffavored from favored?
     *
     * @param int $selffavored New number of favors.
     */
    public function setSelfFavored($selffavored) {
        $this->selffavored = (int) $selffavored;
    }
    
    /**
     * Returns the number of selffavors of the Memplex. FIXME: what distinguished selffavored from favored?
     *
     * @return int The number of selffavors of the Memplex.
     */
    public function getSelfFavored() {
        return $this->selffavored;
    }
    
    /**
     * Sets the number of favors of the Memplex. FIXME: what distinguished selffavored from favored?
     *
     * @param int $favored New number of favors.
     */
    public function setFavored($favored) {
        $this->favored = (int) $favored;
    }
    
    /**
     * Returns the number of favors of the Memplex. FIXME: what distinguished selffavored from favored?
     *
     * @return int The number of favors of the Memplex.
     */
    public function getFavored() {
        return $this->favored;
    }

    /**
     * Adds a child to the Memplex.
     *
     * @param int $id ID of the new child.
     */
    public function addChild($id) {
        Database::addChild($this->id,$id);
        $this->children[] = $id;
    }

    /**
     * Returns the IDs of the children of the Memplex.
     *
     * @return array with IDs of the children.
     */
    public function getChildren() {
        return $this->children;
    }
    
    /**
     * Sets the moderation state of the Memplex.
     *
     * @param int $state The new moderation state.
     */
    public function setModerationState($state) {
        $this->moderationState = (int) $state;
    }
    
    /**
     * Get the moderation state of the Memplex.
     *
     * @return int The moderation state.
     */
    public function getModerationState() {
        return $this->moderationState;
    }
    
    /**
     * Sets the author of the Memplex.
     *
     * @param string $author The new author.
     */
    public function setAuthor($author) {
        if ( empty($author) || is_null($author) ) {
            $this->author = 'Anonym';
        } else {
            $this->author = $author;
        }
    }
    
    /**
     * Sets the authorid of the Memplex.
     *
     * @param int $id The new authorid.
     */
    public function setAuthorId($id) {
        $this->authorId = $id;
    }
    
    /**
     * Returns the author of the Memplex, escaped for HTML injection security.
     *
     * @param boolean $escaped Set it to false if you don't need escaped HTML output (optional).
     *
     * @return The author of the Memplex.
     */
    public function getAuthor($escaped = true) {
        if ( $escaped ) {
            return htmlentities($this->author);
        } else {
            return $this->author;
        }
    }
    
    /**
     * Returns the authorid of the Memplex.
     *
     * @return The authorid of the Memplex.
     */
    public function getAuthorId($escaped = true) {
        return $this->authorId;
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
     * Returns the title of the Memplex, escaped for HTML injection security.
     *
     * @param boolean $escaped Set it to false if you don't need escaped HTML output (optional).
     *
     * @return The title of the Memplex.
     */
    public function getTitle($escaped = true) {
        if ( $escaped ) {
            return htmlentities($this->title);
        } else {
            return $this->title;
        }
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
     * Returns the text of the Memplex, escaped for HTML injection security.
     *
     * @param boolean $escaped Set it to false if you don't need escaped HTML output (optional).
     *
     * @return The text of the Memplex.
     */
    public function getText($escaped = true) {
        if ( $escaped ) {
            return htmlentities($this->text);
        } else {
            return $this->text;
        }
    }
    
    /**
     * Sets the layer of the Memplex.
     *
     * The various layers are documented in our UML documentation at
     * https://github.com/Kevin423/BasDeM/blob/master/docs/BasDeM.png
     *
     * @param int $layer The new layer.
     */
    public function setLayer($layer) {
        $this->layer = (int) $layer;
    }
    
    /**
     * Returns the layer of the Memplex.
     *
     * The various layers are documented in our UML documentation at
     * https://github.com/Kevin423/BasDeM/blob/master/docs/BasDeM.png
     *
     * @return int The layer of the Memplex.
     */
    public function getLayer() {
        return $this->layer;
    }
}
?>
