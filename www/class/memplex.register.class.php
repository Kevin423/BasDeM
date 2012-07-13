<?php

class MemplexRegister {
    private static $memplexlist = array();
    
    public static function get($id) {
        if ( !is_int($id) ) {
            return null;
        }
        if ( !isset(self::$memplexlist[$id]) ) {
            self::$memplexlist[$id] = new Memplex($id);
            return self::$memplexlist[$id];
        }
        return self::$memplexlist[$id];
    }
    
    public static function reg($memplex) {
        self::$memplexlist[$memplex->getId()] = $memplex;
    }
}

?>