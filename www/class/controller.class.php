<?
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

class Controller {
    private $createdid = null;

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
        
        #$this->updateMemplexData();
        
        #$this->updateChildRelations();
        
        $this->loadMemplexChildren();
        
        $this->showMemplex();
    }
    
    private function reloadMemplex() {
        $this->memplex = new Memplex($this->memplex->getId());
    }
    
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
    
    private function showMemplex() {
        echo json_encode(array(
            'success' => true,
            'time' => time(),
            'createdid' => $this->createdid,
            'data' => $this->memplex->toArray(),
        ));
    }
    
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
    
    private function checkMemplexLoaded() {
        return !is_null($this->memplex->getTitle());
    }
    
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