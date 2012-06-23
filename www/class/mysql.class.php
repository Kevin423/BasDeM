<?
if ( !defined('INCMS') || INCMS !== true ) {
        die;
}

class PDOConfig extends PDO {
	private $engine;
	private $host;
	private $database;
	private $user;
	private $pass;

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

class Database {
	static private $connection;
	static private $statements;
	
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
	
	static private function query($query,$params = null,$return = false,$debug = false) {
		if ( $debug ) 
			echo $query,NL;
		
		$hash = md5($query);
		if ( !isset(self::$statements[$hash]) )
			self::$statements[$hash] = self::$connection->prepare($query);
		
		foreach ( $params as $param ) {
			self::$statements[$hash]->bindParam($param[0], utf8_decode($param[1]), $param[2]);
		}
		
		if ( self::$statements[$hash]->execute() === false ) {
			if ( $debug ) 
				print_r(self::$statements[$hash]->errorInfo());
			return false;
		}
		
		if ( $return === true )
			return self::$statements[$hash]->fetchAll();
		
		return self::$connection->lastInsertId();
	}
	
	static public function getMemplex($identifier) {
		return self::query(
			"SELECT * FROM `memplex` JOIN `texts` WHERE `id` = :identifier ",
			array(
				array(':identifier',$identifier,PDO::PARAM_INT),
			),
			true
		);
	}
}
?>