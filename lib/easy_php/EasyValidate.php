<?php
namespace lib\easy_php;
/**
 *验证类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
final class EasyValidate {
	static public function is_php($version = '5.0.0') {
		static $_is_php;
		$version = ( string ) $version;
		
		if (! isset ( $_is_php [$version] )) {
			$_is_php [$version] = (version_compare ( PHP_VERSION, $version ) < 0) ? FALSE : TRUE;
		}
		return $_is_php [$version];
	}
	
	/**
	 * 检测是否为中文
	 *
	 * @param string $email
	 *        	email字符串.
	 * @return bool true | false
	 */
	static public function isChinese($str, $charset = 'utf8') {
		if ('utf8' == $charset) {
			return preg_match ( "/^[\x{4e00}-\x{9fa5}]+$/u", $str );
		} elseif ('gb2312' == $charset) {
			return preg_match ( "/^[" . chr ( 0xa1 ) . "-" . chr ( 0xff ) . "A-Za-z0-9_]+$/", $str );
		} else {
			return false;
		}
	}
	
	/**
	 * 检测email
	 *
	 * @param string $email
	 *        	email字符串.
	 * @return bool true | false
	 */
	static public function isEmail($email) {
		return preg_match ( "/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", $email );
	}
	
	/**
	 * 检测整数
	 *
	 * @param string $int
	 *        	整数字符串.
	 * @return bool true | false
	 */
	static public function isInt($int) {
		return is_int ( $int );
	}
	
	/**
	 * 检测变量是否为数字或数字字符串
	 *
	 * @param string $numeric
	 *        	变量字符串
	 * @return bool true | false true | false
	 */
	static public function isNumeric($numeric) {
		return is_int ( $numeric );
	}
	
	/**
	 * 检测浮点数
	 *
	 * @param string $float
	 *        	浮点数字符串.
	 * @return bool true | false
	 */
	static public function isFloat($float) {
		return is_float ( $float );
	}
	
	/**
	 * 检测字符串是否仅含数字和字母
	 *
	 * @param string $alnum
	 *        	变量字符串.
	 * @return bool true | false
	 */
	static public function isAlnum($alnum) {
		return preg_match ( '/^[a-z0-9]+$/i', $alnum );
	}
	
	/**
	 * 检测字符串是否仅含标点符号
	 *
	 * @param string $punct
	 *        	变量字符串.
	 * @return bool true | false
	 */
	static public function isPunct($punct) {
		return preg_match ( '/^[[:punct:]]$/', $punct );
	}
	
	/**
	 * 检测字符串是否仅字母
	 *
	 * @param string $alpha
	 *        	变量字符串
	 * @return bool true | false
	 */
	static public function isAlpha($alpha) {
		return preg_match ( '/^[a-z]+$/i', $alpha );
	}
	
	/**
	 * 检测日期是否合法，默认为检查YYYY-MM-DD格式
	 *
	 * @param
	 *        	string
	 * @param
	 *        	string
	 * @return bool true | false
	 */
	static public function isDate($date, $format = 'Y-m-d') {
		$matchDate = date ( $format, strtotime ( $date ) );
		return $date && $date == $matchDate;
	}
	
	/**
	 * 检测数字或字符是否在$value之间
	 *
	 * @param
	 *        	string
	 * @param
	 *        	string
	 * @param
	 *        	string
	 * @return bool true | false
	 */
	static public function isBetween($value, $down, $up) {
		$ord = ord ( $value );
		return $ord > $down && $ord < $up;
	}
	
	/**
	 * 检测字符串长度
	 *
	 * @param string $value
	 *        	变量字符串.
	 * @param integer $min
	 *        	最小值.
	 * @param integer $max
	 *        	最大值.
	 * @return bool true | false
	 */
	static public function isStrLength($value, $min = 0, $max = NULL) {
		return strlen ( $value ) > $min && strlen ( $value ) < $max;
	}
	
	/**
	 * 检测是否为合法邮编
	 *
	 * @param string $postcode
	 *        	邮编.
	 * @return bool true | false
	 */
	static public function isPostcode($postcode) {
		$mobile = null;
		return preg_match ( "/^[0-9]{6}$/", $mobile );
	}
	
	/**
	 * 检测是否为合法电话号码
	 *
	 * @param string $mobile
	 *        	电话号码.
	 * @return bool true | false
	 */
	static public function isMobile($mobile) {
		return preg_match ( "/^[0-9]{11}$/", $mobile );
	}
	/**
	 * 检测是否为合法的身份证号码
	 *
	 * @param string $idcard
	 *        	身份证号码
	 * @return boolean
	 */
	static public function isIdCard($idcard) {
		$vCity = array (
				'11',
				'12',
				'13',
				'14',
				'15',
				'21',
				'22',
				'23',
				'31',
				'32',
				'33',
				'34',
				'35',
				'36',
				'37',
				'41',
				'42',
				'43',
				'44',
				'45',
				'46',
				'50',
				'51',
				'52',
				'53',
				'54',
				'61',
				'62',
				'63',
				'64',
				'65',
				'71',
				'81',
				'82',
				'91' 
		);
		
		if (! preg_match ( '/^([\d]{17}[xX\d]|[\d]{15})$/', $idcard ))
			return false;
		
		if (! in_array ( substr ( $idcard, 0, 2 ), $vCity ))
			return false;
		
		$idcard = preg_replace ( '/[xX]$/i', 'a', $idcard );
		$vLength = strlen ( $idcard );
		
		if ($vLength == 18) {
			$vBirthday = substr ( $idcard, 6, 4 ) . '-' . substr ( $idcard, 10, 2 ) . '-' . substr ( $idcard, 12, 2 );
		} else {
			$vBirthday = '19' . substr ( $idcard, 6, 2 ) . '-' . substr ( $idcard, 8, 2 ) . '-' . substr ( $idcard, 10, 2 );
		}
		
		if (date ( 'Y-m-d', strtotime ( $vBirthday ) ) != $vBirthday)
			return false;
		if ($vLength == 18) {
			$vSum = 0;
			
			for($i = 17; $i >= 0; $i --) {
				$vSubStr = substr ( $idcard, 17 - $i, 1 );
				$vSum += (pow ( 2, $i ) % 11) * (($vSubStr == 'a') ? 10 : intval ( $vSubStr, 11 ));
			}
			
			if ($vSum % 11 != 1)
				return false;
		}
		
		return true;
	}
}