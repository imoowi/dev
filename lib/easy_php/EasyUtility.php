<?php
namespace lib\easy_php;
/**
 *工具类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyUtility {
	
	/**
	 * 截取字符串，包括中文
	 *
	 * @param string $string        	
	 * @param integer $sublen        	
	 * @param integer $start        	
	 * @param string $tmp        	
	 * @param string $code        	
	 * @return string
	 */
	public static function utf8_substr($string, $sublen, $start = 0, $tmp = '...', $code = 'UTF-8') {
		if ($code == 'UTF-8') {
			$pa = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/";
			preg_match_all ( $pa, $string, $t_string );
			if (count ( $t_string [0] ) - $start > $sublen)
				return join ( '', array_slice ( $t_string [0], $start, $sublen ) ) . $tmp;
			return join ( '', array_slice ( $t_string [0], $start, $sublen ) );
		} else {
			$start = $start * 2;
			$sublen = $sublen * 2;
			$strlen = strlen ( $string );
			$tmpstr = '';
			for($i = 0; $i < $strlen; $i ++) {
				if ($i >= $start && $i < ($start + $sublen)) {
					if (ord ( substr ( $string, $i, 1 ) ) > 129) {
						$tmpstr .= substr ( $string, $i, 2 );
					} else {
						$tmpstr .= substr ( $string, $i, 1 );
					}
				}
				if (ord ( substr ( $string, $i, 1 ) ) > 129)
					$i ++;
			}
			if (strlen ( $tmpstr ) < $strlen)
				$tmpstr .= $tmp;
			return $tmpstr;
		}
	}
	
	public static function getByCURL($curl_url){
		$ch = curl_init ($curl_url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ;
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ;
		$data = curl_exec ( $ch );
		curl_close ( $ch );
		return $data;
	}
	
	/**
	 * 通过CURL方式post数据
	 * 需要在php.ini中启动curl
	 * linux中去掉"extension=php_curl.so"前的";"号，windows中去掉"extension=php_curl.dll"前的";"号，并保证php的ext文件夹中有curl的扩展
	 *
	 * @param string $curl_url
	 *        	string url address
	 * @param array $curl_data
	 *        	array data
	 * @return object
	 */
	public static function postByCURL($curl_url, $curl_data,$header='') {
		if (is_array ( $curl_data )) {
			$curl_data = http_build_query ( $curl_data );
		}
		$ch = curl_init ();
        if ($header){
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
            curl_setopt($ch, CURLOPT_HEADER, 0);
        }
		curl_setopt ( $ch, CURLOPT_URL, $curl_url );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $curl_data );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
// 		curl_setopt ( $ch, CURLOPT_POST,  true );
// 		curl_setopt ( $ch, CURLOPT_COOKIEJAR,   'postcookie' );
// 		curl_setopt ( $ch, CURLOPT_COOKIEFILE,  'postcookie' );
 		curl_setopt ( $ch, CURLOPT_USERAGENT, "Easy's CURL post data style" );

		$data = curl_exec ( $ch );
        if (curl_errno($ch)) {
//            echo 'Curl error: ' . curl_error($ch);
            EasyLog::log(curl_error($ch), 'curl-error');
        }
		curl_close ( $ch );
		EasyLog::log($data,'postByCurlRes');
		return $data;
	}
	
	/**
	 * 获取client真实IP
	 *
	 * @return string '127.0.0.1'
	 */
	public static function getRealIp() {
		static $realip = NULL;
		if ($realip !== NULL) {
			return $realip;
		}
		if (isset ( $_SERVER )) {
			if (isset ( $_SERVER ['HTTP_X_FORWARDED_FOR'] )) {
				$arr = explode ( ',', $_SERVER ['HTTP_X_FORWARDED_FOR'] );

				// 取X-Forwarded-for中第一个非unknown的有效Ip字符串
				foreach ( $arr as $ip ) {
					$ip = trim ( $ip );
					if ($ip != 'unknown') {
						$realip = $ip;
						break;
					}
				}
			} elseif (isset ( $_SERVER ['HTTP_CLIENT_IP'] )) {
				$realip = $_SERVER ['HTTP_CLIENT_IP'];
			} else {
				if (isset ( $_SERVER ['REMOTE_ADDR'] )) {
					$realip = $_SERVER ['REMOTE_ADDR'];
				} else {
					$realip = '0.0.0.0';
				}
			}
		} else {
			if (getenv ( 'HTTP_X_FORWARDED_FOR' )) {
				$realip = getenv ( 'HTTP_X_FORWARDED_FOR' );
			} elseif (getenv ( 'HTTP_CLIENT_IP' )) {
				$realip = getenv ( 'HTTP_CLIENT_IP' );
			} else {
				$realip = getenv ( 'REMOTE_ADDR' );
			}
		}
		$onlineip = null;
		preg_match ( "/[\d\.]{7,15}/", $realip, $onlineip );
		$realip = ! empty ( $onlineip [0] ) ? $onlineip [0] : '0.0.0.0';
		return $realip;
	}
	
	/**
	 * 获取当前url(不包含请求参数)
	 *
	 * @return string
	 */
	public static function getUrl() {
		$http = (isset ( $_SERVER ['HTTPS'] ) && $_SERVER ['HTTPS'] != 'off') ? 'https://' : 'http://';
		return $http . $_SERVER ['HTTP_HOST'] . $_SERVER ['REQUEST_URI'];
	}

	public static function getDomain(){
		$http = (isset ( $_SERVER ['HTTPS'] ) && $_SERVER ['HTTPS'] != 'off') ? 'https://' : 'http://';
		return $http . $_SERVER ['HTTP_HOST'];// . $_SERVER ['REQUEST_PORT'];
	}

	public static function getUrlPath(){
		$tmp = explode('?', $_SERVER ['REQUEST_URI']);
		return isset($tmp[0]) ? $tmp[0] : '';
	}
	public static function getHttpPrefix(){
        $http = (isset ( $_SERVER ['HTTPS'] ) && $_SERVER ['HTTPS'] != 'off') ? 'https://' : 'http://';
        return $http;
    }
	
	/**
	 * 生成随机字串
	 *
	 * @param integer $min
	 *        	起始长度.
	 * @param integer $max
	 *        	最大长度.
	 * @return string 返回一个随机字符串
	 */
	public static function genRandStr($min, $max) {
		if (is_int ( $max ) && $max > $min) {
			$min = mt_rand ( $min, $max );
			$output = '';
			for($i = 0; $i < $min; $i ++) {
				$which = mt_rand ( 0, 2 );
				if ($which === 0) {
					$output .= mt_rand ( 0, 9 );
				} elseif ($which === 1) {
					$output .= chr ( mt_rand ( 65, 90 ) );
				} else {
					$output .= chr ( mt_rand ( 97, 122 ) );
				}
			}
			return $output;
		}
		return false;
	}
	/**
	 * 生成盐字串
	 *
	 * @param
	 *        	NULL
	 * @return string
	 */
	public static function genSalt($len = 6) {
		$rand = range ( 'a', 'z' );
		shuffle ( $rand );
		return substr ( join ( '', $rand ), 0, $len );
	}
	public static function genSmsVcode($len = 6){
		$rand = range('0', '9');
		shuffle($rand);
		return substr(join('', $rand), 0, $len);
	}
	
	/**
	 * 生成可逆密文
	 *
	 * @param string $sting
	 *        	被加密字符
	 * @param string $operation
	 *        	DECODE 解密 | ENCODE 加密
	 * @param string $key
	 *        	密匙
	 * @param integer $expiry
	 *        	密文有效期
	 */
	public static function authcode($string, $operation = 'DECODE', $key = '', $expiry = 0) {
		if ($string === '' or is_null ( $string ))
			return '';
		$ckey_length = 4;
		$key = md5 ( $key ? $key : EZ_KEY );
		$keya = md5 ( substr ( $key, 0, 16 ) );
		$keyb = md5 ( substr ( $key, 16, 16 ) );
		$keyc = $ckey_length ? ($operation == 'DECODE' ? substr ( $string, 0, $ckey_length ) : substr ( md5 ( EZ_KEY ), - $ckey_length )) : '';
		
		$cryptkey = $keya . md5 ( $keya . $keyc );
		$key_length = strlen ( $cryptkey );
		
		$string = $operation == 'DECODE' ? base64_decode ( substr ( $string, $ckey_length ) ) : sprintf ( '%010d', $expiry ? $expiry + time () : 0 ) . substr ( md5 ( $string . $keyb ), 0, 16 ) . $string;
		$string_length = strlen ( $string );
		
		$result = '';
		$box = range ( 0, 255 );
		
		$rndkey = array ();
		for($i = 0; $i <= 255; $i ++) {
			$rndkey [$i] = ord ( $cryptkey [$i % $key_length] );
		}
		
		for($j = $i = 0; $i < 256; $i ++) {
			$j = ($j + $box [$i] + $rndkey [$i]) % 256;
			$tmp = $box [$i];
			$box [$i] = $box [$j];
			$box [$j] = $tmp;
		}
		
		for($a = $j = $i = 0; $i < $string_length; $i ++) {
			$a = ($a + 1) % 256;
			$j = ($j + $box [$a]) % 256;
			$tmp = $box [$a];
			$box [$a] = $box [$j];
			$box [$j] = $tmp;
			$result .= chr ( ord ( $string [$i] ) ^ ($box [($box [$a] + $box [$j]) % 256]) );
		}
		
		if ($operation == 'DECODE') {
			if ((substr ( $result, 0, 10 ) == 0 || substr ( $result, 0, 10 ) - time () > 0) && substr ( $result, 10, 16 ) == substr ( md5 ( substr ( $result, 26 ) . $keyb ), 0, 16 )) {
				return substr ( $result, 26 );
			} else {
				return '';
			}
		} else {
			return $keyc . str_replace ( '=', '', base64_encode ( $result ) );
		}
	}
	
	public static function getBirthdayByIDCard($IDCard){
		if(!eregi("^[1-9]([0-9a-zA-Z]{17}|[0-9a-zA-Z]{14})$",$IDCard)){
// 			"格式错误";
			return false;
		}else{
			if(strlen($IDCard)==18){
				$tyear=intval(substr($IDCard,6,4));
				$tmonth=intval(substr($IDCard,10,2));
				$tday=intval(substr($IDCard,12,2));
				if($tyear>date("Y")||$tyear<(date("Y")-100)){
					$flag=0;
				}
				elseif($tmonth<0||$tmonth>12){
					$flag=0;
				}
				elseif($tday<0||$tday>31){
					$flag=0;
				}else{
// 					$tdate=$tyear."-".$tmonth."-".$tday." 00:00:00";
					$tdate=$tyear."-".$tmonth."-".$tday;
					if((time()-mktime(0,0,0,$tmonth,$tday,$tyear))>18*365*24*60*60){
						$flag=0;
					}else{
						$flag=1;
					}
				}
				 
			}elseif(strlen($IDCard)==15){
				$tyear=intval("19".substr($IDCard,6,2));
				$tmonth=intval(substr($IDCard,8,2));
				$tday=intval(substr($IDCard,10,2));
				if($tyear>date("Y")||$tyear<(date("Y")-100)){
					$flag=0;
				}
				elseif($tmonth<0||$tmonth>12){
					$flag=0;
				}
				elseif($tday<0||$tday>31){
					$flag=0;
				}else{
// 					$tdate=$tyear."-".$tmonth."-".$tday." 00:00:00";
					$tdate=$tyear."-".$tmonth."-".$tday;
					if((time()-mktime(0,0,0,$tmonth,$tday,$tyear))>18*365*24*60*60){
						$flag=0;
					}else{
						$flag=1;
					}
				}
			}
		}
		return $tdate;
		}
	/**
	 * 根据生日计算年龄
	 *
	 * @param string $birthday
	 *        	生日
	 * @return integer
	 */
	public static function getAgeByBirthday($birthday) {
		$birthday = getDate ( strtotime ( $birthday ) );
		$now = getDate ();
		$month = 0;
		if ($now ['month'] > $birthday ['month'])
			$month = 1;
		if ($now ['month'] == $birthday ['month'])
			if ($now ['mday'] >= $birthday ['mday'])
				$month = 1;
		return $now ['year'] - $birthday ['year'] + $month;
	}
	
	/**
	 * 根据生日计算星座
	 * @param unknown_type $birthday
	 * @param unknown_type $format
	 * @return NULL|Ambigous <unknown, string>
	 */
	public static function getConstellationByBirthday($birthday, $format = null){
		if (!$birthday){
			return '';
		}
		$pattern = '/^\d{4}-\d{1,2}-\d{1,2}$/';
		if (! preg_match ( $pattern, $birthday, $matchs )) {
			return '';
		}
		$date = explode ( '-', $birthday );
		$year = $date [0];
		$month = $date [1];
		$day = $date [2];
		if ($month < 1 || $month > 12 || $day < 1 || $day > 31) {
			return null;
		}
		// 设定星座数组
		$constellations = array (
				'摩羯座',
				'水瓶座',
				'双鱼座',
				'白羊座',
				'金牛座',
				'双子座',
				'巨蟹座',
				'狮子座',
				'处女座',
				'天秤座',
				'天蝎座',
				'射手座'
		);
		
		// 设定星座结束日期的数组，用于判断
		$enddays = array (
				19,
				18,
				20,
				20,
				20,
				21,
				22,
				22,
				22,
				22,
				21,
				21
		);
		// 如果参数format被设置，则返回值采用format提供的数组，否则使用默认的数组
		
		if ($format != null) {
			$values = $format;
		} else {
			$values = $constellations;
		}
		// 根据月份和日期判断星座
		switch ($month) {
			case 1 :
				if ($day <= $enddays [0]) {
					$constellation = $values [0];
				} else {
					$constellation = $values [1];
				}
				break;
			case 2 :
				if ($day <= $enddays [1]) {
					$constellation = $values [1];
				} else {
					$constellation = $values [2];
				}
				break;
			case 3 :
				if ($day <= $enddays [2]) {
					$constellation = $values [2];
				} else {
					$constellation = $values [3];
				}
				break;
			case 4 :
				if ($day <= $enddays [3]) {
					$constellation = $values [3];
				} else {
					$constellation = $values [4];
				}
				break;
			case 5 :
				if ($day <= $enddays [4]) {
					$constellation = $values [4];
				} else {
					$constellation = $values [5];
				}
				break;
			case 6 :
				if ($day <= $enddays [5]) {
					$constellation = $values [5];
				} else {
					$constellation = $values [6];
				}
				break;
			case 7 :
				if ($day <= $enddays [6]) {
					$constellation = $values [6];
				} else {
					$constellation = $values [7];
				}
				break;
			case 8 :
				if ($day <= $enddays [7]) {
					$constellation = $values [7];
				} else {
					$constellation = $values [8];
				}
				break;
			case 9 :
				if ($day <= $enddays [8]) {
					$constellation = $values [8];
				} else {
					$constellation = $values [9];
				}
				break;
			case 10 :
				if ($day <= $enddays [9]) {
					$constellation = $values [9];
				} else {
					$constellation = $values [10];
				}
				break;
			case 11 :
				if ($day <= $enddays [10]) {
					$constellation = $values [10];
				} else {
					$constellation = $values [11];
				}
				break;
			case 12 :
				if ($day <= $enddays [11]) {
					$constellation = $values [11];
				} else {
					$constellation = $values [0];
				}
				break;
		}
		return $constellation;
	}
	
	/**
	 * 根据文件生成文件的实际文件夹
	 * @param string $filename
	 * @return BOOL
	 */
	public static function makedir($filename)
	{
		$dir = dirname ( $filename );
		if (file_exists ( $dir )) {
			@chmod ( $dir, 0777 );
		}
		if (@mkdir ( $dir, 0777, true )) {
			@chmod ( $dir, 0777 );
		}
		if (! is_writable ( $dir )) {
			return false;
		}
		return true;
	}

	/**
	 * 检测是否是手机设备
	 *
	 * @return boolean
	 */
	public static function isMobileDevice() {
		$user_agent = $_SERVER ['HTTP_USER_AGENT'];
		$mobile_agents = Array (
				"240x320",
				"acer",
				"acoon",
				"acs-",
				"abacho",
				"ahong",
				"airness",
				"alcatel",
				"amoi",
				"android",
				"anywhereyougo.com",
				"applewebkit/525",
				"applewebkit/532",
				"asus",
				"audio",
				"au-mic",
				"avantogo",
				"becker",
				"benq",
				"bilbo",
				"bird",
				"blackberry",
				"blazer",
				"bleu",
				"cdm-",
				"compal",
				"coolpad",
				"danger",
				"dbtel",
				"dopod",
				"elaine",
				"eric",
				"etouch",
				"fly ",
				"fly_",
				"fly-",
				"go.web",
				"goodaccess",
				"gradiente",
				"grundig",
				"haier",
				"hedy",
				"hitachi",
				"htc",
				"huawei",
				"hutchison",
				"inno",
				"ipad",
				"ipaq",
				"ipod",
				"jbrowser",
				"kddi",
				"kgt",
				"kwc",
				"lenovo",
				"lg ",
				"lg2",
				"lg3",
				"lg4",
				"lg5",
				"lg7",
				"lg8",
				"lg9",
				"lg-",
				"lge-",
				"lge9",
				"longcos",
				"maemo",
				"mercator",
				"meridian",
				"micromax",
				"midp",
				"mini",
				"mitsu",
				"mmm",
				"mmp",
				"mobi",
				"mot-",
				"moto",
				"nec-",
				"netfront",
				"newgen",
				"nexian",
				"nf-browser",
				"nintendo",
				"nitro",
				"nokia",
				"nook",
				"novarra",
				"obigo",
				"palm",
				"panasonic",
				"pantech",
				"philips",
				"phone",
				"pg-",
				"playstation",
				"pocket",
				"pt-",
				"qc-",
				"qtek",
				"rover",
				"sagem",
				"sama",
				"samu",
				"sanyo",
				"samsung",
				"sch-",
				"scooter",
				"sec-",
				"sendo",
				"sgh-",
				"sharp",
				"siemens",
				"sie-",
				"softbank",
				"sony",
				"spice",
				"sprint",
				"spv",
				"symbian",
				"tablet",
				"talkabout",
				"tcl-",
				"teleca",
				"telit",
				"tianyu",
				"tim-",
				"toshiba",
				"tsm",
				"up.browser",
				"utec",
				"utstar",
				"verykool",
				"virgin",
				"vk-",
				"voda",
				"voxtel",
				"vx",
				"wap",
				"wellco",
				"wig browser",
				"wii",
				"windows ce",
				"wireless",
				"xda",
				"xde",
				"zte",
                "okhttp"
		);
		$is_mobile = false;
		foreach ( $mobile_agents as $device ) {
			if (stristr ( $user_agent, $device )) {
				$is_mobile = true;
				break;
			}
		}
		return $is_mobile;
	}

    /**
     * 检测是否是 iPhone
     * @return bool
     */
    public static function isIphone(){
        $user_agent = $_SERVER ['HTTP_USER_AGENT'];
        $is_iphone = (strpos(strtolower($user_agent), 'iphone')) ? true : false;
        return $is_iphone;
    }
    /**
     * 检测是否是 Android
     * @return bool
     */
    public static function isAndroid(){
        $user_agent = $_SERVER ['HTTP_USER_AGENT'];
        $is_iphone = (strpos(strtolower($user_agent), 'android')) ? true : false;
        return $is_iphone;
    }

    /**
     * @desc 生成时分秒
     * @param int $seconds
     * @return string
     */
    public static function genLastTime($seconds=0){
        $hour = 0;
        if ($seconds>=3600){
            $hour = floor($seconds/3600);
        }
//        echo '$hour=',$hour,'<br/>';
        $min = 0;
        if (($seconds-($hour*3600))>=60){
            $min = floor(($seconds-($hour*3600)) / 60);
        }
//        echo '$min=',$min,'<br/>';
        $seconds = $seconds - $hour*3600 - $min*60;

//        echo '$seconds=',$seconds,'<br/>';
//        exit;
        return $hour.'小时'.$min.'分'.$seconds.'秒';
    }
	/**
	 * 生成短链
	 *
	 * @param string $url
	 *        	长链接
	 * @return string 短链接
	 */
	public static function genShortUrl($url) {
		//$appKey = EasyConfig::get ( 'wb.appKey' );
        $appKey = WEIBO_KEY;
		if (! $appKey) {
			return $url;
		}
		$apiUrl = 'http://api.t.sina.com.cn/short_url/shorten.json?source=' . $appKey . '&url_long=' . urlencode($url);
//		$response = file_get_contents ( $apiUrl ); // 获取json的内容
        $response = self::getByCURL($apiUrl );
        $json = json_decode ( $response ); // 对json格式内容进行编码
		$short = isset($json [0]->url_short)  && $json [0]->url_short?  $json [0]->url_short : $url;
        $short = str_replace('http://','',$short);
        $short = str_replace('https://','',$short);
        return $short;// 返回短链
	}
	/**
	 * 根据时间戳格式化创建时间
	 *
	 * @param integer $time
	 * @return string 刚刚|5秒前|10分钟前|2小时前|昨天|2月12日 15:10|9月9日|2015年1月29日
	 */
	public static function genCreateDate($time = NULL) {
		$text = '';
		$time = $time === NULL || $time > time () ? time () : intval ( $time );
		$t = time () - $time; // 时间差 （秒）
		$y = date ( 'Y', $time ) - date ( 'Y', time () ); // 是否跨年
		switch ($t) {
			case $t == 0 :
				$text = '刚刚';
				break;
			case $t < 60 :
				$text = $t . '秒前'; // 一分钟内
				break;
			case $t < 60 * 60 :
				$text = floor ( $t / 60 ) . '分钟前'; // 一小时内
				break;
			case $t < 60 * 60 * 24 :
				$text = floor ( $t / (60 * 60) ) . '小时前'; // 一天内
				break;
			case $t < 60 * 60 * 24 * 3 :
				$text = floor ( $time / (60 * 60 * 24) ) == 1 ? '昨天 ' . date ( 'H:i', $time ) : '前天 ' . date ( 'H:i', $time ); // 昨天和前天
				break;
			case $t < 60 * 60 * 24 * 30 :
				$text = date ( 'm月d日 H:i', $time ); // 一个月内
				break;
			case $t < 60 * 60 * 24 * 365 && $y == 0 :
				$text = date ( 'm月d日', $time ); // 一年内
				break;
			default :
				$text = date ( 'Y年m月d日', $time ); // 一年以前
				break;
		}
		if ($t == 0) {
			$text = '刚刚';
		}
		return $text;// $text.'['.$t.']';
	}
	/**
	 * 根据PHP各种类型变量生成唯一标识号
	 * @param mixed $mix 变量
	 * @return string
	 */
	public static function genGuidString($mix) {
		if (is_object($mix)) {
			return spl_object_hash($mix);
		} elseif (is_resource($mix)) {
			$mix = get_resource_type($mix) . strval($mix);
		} else {
			$mix = serialize($mix);
		}
		return md5($mix);
	}
	/**
	 * 获取ip信息
	 * @param string $ip
	 */
	public static function getIpAddress($ip=NULL){
		if (!$ip) {
			$ip = EasyUtility::getRealIp();
		}
		if ($ip == '127.0.0.1'){
            return '-';
        }
		$res = self::getIpLookUp($ip);
		$return = '';
		if (isset($res['province'])){
		    $return .= $res['province'];
        }
		if (isset($res['city'])){
		    $return .= '-'.$res['city'];
        }
		return $return;
		$ipContent   = @file_get_contents("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=".$ip);
		if ($ipContent){
            $jsonData = explode("=",$ipContent);
            if (isset($jsonData[1])){
                $jsonData = substr($jsonData[1], 0, -1);
                return $jsonData;
            }
        }
        return '-';
	}

    /**
     * @desc 获取ip的查询信息
     * @param $ip
     * @return bool|mixed|string
     */
	public static function getIpLookUp($ip){
	    if (!$ip){
	        $ip = self::getRealIp();
        }
        $key = 'lib_easy_php_getiplookup_'.md5($ip);
        $data = EasyFileCache::get($key);
        if ($data){
            return $data;
        }
        /*
        $res = @file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip='.$ip);
        if (empty($res)){
            return '';
        }
        $jsonMatches = [];
        preg_match('#\{.+?\}#', $res, $jsonMatches);
        if (!isset($jsonMatches[0])){
            return '';
        }
        $json = json_decode($jsonMatches[0], true);
        if (isset($json['ret']) && $json['ret'] == 1){
            $json['ip'] = $ip;
            unset($json['ret']);
        }else{
            return '';
        }
        //*/
        $res = @file_get_contents('http://ip.ws.126.net/ipquery?ip='.$ip);
//        return $res;
        if (!$res){
            return '';
        }
        $jsonData = explode("{",$res);
        $jsonData = explode("}",$jsonData[1]);
        $jsonData = explode(",",$jsonData[0]);
//        echo json_encode($jsonData);
        $json['province'] = explode(':',$jsonData[1]);
        $json['province'] = $json['province'][1];
        $json['city'] = explode(':',$jsonData[0]);
        $json['city'] = $json['city'][1];
        EasyFileCache::set($key, $json);
        return $json;
    }
	/**
	 * 判断是否从微信浏览器访问
	 * @return boolean
	 */
	public static function isInWeChat(){
		$user_agent = $_SERVER['HTTP_USER_AGENT'];
		if (strpos($user_agent, 'MicroMessenger') === false) {
			return false;
		} else {
			return true;
		}
		return false;
	}

    /**
     * 是否是IE浏览器
     * @return bool|int
     */
	public static function isIE(){
        $isIE = strpos(strtolower($_SERVER['HTTP_USER_AGENT']),"triden");
        return $isIE;
    }
    /**
     * emoji表情编码
     * @param $str
     * @return string
     */
	public static function emoji_encode($str){
        $strEncode = '';

        $length = mb_strlen($str,'utf-8');

        for ($i=0; $i < $length; $i++) {
            $_tmpStr = mb_substr($str,$i,1,'utf-8');
            if(strlen($_tmpStr) >= 4){
                $strEncode .= '[[EMOJI:'.rawurlencode($_tmpStr).']]';
            }else{
                $strEncode .= $_tmpStr;
            }
        }

        return $strEncode;
    }

    /**
     * emoji表情解码
     * @param $str
     * @return mixed
     */
    public static function emoji_decode($str){
        $strDecode = preg_replace_callback('|\[\[EMOJI:(.*?)\]\]|', function($matches){
            return rawurldecode($matches[1]);
        }, $str);

        return $strDecode;
    }

    /**
     * @desc 美化开始和结束时间
     * @param $start
     * @param $end
     * @param string $short
     * @return string
     */
    public static function beautyDatetime($start,$end,$short='~'){
        $start_timestamp = strtotime($start);
        $start_y = date('Y',$start_timestamp);
        $start_m = date('m',$start_timestamp);
        $start_d = date('d',$start_timestamp);
        $end_timestamp = strtotime($end);
        $end_y = date('Y',$end_timestamp);
        $end_m = date('m',$end_timestamp);
        $end_d = date('d',$end_timestamp);
        if ($start_y==$end_y){

            return $start_y.'-'.$start_m.'-'.$start_d.$short.$start_m.'-'.$end_d;
        }else{
            return $start_y.'-'.$start_m.'-'.$start_d.$short.$end_y.'-'.$end_m.'-'.$end_d;
        }
    }

    /**
     * @desc 格式化 pv
     * @param int $pv
     * @return int|string
     */
    public static function formatPv($pv=0){
        if (intval($pv)==0){
            return 0;
        }

        if ($pv >= 100000000 && $pv%100000000>=0){
            //100,000,000
            return floor($pv/100000000).floor(($pv%100000000)/10000000).'b+'; //亿
        }
        if ($pv >= 1000000 && $pv%1000000>=0){
            //1,000,000
            return floor($pv/1000000).floor(($pv%1000000)/100000).'m+'; //百万
        }
        if ($pv >= 100000 && $pv%100000>=0){
            //100,000
            return floor($pv/100000).floor(($pv%100000)/10000).'w+'; //十万
        }
        if ($pv >= 10000 && $pv%10000>=0){
            //10,000
            return floor($pv/10000).floor(($pv%10000)/1000).'k+'; //万
        }
        if ($pv >= 1000 && $pv%1000>=0){
            //1,000
            return floor($pv/1000).'.'.floor(($pv%1000)/100).'k+'; //千
        }
        return $pv;
    }
}