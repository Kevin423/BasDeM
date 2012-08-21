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
 *
 */
class Controller {
    private $createdid = null;

    /** Constructs a new Controller based on POST data.
     *
     */
    public function __construct() {
        if ( !isset($_POST['id']) ) {
            #print_r($_POST);
            if ( empty($_POST['parent'])
                || empty($_POST['text'])
                || empty($_POST['layer'])
                || empty($_POST['loadid'])
                || empty($_POST['title']) ) {
                echo json_encode(array('success' => false));
                return;
            }
            foreach ( $_POST['parent'] as $parent ) {
                if ( is_array($parent) ) {
                    echo json_encode(array('success' => false));
                    return;
                }
            }
            // Create a new Memplex.
            $this->createMemplex();
            
            
            if ( $this->memplex->getLayer() == 4 ) {
                $this->createdid = $_POST['parent'][0];
            } else {
                $this->createdid = $this->memplex->getId();
            }
            
            $_POST['id'] = $_POST['loadid'];
            
            MemplexRegister::reset();
            
            // $this->reloadMemplex();
            
            // $this->showMemplex();
            // return;
        }
        
        // Load or edit an existing Memplex. Editing disabled for now.
        $this->loadTargetMemplex();
        
        if ( !$this->checkMemplexLoaded() ) {
            echo json_encode(array('success' => false));
            return;
        }
        
        $this->updateMemplexFavorite();
        
        $this->updateMemplexModerationState();
        
        #$this->updateMemplexData();
        
        #$this->updateChildRelations();
        
        $this->loadMemplexChildren();
        
        $this->showMemplex();
    }

    /** Reloads the current Memplex.
     *
     */
    private function reloadMemplex() {
        $this->memplex = new Memplex($this->memplex->getId());
    }

    /** Creates a new Memplex and stores it to the database, including updated parent/child relations.
     *
     */
    private function createMemplex() {
        $this->memplex = new Memplex(array(
            'text' => $_POST['text'],
            'layer' => $_POST['layer'],
            'title' => $_POST['title'],
            'author' => 'System',// TODO: Load author from user class
        ));
        $this->memplex->store();
        MemplexRegister::reg($this->memplex);
        
        if ( is_array($_POST['parent']) ) {
            foreach ( $_POST['parent'] as $pdata ) {
                $parent = MemplexRegister::get($pdata);
                $parent->addChild($this->memplex->getId());
            }
        } else if ( is_num($_POST['parent']) ) {
            $parent = MemplexRegister::get($_POST['parent']);
            $parent->addChild($this->memplex->getId());
        }
    }

    /** Debug method, prints the current Memplex data.
     *
     */
    private function showMemplex() {
        echo json_encode(array(
            'success' => true,
            'time' => time(),
            'createdid' => $this->createdid,
            'data' => $this->memplex->toArray(),
            'user' => array(
                'id' => User::getId(),
                'moderator' => User::isModerator(),
            ),
        ));
    }

    /** Loads the children of the current Memplex. 3 levels deep, if we work with a layer 1 Memplex,
     * everything below the current Memplex if we are on layer 4.
     */
    private function loadMemplexChildren() {
        if ( $this->memplex->getLayer() == 1 ) {
            // Load 3 levels
            $this->memplex->loadChildrenRecursive(3);
        } else if ( $this->memplex->getLayer() == 4 ) {
            // Load everything recursive
            $this->memplex->loadChildrenRecursive(-1);
        }
    }
    
    /** Loads the target Memplex specified bei $_POST['id'].
    *
    **/
    private function loadTargetMemplex() {
        
        $this->memplex = MemplexRegister::get($_POST['id']);
    }

    /** Checks if the current Memplex has been loaded.
     * @return True if loaded, else false.
     */
    private function checkMemplexLoaded() {
        return !is_null($this->memplex->getTitle());
    }

    /** Updates a memplexes moderation state based upon POST data.
     * @return False if POST data was incomplete (moderationstate,parent), else true.
     */
    private function updateMemplexFavorite() {
        if ( !isset($_POST['favorite']) ) {
            return false;
        }
        
        switch ( $_POST['favorite'] ) {
            case '0': Database::unSetFavored($_POST['id'],User::getId()); break;
            case '1': Database::setFavored($_POST['id'],User::getId()); break;
        }
        
        MemplexRegister::reset();
        
        $_POST['id'] = $_POST['parent'];
        
        $this->loadTargetMemplex();
        
        return true;
    }

    /** Updates a memplexes moderation state based upon POST data.
     * @return False if POST data was incomplete (moderationstate,parent), else true.
     */
    private function updateMemplexModerationState() {
        if ( !isset($_POST['moderationstate'])
            || !isset($_POST['parent']) ) {
            return false;
        }
        
        $this->memplex->setModerationState($_POST['moderationstate']);
        
        $this->memplex->store();
        
        MemplexRegister::reset();
        
        $_POST['id'] = $_POST['parent'];
        
        $this->loadTargetMemplex();
        
        if ( $this->memplex->getLayer() <= 3 ) {
            $_POST['id'] = 1;
            $this->loadTargetMemplex();
        }
        
        return true;
    }

    /** Updates a memplex based upon POST data.
     * @return False if POST data was incomplete (text, layer, title, author), else true.
     */
    private function updateMemplexData() {
        if ( !isset($_POST['text'])
            || !isset($_POST['layer'])
            || !isset($_POST['title'])
            || !isset($_POST['author']) ) {
            return false;
        }
        
        $this->memplex->setText($_POST['text']);
        $this->memplex->setLayer($_POST['layer']);
        $this->memplex->setTitle($_POST['title']);
        $this->memplex->setAuthor($_POST['author']);
        
        $this->memplex->store();
        
        return true;
    }

    /** Updates child relations in the database, if POST data contains new children.
     *
     */
    private function updateChildRelations() {
        if ( isset($_POST['children']) && is_array($_POST['children']) ) {
            foreach ( $_POST['children'] as $this->memplex ) {
                $this->memplex->addChild($this->memplex);
            }
        }
        
        if ( isset($_POST['parent']) ) {
            $parent = MemplexRegister::get($_POST['parent']);
            $parent->addChild($this->memplex->getId());
        }
    }
}

?>
