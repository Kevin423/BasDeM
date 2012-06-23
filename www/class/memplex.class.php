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
		
	}
	
	private function createMemplex($id) {
		$this->id = null;
		$this->children = array();
		$this->author = null;
		$this->title = null;
		$this->text = null;
		$this->layer = null;
	}
	
	private function storeMemplex() {
		
	}
	
	public setId($id) {
		$this->id = $id;
	}
	
	public getId() {
		return $this->id;
	}
	
	public addChild($id) {
		$this->children[] = $id;
	}
	
	public getChildren() {
		return $this->children;
	}
	
	public setAuthor($author) {
		$this->author = $author;
	}
	
	public getAuthor($author) {
		return $this->author;
	}
	
	public setTitle($title) {
		$this->title= $title;
	}
	
	public getTitle($title) {
		return $this->title;
	}
	
	public setText($text) {
		$this->text = $text;
	}
	
	public getText($text) {
		return $this->text;
	}
	
	public setLayer($layer) {
		$this->layer = $layer;
	}
	
	public getLayer($layer) {
		return $this->layer;
	}
}
?>