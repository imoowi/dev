<?php
namespace lib\easy_php;
/**
 * @desc 文件操作类
 * 
 * expample:
 * 
 * EasyFile::mkDir('a/1/2/3');					测试建立文件夹	建一个a/1/2/3文件夹
 * EasyFile::touch('b/1/2/3');					测试建立文件		在b/1/2/文件夹下面建一个3文件
 * EasyFile::touch('b/1/2/3.exe');				测试建立文件		在b/1/2/文件夹下面建一个3.exe文件
 * EasyFile::cp('b','d/e');						测试复制文件夹	建立一个d/e文件夹，把b文件夹下的内容复制进去
 * EasyFile::cp('b/1/2/3.exe','b/b/3.exe');		测试复制文件		建立一个b/b文件夹，并把b/1/2文件夹中的3.exe文件复制进去
 * EasyFile::mv('a/','b/c');						测试移动文件夹	建立一个b/c文件夹,并把a文件夹下的内容移动进去，并删除a文件夹
 * EasyFile::mv('b/1/2/3.exe','b/d/3.exe');		测试移动文件		建立一个b/d文件夹，并把b/1/2中的3.exe移动进去					
 * EasyFile::rm('b/d/3.exe');					测试删除文件		删除b/d/3.exe文件
 * EasyFile::rm('d');							测试删除文件夹	删除d文件夹
 * 
 * EasyFile::write('b/c/d', 'test', 'ab');					测试写入一个文件
 * while($rs = EasyFile::readLine('b/c/d')) {echo $rs}		测试从文件中读取一行
 * echo EasyFile::readAll('b/c/d')							测试从文件中读取所有
 */
class EasyFile {
	/**
	 * 构造函数
	 *
	 */
	public function __construct() {
		exit('ERROR: The class is static');
	}
	
	/**
	 * 扫描目录
	 *
	 * @param unknown_type $dirPath
	 * @return unknown
	 */
	static public function readDir($dirPath) {
		static $dirArr = array();
		if (substr($dirPath, -1) != '/') {
			$dirPath .= '/';
		}
		
		if (!isset($dirArr[$dirPath]) || !$dirArr[$dirPath]) {
			$dirArr[$dirPath] = opendir($dirPath);
		}
		$fp = $dirArr[$dirPath];
		
		if (!$fp) {
			return false;
		}
		
		if (false !== ($file = readdir($fp))) {
			return $file == '.' || $file == '..' ? EasyFile::readDir($dirPath) : $dirPath . $file;
		}
		closedir($fp);
		unset($dirArr[$dirPath]);
		return false;
	}
	
	/**
	 * PHP下递归创建目录的函数
	 *
	 * @param string $dir - 需要创建的目录路径，可以是绝对路径或者相对路径
	 * @return boolean 返回是否写入成功
	 */
	static public function mkDir($dir) {
		return is_dir($dir) or (self::mkDir(dirname($dir)) and mkdir($dir, 0777)); 
	}
	
	/**
	 * 建立文件
	 *
	 * @param	string	$aimUrl 
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static public function touch($aimUrl, $overWrite = false) {
		if (self::isExists($aimUrl) && $overWrite == false) {
			return false;
		} elseif (self::isExists($aimUrl) && $overWrite == true) {
			self::rmFile($aimUrl);
		}
		$aimDir = dirname($aimUrl);
		if (!self::isExists($aimDir)) {
			self::mkDir($aimDir);
		}
		touch($aimUrl);
		return true;
	}
	
	/**
	 * 移动文件(或文件夹)
	 *
	 * @param string $filePath
	 * @param string $aimPath
	 * @param boolean $overWrite
	 * @return boolean
	 */
	static public function mv($filePath, $aimPath, $overWrite = false) {
		if (self::isDir($filePath)) {
			return self::mvDir($filePath, $aimPath, $overWrite);
		} else {
			return self::mvFile($filePath, $aimPath, $overWrite);
		}
	}
	
	/**
	 * 复制文件(或文件夹)
	 *
	 * @param string $filePath
	 * @param string $aimPath
	 * @param boolean $overWrite
	 * @return boolean
	 */
	static public function cp($filePath, $aimPath, $overWrite = false) {
		if (self::isDir($filePath)) {
			return self::cpDir($filePath, $aimPath, $overWrite);
		} else {
			return self::cpFile($filePath, $aimPath, $overWrite);
		}
	}
	
	/**
	 * 删除文件(或文件夹)
	 *
	 * @param string $filePath
	 * @return boolean
	 */
	static public function rm($filePath) {
		if (self::isDir($filePath)) {
			return self::rmDir($filePath);
		} else {
			return self::rmFile($filePath);
		}
	}
	
	/**
	 * 判断当前文件是否是一个文件夹
	 *
	 * @param string $path
	 * @return boolean
	 */
	static public function isDir($path) {
		return @is_dir($path);
	}
	
	/**
	 * 判断当前文件是否存在
	 *
	 * @param string $path
	 * @return boolean
	 */
	static public function isExists($path) {
		return @file_exists($path);
	}
	
	/**
	 * 将数据写入(或追加入)文件
	 *
	 * @param string $file
	 * @param string $content
	 * @param string $type
	 * @return boolean
	 */
	static public function write($file, $content, $append = false) {
		
		self::mkDir(dirname($file));
		
		if ($append) {
			$type = 'ab';
			// 如果无法写入文件，则返回false
			if (!$fp = @fopen($file, $type)) {
				return false;
			}
			$ok = @fwrite($fp, $content); // 写入
			@fclose($fp); // 关闭
		} else {
			$type = 'wb';
			$tmpFile = $file . 'tmp';
			// 如果无法写入文件，则返回false
			if (!$fp = @fopen($tmpFile, $type)) {
				return false;
			}
			$ok = @fwrite($fp, $content); // 写入
			@fclose($fp); // 关闭
			
			self::mv($tmpFile, $file, true);
		}
		
		return $ok;
	}
	
	/**
	 * 读取文件中的一行数据
	 *
	 * @param string $file
	 * @param string $size
	 * @return string
	 */
	static public function readLine($file, $size = 4096) {
		static $fileArr = array();
		
		if (!isset($fileArr[$file]) || !$fileArr[$file]) {
			$fileArr[$file] = @fopen($file, "r");
		}
		$fp = $fileArr[$file];
		
		if ($fp && !feof($fp)) {
			return fgets($fp, $size);
		}
		fclose($fp);
		unset($fileArr[$file]);
		return false;
	}
	
	/**
	 * 读取文件中的所有数据
	 *
	 * @param string $file
	 * @param string $size
	 * @return string
	 */
	static public function readAll($file) {
		if (!self::isExists($file)) {
			return false;
		}
		return file_get_contents($file);
	}
	
	/**
	 * 移动文件夹
	 *
	 * @param	string	$oldDir
	 * @param	string	$aimDir
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function mvDir($oldDir, $aimDir, $overWrite) {
		$aimDir = str_replace('\\', '/', $aimDir);
		$aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/';
		$oldDir = str_replace('\\', '/', $oldDir);
		$oldDir = substr($oldDir, -1) == '/' ? $oldDir : $oldDir . '/';
		if (!is_dir($oldDir)) {
			return false;
		}
		if (!self::isExists($aimDir)) {
			self::mkDir($aimDir);
		}
		@$dirHandle = opendir($oldDir);
		if (!$dirHandle) {
			return false;
		}
		while (false !== ($file = readdir($dirHandle))) {
			if ($file == '.' || $file == '..') {
				continue;
			}
			if (!is_dir($oldDir . $file)) {
				self::mvFile($oldDir . $file, $aimDir . $file, $overWrite);
			} else {
				self::mvDir($oldDir . $file, $aimDir . $file, $overWrite);
			}
		}
		closedir($dirHandle);
		return rmdir($oldDir);
	}
	
	/**
	 * 移动文件
	 *
	 * @param	string	$fileUrl
	 * @param	string	$aimUrl
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function mvFile($fileUrl, $aimUrl, $overWrite) {
		if (!self::isExists($fileUrl)) {
			return false;
		}
		if (self::isExists($aimUrl) && $overWrite = false) {
			return false;
		} elseif (self::isExists($aimUrl) && $overWrite = true) {
			self::rmFile($aimUrl);
		}
		$aimDir = dirname($aimUrl);
		self::mkDir($aimDir);
		rename($fileUrl, $aimUrl);
		return true;
	}
	
	/**
	 * 删除文件夹
	 *
	 * @param	string	$aimDir
	 * @return	boolean
	 */
	static private function rmDir($aimDir) {
		$aimDir = str_replace('\\', '/', $aimDir);
		$aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/';
		if (!is_dir($aimDir)) {
			return false;
		}
		$dirHandle = opendir($aimDir);
		while (false !== ($file = readdir($dirHandle))) {
			if ($file == '.' || $file == '..') {
				continue;
			}
			if (!is_dir($aimDir . $file)) {
				self::rmFile($aimDir . $file);
			} else {
				self::rmDir($aimDir . $file);
			}
		}
		closedir($dirHandle);
		return rmdir($aimDir);
	}
	
	/**
	 * 删除文件
	 *
	 * @param	string	$aimUrl
	 * @return	boolean
	 */
	static private function rmFile($aimUrl) {
		if (self::isExists($aimUrl)) {
			@unlink($aimUrl);
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 复制文件夹
	 *
	 * @param	string	$oldDir
	 * @param	string	$aimDir
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function cpDir($oldDir, $aimDir, $overWrite) {
		$aimDir = str_replace('\\', '/', $aimDir);
		$aimDir = substr($aimDir, -1) == '/' ? $aimDir : $aimDir . '/';
		$oldDir = str_replace('\\', '/', $oldDir);
		$oldDir = substr($oldDir, -1) == '/' ? $oldDir : $oldDir . '/';
		if (!is_dir($oldDir)) {
			return false;
		}
		if (!self::isExists($aimDir)) {
			self::mkDir($aimDir);
		}
		$dirHandle = opendir($oldDir);
		while (false !== ($file = readdir($dirHandle))) {
			if ($file == '.' || $file == '..') {
				continue;
			}
			if (!is_dir($oldDir . $file)) {
				self::cpFile($oldDir . $file, $aimDir . $file, $overWrite);
			} else {
				self::cpDir($oldDir . $file, $aimDir . $file, $overWrite);
			}
		}
		return closedir($dirHandle);
	}
	
	/**
	 * 复制文件
	 *
	 * @param	string	$fileUrl
	 * @param	string	$aimUrl
	 * @param	boolean	$overWrite 该参数控制是否覆盖原文件
	 * @return	boolean
	 */
	static private function cpFile($fileUrl, $aimUrl, $overWrite) {
		if (!self::isExists($fileUrl)) {
			return false;
		}
		if (self::isExists($aimUrl) && $overWrite == false) {
			return false;
		} elseif (self::isExists($aimUrl) && $overWrite == true) {
			self::rmFile($aimUrl);
		}
		$aimDir = dirname($aimUrl);
		self::mkDir($aimDir);
		copy($fileUrl, $aimUrl);
		return true;
	}
}