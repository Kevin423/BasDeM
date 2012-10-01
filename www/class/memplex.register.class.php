<?php
/****************************************************************************************
 * Copyright (c) 2012 Justus Wingert <justus_wingert@web.de>                            *
 * Copyright (c) 2012 defel <defel@gmx.de>                                              *
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

require_once __DIR__ . '/Exceptions/MemplexNotFoundException.class.php';

/**
 * An array containing Memplex objects.
 */
class MemplexRegister {
    private static $memplexCache = array();
    private static $database = NULL;
    
    /**
     * load a memplex
     */
    public static function load($id=NULL) {
        if ( is_array($id) ) {
            // load memplex by values
            return self::getByValues($id);
        } else if ( is_numeric($id)) {
            // load memplex by id
            return self::get($id);
        }
        // return empty memplex
        return self::getEmptyMemplex();
    }

    /**
     * get empty memplex
     *
     * @return Memplex 
     */
    public static function getEmptyMemplex() {
        return new Memplex();
    }

    /**
     * get a list of memplexes by ids
     * 
     * @param array ids
     * @return MemplexList
     */
    public static function getMemplexListByIds($ids) {
        $list = new MemplexList();
        foreach($ids as $id) {
            $list->append(
                self::get($id)
            );
        }
        return $list;
    }

    /**
     * Returns the Memplex identified by $id and automatically registers it.
     * No database access is needed if the Memplex has alredy been registered using reg().
     *
     * @param int $id ID of the Memplex to load.
     *
     * @return Memplex
     *   - null if the ID is not numeric, 
     *   - the Memplex to load if the ID is valid
     *   - or an empty Memplex if the ID does not yet exist.
     */
    public static function get($id) {
        if ( !is_numeric($id) ) {
            return null;
        }
        if ( !isset(self::$memplexCache[$id]) ) {
            // cache miss, load by id, register
            self::register(
                self::loadMemplexById($id, User::getId())
            );
        }
        return self::$memplexCache[$id];
    }
    
    /**
     * Registers a new Memplex.
     *
     * @param Memplex $memplex The Memplex to register.
     */
    public static function register(Memplex $memplex) {
        self::$memplexCache[$memplex->getId()] = $memplex;
    }
    
    /**
     * Reset the cache of register
     */
    public static function reset() {
        self::$memplexCache = array();
    }

    /**
     * get by values
     */
    public static function getByValues($values) {
        $memplex = new Memplex();
        if(isset($values['id'])) $memplex->setId($values['id']);
        if(isset($values['author'])) $memplex->setAuthor($values['author']);
        if(isset($values['authorid'])) $memplex->setAuthorId($values['authorid']);
        if(isset($values['state'])) $memplex->setModerationState($values['state']);
        if(isset($values['title'])) $memplex->setTitle($values['title']);
        if(isset($values['text'])) $memplex->setText($values['text']);
        if(isset($values['layer'])) $memplex->setLayer($values['layer']);
        if(isset($values['favored'])) $memplex->setFavored($values['favored']);
        if(isset($values['selffavored'])) $memplex->setSelfFavored($values['selffavored']);
        return $memplex;
    }

    /**
     * load Memplex by id from database
     * 
     * @param int id
     * @param int user id
     * @return Memplex
     * 
     */
    public static function loadMemplexById($id, $user_id) {
        $memplex_data = self::$database->getMemplex($id, $user_id);
        
        if(0 === count($memplex_data)) {
            throw new MemplexNotFoundException("Error Processing Request", 1);
        }

        $memplex = new Memplex();
        $memplex->setId($memplex_data[0]['id']);
        $memplex->setAuthor($memplex_data[0]['author']);
        $memplex->setAuthorId($memplex_data[0]['authorid']);
        $memplex->setModerationState($memplex_data[0]['state']);
        $memplex->setTitle($memplex_data[0]['title']);
        $memplex->setText($memplex_data[0]['text']);
        $memplex->setLayer($memplex_data[0]['layer']);
        $memplex->setFavored($memplex_data[0]['favored']);
        $memplex->setSelfFavored($memplex_data[0]['selffavored']);

        foreach ( $memplex_data as $key => $value ) {
            if ( empty($value['child']) ) {
                continue;
            }
            $memplex->addChild($value['child']);
        }

        return $memplex;
    }

    /**
     * create memplex
     *
     * @param Memplex
     * @return int insert memplex id
     */
    public static function create(Memplex $memplex) {
        #var_dump('RET:', self::$database, self::$database->__phpunit_getInvocationMocker(), self::$database->__phpunit_getStaticInvocationMocker());
        return self::$database->createMemplex(array(
            'author' => $memplex->getAuthorId(false),
            'title' => $memplex->getTitle(false),
            'text' => $memplex->getText(false),
            'layer' => $memplex->getLayer(),
        ));
    }

    /**
     * persistent update memplex
     *
     * @param Memplex
     * @return int update memplex id
     */
    public static function update(Memplex $memplex) {
        return self::$database->storeMemplex(array(
            'id' => $memplex->getId(),
            'author' => $memplex->getAuthorId(false),
            'title' => $memplex->getTitle(false),
            'text' => $memplex->getText(false),
            'layer' => $memplex->getLayer(),
            'moderationstate' => $memplex->getModerationState(),
        ));
    }

    /**
     * persistent delete memplex
     * 
     * @param Memplex
     * @return bool
     */
    public function delete(Memplex $memplex) {
        // TBD
    }

    public static function setDatabase(Database $database) {
        self::$database = $database;
    }
}

?>
