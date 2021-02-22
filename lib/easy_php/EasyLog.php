<?php
namespace lib\easy_php;
/**
 * 日志类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyLog {
	public static $_log_path;
	public static $_date_fmt = 'Y-m-d H:i:s';
	public static $_enabled = TRUE;
	public static function _init() {
		self::$_log_path = APP_DIR.'/logs';
		if (! is_dir ( self::$_log_path ) || ! is_writable ( self::$_log_path )) {
			self::$_enabled = FALSE;
			exit ( 'ERROR:目录[' . self::$_log_path . ']不可写入，请为其设置可写权限先！' );
		}
	}
	
	/**
	 * 记录log
	 *
	 * @param
	 *        	string	the error message
	 * @param
	 *        	string	the error level
	 * @return bool
	 */
	public static function log($msg, $level = 'error') {
		if (self::$_enabled === FALSE) {
			exit;
		}
		self::_init ();
		$level = strtoupper ( $level );
		
		$filepath = self::$_log_path . '/' . $level . '-' . date ( 'Y-m-d' ) . '.log';
		$message = '';
		if (! $fp = @fopen ( $filepath, 'ab' )) {
			return exit;
		}

// 		$message .= $level . '-' . date ( self::$_date_fmt ) . ' --> ' . $msg . "\n";
		$message .= date ( self::$_date_fmt ) . ' --> ' . $msg . "\n";
		
		flock ( $fp, LOCK_EX );
		fwrite ( $fp, $message );
		flock ( $fp, LOCK_UN );
		fclose ( $fp );
		
		@chmod ( $filepath, 0666 );
	}

    /**
     * @desc 记录错误 log
     * @param string $msg
     */
	public static function error($msg=''){
	    self::log($msg,'error');
    }
}