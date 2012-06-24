<?php
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
    
    public function Memplex($id = null) {
        if ( is_null($id) ) {
            $this->createMemplex();
        } else {
            $this->loadMemplex($id);
        }
    }
    
    private function loadMemplex($id) {
        $tmp = Database::getMemplex($id);
        echo "bla: "  . $id , NL;
        print_r($tmp);
        echo "bla";
        $this->id = $tmp[0]['id'];
        $this->author = $tmp[0]['author'];
        $this->title = $tmp[0]['title'];
        $this->text = $tmp[0]['text'];
        $this->layer = $tmp[0]['layer'];
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