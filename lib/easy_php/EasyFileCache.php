<?php
namespace lib\easy_php;
/**
 * 文件缓存类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyFileCache {
	private static $cache_dir =  FILE_CACHE_ROOT;// 缓存目录
	private static $cache_time = 3600;// 缓存时间 3600
	
	public static function __get_filename($key = false, $cache_dir = false){
		if (!$key){
			return false;
		}
		$cache_dir = !$cache_dir ? self::$cache_dir : $cache_dir;
		$key = md5($key);
		return rtrim($cache_dir,'/').'/'.substr($key,0,2).'/'.substr($key,2,2).'/'.substr($key,4,2).'/'.$key;
	}
	public static function __mkdir($dir = false){
		if (!$dir){
			return false;
		}
		if (file_exists($dir)){
			@chmod($dir, 0777);
			return true;
		}
		if (@mkdir($dir, 0777, true)){
			@chmod($dir, 0777);
			return true;
		}
		return false;
	}
	/**
	 * 取出key对应的value
	 * @param string $key 缓存key
	 * @param string $cache_dir 缓存目录
	 * @return boolean|mixed
	 */
	public static function get($key = false, $cache_dir = false){
		if (!$key){
			return false;
		}
		$cache_filename = self::__get_filename($key, $cache_dir);
		if (!file_exists($cache_filename)){
			return false;
		}
		$data = file_get_contents($cache_filename);
		$data = unserialize($data);
		if ((int)$data['timestamp'] > time()){
			return $data['data'];
		}
		return false;
	}
	/**
	 * 设置key对应的value
	 * @param string $key 缓存key
	 * @param string $value 缓存值
	 * @param int $cache_time 缓存时长
	 * @param string $cache_dir 缓存目录
	 * @return boolean
	 */
	public static function set($key = false, $value = false, $cache_time = 0, $cache_dir = false){
		if (!$key || !$value){
			return false;
		}
		$cache_time = $cache_time ? $cache_time : self::$cache_time;
		$cache_filename = self::__get_filename($key, $cache_dir);
		if (!self::__mkdir(dirname($cache_filename))){
			return false;
		}
		@chmod($cache_filename, 0777);
		$data['timestamp'] = time() + $cache_time;
		$data['data'] = $value;
		$data = serialize($data);
		if (PHP_VERSION >= '5'){
			file_put_contents($cache_filename, $data);
		}else {
			$handle = fopen($cache_filename, 'wb');
			fwrite($handle, $data);
			fclose($handle);
		}
        @chmod($cache_filename, 0777);
		return true;
	}
	/**
	 * 删除key对应的value
	 * @param string $key
	 * @param string $cache_dir
	 * @return boolean
	 */
	public static function del($key = false, $cache_dir = false){
		if (!$key){
			return false;
		}
		@unlink(self::__get_filename($key , $cache_dir));
		return true;
	}
}