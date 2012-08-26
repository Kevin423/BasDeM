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

/**
 * A PDO instance representing a connection to the database, including current config.
 */
class PDOConfig extends PDO {
    private $engine;
    private $host;
    private $database;
    private $user;
    private $pass;

    /**
     * Creates a PDO instance representing a connecting to the database according to $config.
     *
     * @param Config $config The config array describing the database connection.
     */
    public function __construct($config){
        $this->engine = $config['engine'];
        $this->host = $config['host'];
        $this->database = $config['database'];
        $this->user = $config['user'];
        $this->pass = $config['password'];
        $dns = $this->engine.':dbname='.$this->database.";host=".$this->host;
        parent::__construct( $dns, $this->user, $this->pass );
    }

}

/**
 * 
 */
class Database {
    static private $connection;
    static private $statements;
    
    /**
      * Initializes the database connection using the PDOConfig class according to the Config settings.
      */
    static public function init() {
        self::$statements = array();
        self::$connection = new PDOConfig(array(
            'engine' => Config::get('database','engine'),
            'host' => Config::get('database','host'),
            'database' => Config::get('database','database'),
            'user' => Config::get('database','user'),
            'password' => Config::get('database','password'),
        ));
    }

    /**
      * Issues a query to the database.
      *
      * @param string $query The query to run.
      * @param array $params Parameters of the query.
      * @param boolean $return Switch deciding what to return. 
      * @param boolean $debug Defines if the query should be printed to debug (optional).
      *
      * @return Array of result set rows if $return === true, ID of the last inserted
      * row otherwise.
      */    
    static private function query($query,$params = null,$return = false,$debug = false) {
        if ( $debug ) 
            echo $query,NL;
        
        $hash = md5($query);
        if ( !isset(self::$statements[$hash]) )
            self::$statements[$hash] = self::$connection->prepare($query);
        
        foreach ( $params as $param ) {
            self::$statements[$hash]->bindParam(
                $param[0],
                utf8_decode($param[1]),
                $param[2]
            );
        }
        
        if ( self::$statements[$hash]->execute() === false ) {
            if ( $debug ) 
                print_r(self::$statements[$hash]->errorInfo());
            return false;
        }
        
        if ( $return === true ) {
            return self::$statements[$hash]->fetchAll();
        }
        
        return self::$connection->lastInsertId();
    }

    /**
      * Adds a child to a Memplex in the database.
      *
      * @param integer $parent ID of the parent.
      * @param integer $child ID of the child.
      */    
    static public function addChild($parent,$child) {
        return self::query(
            "insert into `children` set `parent` = :parent, `child` = :child",
            array(
                array(':parent',$parent,PDO::PARAM_INT),
                array(':child',$child,PDO::PARAM_INT),
            ),
            true
        );
    }
    
    /**
      * Fetches a Memplex from the database.
      *
      * @param integer $identifier ID of the Memplex to load.
      * @param integer $user UserID of calling user.
      *
      * @return Array of result set rows.
      */ 
    public static function getMemplex($identifier,$user) {
        /*
        TODO: Select comments by layer and parent relation to both L4 and L5+
        */
        $tmp = self::query(
"select
    memplex.id,
    memplex.layer,
    texts.content as text,
    titles.content as title,
    users.nickname as author,
    authors.userid as authorid,
    children.child as child,
    m1.state as state,
    m2.state as state2,
    count(favorite.user) as favored,
    selffavorite.user as selffavored
from
    memplex
join
    texts ON texts.id = memplex.id
join
    titles ON titles.id = memplex.id
join
    authors ON authors.id = memplex.id
join
    users ON authors.userid = users.id
left join
    children ON children.parent = memplex.id
left join
    favorite ON favorite.id = memplex.id
left join
    favorite as selffavorite ON selffavorite.id = memplex.id AND selffavorite.user = :user
left join
    moderation as m1 ON m1.id = memplex.id
left join
    moderation as m2 ON m2.id = children.child
where
    memplex.id = :identifier
    AND ( 1 OR memplex.id = :user )
    AND ( m1.state is null OR ( m1.state <> 1 AND m1.state <> 2 ) )
group by
    memplex.id, children.child",
   // AND memplex.time > :time",
            array(
                array(':identifier',$identifier,PDO::PARAM_INT),
                array(':user',$user,PDO::PARAM_INT),
            ),
            true,
            false
        );
        return $tmp;
    }
    
    /**
      * Adds a new Memplex to the database.
      *
      * @param array $data Data describing the Memplex.
      * @return ID of the new Memplex.
      */
    static public function createMemplex($data) {
        
        // TODO: make it work in a not insane way.
        $id = self::query(
            "insert into `memplex` set `layer` = :layer",
            array(
                array(':layer',$data['layer'],PDO::PARAM_INT),
            )
        );
        self::query(
            "insert into `authors` set `userid` = :author, `id` = :id",
            array(
                array(':author',$data['author'],PDO::PARAM_INT),
                array(':id',$id,PDO::PARAM_INT),
            )
        );
        self::query(
            "insert into `titles` set `content` = :content, `id` = :id",
            array(
                array(':content',$data['title'],PDO::PARAM_STR),
                array(':id',$id,PDO::PARAM_INT),
            )
        );
        self::query(
            "insert into `texts` set `content` = :content, `id` = :id",
            array(
                array(':content',$data['text'],PDO::PARAM_STR),
                array(':id',$id,PDO::PARAM_INT),
            )
        );
        
        return $id;
    }
    
    /**
      * Updates an existing Memplex.
      *
      * @param array $data Data describing the Memplex.
      */ 
    static public function storeMemplex($data) {
        // TODO: make it work in a not insane way.
        self::query(
            "update `memplex` set `layer` = :layer where `id` = :id",
            array(
                array(':layer',$data['layer'],PDO::PARAM_INT),
                array(':id',$data['id'],PDO::PARAM_INT),
            )
        );
        self::query(
            "update `authors` set `userid` = :author where `id` = :id",
            array(
                array(':author',$data['author'],PDO::PARAM_INT),
                array(':id',$data['id'],PDO::PARAM_INT),
            )
        );
        self::query(
            "insert into `oldtitles` set `text` = (select `content` from `titles` where `id` = :id), `id` = :id, `time` = :time",
            array(
                array(':id',$data['id'],PDO::PARAM_INT),
                array(':time',time(),PDO::PARAM_INT),
            )
        );
        self::query(
            "update `titles` set `content` = :content where `id` = :id",
            array(
                array(':content',$data['title'],PDO::PARAM_STR),
                array(':id',$data['id'],PDO::PARAM_INT),
            )
        );
        self::query(
            "insert into `oldtexts` set `text` = (select `content` from `texts` where `id` = :id), `id` = :id, `time` = :time",
            array(
                array(':id',$data['id'],PDO::PARAM_INT),
                array(':time',time(),PDO::PARAM_INT),
            )
        );
        self::query(
            "update `texts` set `content` = :content where `id` = :id",
            array(
                array(':content',$data['text'],PDO::PARAM_STR),
                array(':id',$data['id'],PDO::PARAM_INT),
            )
        );
        if ( !is_null($data['moderationstate']) ) {
            self::query(
                "insert into `moderation` set `state` = :state, `id` = :id on duplicate key update `state` = :state",
                array(
                    array(':state',$data['moderationstate'],PDO::PARAM_INT),
                    array(':id',$data['id'],PDO::PARAM_INT),
                )
            );
        }
    }

    /**
      * Sets verification entry for a user.
      *
      * @param int $id UserID.
      */
    static public function setVerified($id) {
        return self::query(
            "update `users` set `verified` = '' where `id` = :id",
            array(
                array(':id',$id,PDO::PARAM_INT),
            )
        );
    }
    
    /**
      * Adds a favor entry into the database.
      *
      * @param int $id MemplexID.
      * @param int $user UserID.
      * @return ID of the new database row.
      */
    static public function setFavored($id,$user) {
        return self::query(
            "insert into `favorite` set `id` = :id, `user` = :user",
            array(
                array(':id',$id,PDO::PARAM_INT),
                array(':user',$user,PDO::PARAM_INT),
            )
        );
    }
    
    /**
      * Removes a favor entry from the database.
      *
      * @param int $id MemplexID.
      * @param int $user UserID.
      */
    static public function unSetFavored($id,$user) {
        self::query(
            "delete from `favorite` where `id` = :id and `user` = :user",
            array(
                array(':id',$id,PDO::PARAM_INT),
                array(':user',$user,PDO::PARAM_INT),
            )
        );
    }

    /**
      * Adds a user to the database.
      *
      * @param string $mail Mail address.
      * @param string $password Hashed password.
      * @param string $verified E-Mail verification string.
      * @return ID of the new database row.
      */
    static public function createUser($mail,$password,$verified) {
        return self::query(
            "insert into `users` set `email` = :mail, `password` = :password, `verified` = :verified",
            array(
                array(':mail',$mail,PDO::PARAM_STR),
                array(':password',$password,PDO::PARAM_STR),
                array(':verified',$verified,PDO::PARAM_STR),
            )
        );
    }
    
    /**
      * Change a user nickname in the database.
      *
      * @param string $id ID of the user.
      * @param string $nickname New nickname.
      */
    static public function setNickname($id,$nickname) {
        self::query(
            "update `users` set `nickname` = :nickname where `id` = :id",
            array(
                array(':id',$id,PDO::PARAM_INT),
                array(':nickname',$nickname,PDO::PARAM_STR),
            )
        );
    }
    
    /**
      * Change a user password in the database.
      *
      * @param string $id ID of the user.
      * @param string $passwordold Old password.
      * @param string $password New password.
      */
    static public function setPassword($id,$passwordold,$password) {
        return self::query(
            "update `users` set `password` = :password where `id` = :id and `password` = :passwordold ",
            array(
                array(':id',$id,PDO::PARAM_INT),
                array(':passwordold',$passwordold,PDO::PARAM_STR),
                array(':password',$password,PDO::PARAM_STR),
            )
        );
    }

    /**
      * Checks for a user in the database.
      *
      * @param string $mail Mail address.
      * @param string $password Hashed password.
      * @return Array of result set rows.
      */
    static public function getUser($mail,$password) {
        return self::query(
            "select `users`.*,`userrights`.`moderator` as `moderator`,`userrights`.`supermoderator` as `supermoderator` from `users` left join `userrights` on `userrights`.`id` = `users`.`id` where `email` = :mail and `password` = :password",
            array(
                array(':mail',$mail,PDO::PARAM_STR),
                array(':password',$password,PDO::PARAM_STR),
            ),
            true
        );
    }
}
?>
