<?php
namespace lib\easy_php;
class EasyConfig {
	private $confDir = '';
	/**
	 * 构造函数
	 * 
	 * @param
	 *        	NULL
	 * @return NULL
	 */
	public function __construct() {
		$this->confDir = CONFIG_DIR;
		if (! file_exists ( $this->confDir )) {
			exit ( 'ERROR: 亲，请设定配置文件目录[CONFIG_DIR]先！' );
		}
	}
	public function setConfDir($dir){
		$Config = self::_getInstance ();
		$Config->confDir = CONFIG_DIR.'/'.$dir;
	}
	/**
	 * 获取配置文件的内容
	 *
	 * @param string $keyName
	 *        	配置字段的值
	 * @return mixd[]
	 * @example EasyConfig::get('db.mysql.host')
	 */
	public static function get($keyName) {
		// 注册模式
		static $confReg = array ();
		static $keyNameReg = array ();
		
		if (isset ( $keyNameReg [$keyName] )) {
			return $keyNameReg [$keyName];
		}
		
		$Config = self::_getInstance ();
		$confArr = explode ( '.', $keyName );
		$fileName = array_shift ( $confArr );
		$fileName = strtolower ( $fileName );
		
		if (! isset ( $confReg [$fileName] )) {
			$confPath = $Config->confDir . '/' . $fileName . '.php';
			if (! file_exists ( $confPath )) {
				exit ( 'ERROR: 亲，配置文件[' . $fileName . ']不存在！' );
			}
			
			$CONF = null;
			require $confPath;
			
			$confReg [$fileName] = $CONF;
		} else {
			$CONF = $confReg [$fileName];
		}
		
		if (! $CONF) {
			return null;
		}
		foreach ( $confArr as $key ) {
			if (! isset ( $CONF [$key] )) {
				EasyLog::error ( 'The config of ' . $keyName . ' is undefine' );
				exit ( 'ERROR: 亲，[' . $keyName . ']没有定义！' );
			}
			$CONF = $CONF [$key];
		}
		
		$keyNameReg [$keyName] = $CONF;
		return $CONF;
	}
	
	/**
	 * 单件
	 *
	 * @return object
	 */
	private static function _getInstance() {
		if (isset ( $this ) && is_object ( $this ) && $this instanceof EasyConfig) {
			return $this;
		}
		static $Config = null;
		if (! $Config) {
			$Config = new EasyConfig ();
		}
		return $Config;
	}
}