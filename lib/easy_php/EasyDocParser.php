<?php
namespace lib\easy_php;
/**
 * 文档解析类
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 simpleyuan
 */
class EasyDocParser{
	public function parse_doc($php_doc_comment){
		$p = new DocParser();
		return $p->parse($php_doc_comment);
	}
}