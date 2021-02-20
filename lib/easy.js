// easy.js
/**
 *简单工具集
 *@file easy.js
 *@version 0.10
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 imoowi.com
 */
typeof(domain) == "undefined" ? domain = '' : '';
var Easy = {
    Utility:{
    	//判断浏览器是否支持 h5 视频播放器
        isSupportHtml5Video : function(){
            if (!!document.createElement('video').canPlayType) {
                var vidtest = document.createElement('video');
                oggtest = vidtest.canPlayType('video/ogg; codecs=theora, vorbis');
                if (!oggtest) {
                    h264test = vidtest.canPlayType('video/mp4; codecs=avc1.42e01e, mp4a.40.2');
                    if (!h264test) {
                        return false;
                    }
                    else {
                        if (h264test == 'probably') {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                else {
                    if (oggtest == 'probably') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        },
        browser : {
            versions : function() {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                    iPhone : u.indexOf('iPhone') > -1,
                    iPad : u.indexOf('iPad') > -1
                }
            }()
        },
        getStrLen : function(str){
            return str.replace(/[^\x00-\xff]/g, '__').length;
        },
        getBrowserWidthandHeight:function(){
            var winWidth = 0;
            var winHeight = 0;
            //获取窗口宽度
            if (window.innerWidth)
                winWidth = window.innerWidth;
            else if ((document.body) && (document.body.clientWidth))
                winWidth = document.body.clientWidth;
            //获取窗口高度
            if (window.innerHeight)
                winHeight = window.innerHeight;
            else if ((document.body) && (document.body.clientHeight))
                winHeight = document.body.clientHeight;
            //通过深入Document内部对body进行检测，获取窗口大小
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
            {
                winHeight = document.documentElement.clientHeight;
                winWidth = document.documentElement.clientWidth;
            }
            return {width:winWidth,height:winHeight};
        },
        getElementPos : function (elementId){

            var ua = navigator.userAgent.toLowerCase();

            var isOpera = (ua.indexOf('opera') != -1);

            var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof

            var el = document.getElementById(elementId);

            if (el.parentNode === null || el.style.display == 'none') {

                return false;

            }

            var parent = null;

            var pos = [];

            var box;

            if (el.getBoundingClientRect) //IE

            {

                box = el.getBoundingClientRect();

                var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

                var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);

                return {

                    x: box.left + scrollLeft,

                    y: box.top + scrollTop

                };

            }

            else

            if (document.getBoxObjectFor) // gecko

            {

                box = document.getBoxObjectFor(el);

                var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;

                var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;

                pos = [box.x - borderLeft, box.y - borderTop];

            }

            else // safari & opera

            {

                pos = [el.offsetLeft, el.offsetTop];

                parent = el.offsetParent;

                if (parent != el) {

                    while (parent) {

                        pos[0] += parent.offsetLeft;

                        pos[1] += parent.offsetTop;

                        parent = parent.offsetParent;

                    }

                }

                if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute'))



                {

                    pos[0] -= document.body.offsetLeft;

                    pos[1] -= document.body.offsetTop;

                }

            }

            if (el.parentNode) {

                parent = el.parentNode;

            }

            else {

                parent = null;

            }

            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled
                pos[0] -= parent.scrollLeft;

                pos[1] -= parent.scrollTop;

                if (parent.parentNode) {

                    parent = parent.parentNode;

                }

                else {

                    parent = null;

                }

            }

            return {

                x: pos[0],

                y: pos[1]

            };

        },
        isMobileDevice : {
            Android: function () {
                return navigator.userAgent.match(/Android/i) ? true : false;
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i) ? true : false;
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i) ? true : false;
            },
            any: function () {
                return (Easy.Utility.isMobileDevice.Android() || Easy.Utility.isMobileDevice.BlackBerry() || Easy.Utility.isMobileDevice.iOS() || Easy.Utility.isMobileDevice.Windows());
            }
        },
        historyGoBack : function(curbakurl){
            typeof(curbakurl) == "undefined" ? curbakurl = '' : '';
            if(curbakurl){
                window.location.href = curbakurl;
                return
            }
            if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
                if(history.length > 0){
                    window.history.go( -1 );
                }else{
                    window.location.href = window.location.origin;
//		            window.opener=null;window.close();
                }
            }else{ //非IE浏览器
                if (navigator.userAgent.indexOf('Firefox') >= 0 ||
                    navigator.userAgent.indexOf('Opera') >= 0 ||
                    navigator.userAgent.indexOf('Safari') >= 0 ||
                    navigator.userAgent.indexOf('Chrome') >= 0 ||
                    navigator.userAgent.indexOf('WebKit') >= 0){

                    if(window.history.length > 1){
                        window.history.go( -1 );
                    }else{
                        window.location.href = window.location.origin;
//		                window.opener=null;window.close();
                    }
                }else{ //未知的浏览器
                    window.history.go( -1 );
                }
            }
        },
        getAge : function(birthday){
            var   r   =   birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if(r==null)return   false;
            var   d=   new   Date(r[1],   r[3]-1,   r[4]);
            if   (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])
            {
                var   Y   =   new   Date().getFullYear();
                return (Y-r[1]);
//                  return("年龄   =   "+   (Y-r[1])   +"   周岁");
            }
            return("输入的日期格式错误！");
        },
        rgb2Hex:function(rgb){
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            /*RGB颜色转换为16进制*/
            String.prototype.colorHex = function(){
                var that = this;
                if(/^(rgb|RGB)/.test(that)){
                    var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
                    var strHex = "#";
                    for(var i=0; i<aColor.length; i++){
                        var hex = Number(aColor[i]).toString(16);
                        if(hex === "0"){
                            hex += hex;
                        }
                        strHex += hex;
                    }
                    if(strHex.length !== 7){
                        strHex = that;
                    }
                    return strHex;
                }else if(reg.test(that)){
                    var aNum = that.replace(/#/,"").split("");
                    if(aNum.length === 6){
                        return that;
                    }else if(aNum.length === 3){
                        var numHex = "#";
                        for(var i=0; i<aNum.length; i+=1){
                            numHex += (aNum[i]+aNum[i]);
                        }
                        return numHex;
                    }
                }else{
                    return that;
                }
            };
            return rgb.colorHex()
        },
        hex2Rgb:function (hex) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            /*16进制颜色转为RGB格式*/
            String.prototype.colorRgb = function(){
                var sColor = this.toLowerCase();
                if(sColor && reg.test(sColor)){
                    if(sColor.length === 4){
                        var sColorNew = "#";
                        for(var i=1; i<4; i+=1){
                            sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for(var i=1; i<7; i+=2){
                        sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
                    }
                    return "RGB(" + sColorChange.join(",") + ")";
                }else{
                    return sColor;
                }
            };
            return hex.colorRgb()
        },
        isDarkColor:function (hexColor) {
            var color = this.hex2Rgb(hexColor);
            var rgbColor = color.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
            if(rgbColor[0]*0.299 + rgbColor[1]*0.578 + rgbColor[2]*0.114 >= 192){
                return false
            }
            return true
        },
        //颜色选择器
        colorPiker:function (aim) {
            var colorPikerId = 'Easy_Utility_colorPiker'+aim;
            if ($('#'+colorPikerId).length){
                $('#'+colorPikerId).remove();
                return
            }
            var colorTable = '<style>' +
                '        .Easy_Utility_colorPiker_edui-default .Easy_Utility_colorPiker_edui-box {\n' +
                '            border: none;\n' +
                '            padding: 0;\n' +
                '            margin: 0;\n' +
                '            overflow: hidden;\n' +
                '        }\n' +
                '        .Easy_Utility_colorPiker_edui-default .Easy_Utility_colorPiker_edui-colorpicker-tablefirstrow {\n' +
                '            height: 30px;\n' +
                '        }\n' +
                '        .Easy_Utility_colorPiker_edui-default .Easy_Utility_colorPiker_edui-colorpicker-colorcell {\n' +
                '            width: 14px;\n' +
                '            height: 14px;\n' +
                '            display: block;\n' +
                '            margin: 0;\n' +
                '            cursor: pointer;\n' +
                '        }\n' +
                '        .Easy_Utility_colorPiker_edui-default a.Easy_Utility_colorPiker_edui-box {\n' +
                '            display: block;\n' +
                '            text-decoration: none;\n' +
                '            color: black;\n' +
                '        }</style>' +
                '<table id="'+colorPikerId+'" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-default" style="border-collapse: collapse;position: absolute;\n' +
                '    z-index: 1;\n' +
                '    background: white;\n' +
                '    border: 1px solid lightgray;\n' +
                '    " onmouseover="" onmouseout="" onclick="" cellspacing="0" cellpadding="0">\n' +
                '\t\t<tbody class="Easy_Utility_colorPiker_edui-default">\n' +
                '\n' +
                '\t\t\t<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td colspan="10" class="Easy_Utility_colorPiker_edui-default">主题颜色</td> \n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-colorpicker-tablefirstrow Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="ffffff" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#ffffff" style="background-color:#ffffff;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="000000" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#000000" style="background-color:#000000;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="eeece1" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#eeece1" style="background-color:#eeece1;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="1f497d" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#1f497d" style="background-color:#1f497d;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="4f81bd" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#4f81bd" style="background-color:#4f81bd;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="c0504d" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#c0504d" style="background-color:#c0504d;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="9bbb59" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#9bbb59" style="background-color:#9bbb59;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="8064a2" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#8064a2" style="background-color:#8064a2;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="4bacc6" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#4bacc6" style="background-color:#4bacc6;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="f79646" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#f79646" style="background-color:#f79646;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="f2f2f2" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#f2f2f2" style="background-color:#f2f2f2;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="7f7f7f" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#7f7f7f" style="background-color:#7f7f7f;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="ddd9c3" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#ddd9c3" style="background-color:#ddd9c3;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="c6d9f0" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#c6d9f0" style="background-color:#c6d9f0;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="dbe5f1" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#dbe5f1" style="background-color:#dbe5f1;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="f2dcdb" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#f2dcdb" style="background-color:#f2dcdb;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="ebf1dd" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#ebf1dd" style="background-color:#ebf1dd;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="e5e0ec" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#e5e0ec" style="background-color:#e5e0ec;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="dbeef3" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#dbeef3" style="background-color:#dbeef3;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="fdeada" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#fdeada" style="background-color:#fdeada;border:solid #ccc;border-width:1px 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="d8d8d8" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#d8d8d8" style="background-color:#d8d8d8;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="595959" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#595959" style="background-color:#595959;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="c4bd97" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#c4bd97" style="background-color:#c4bd97;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="8db3e2" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#8db3e2" style="background-color:#8db3e2;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="b8cce4" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#b8cce4" style="background-color:#b8cce4;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="e5b9b7" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#e5b9b7" style="background-color:#e5b9b7;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="d7e3bc" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#d7e3bc" style="background-color:#d7e3bc;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="ccc1d9" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#ccc1d9" style="background-color:#ccc1d9;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="b7dde8" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#b7dde8" style="background-color:#b7dde8;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="fbd5b5" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#fbd5b5" style="background-color:#fbd5b5;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="bfbfbf" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#bfbfbf" style="background-color:#bfbfbf;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="3f3f3f" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#3f3f3f" style="background-color:#3f3f3f;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="938953" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#938953" style="background-color:#938953;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="548dd4" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#548dd4" style="background-color:#548dd4;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="95b3d7" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#95b3d7" style="background-color:#95b3d7;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="d99694" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#d99694" style="background-color:#d99694;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="c3d69b" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#c3d69b" style="background-color:#c3d69b;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="b2a2c7" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#b2a2c7" style="background-color:#b2a2c7;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="92cddc" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#92cddc" style="background-color:#92cddc;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="fac08f" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#fac08f" style="background-color:#fac08f;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="a5a5a5" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#a5a5a5" style="background-color:#a5a5a5;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="262626" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#262626" style="background-color:#262626;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="494429" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#494429" style="background-color:#494429;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="17365d" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#17365d" style="background-color:#17365d;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="366092" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#366092" style="background-color:#366092;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="953734" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#953734" style="background-color:#953734;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="76923c" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#76923c" style="background-color:#76923c;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="5f497a" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#5f497a" style="background-color:#5f497a;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="31859b" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#31859b" style="background-color:#31859b;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="e36c09" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#e36c09" style="background-color:#e36c09;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="7f7f7f" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#7f7f7f" style="background-color:#7f7f7f;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="0c0c0c" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#0c0c0c" style="background-color:#0c0c0c;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="1d1b10" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#1d1b10" style="background-color:#1d1b10;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="0f243e" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#0f243e" style="background-color:#0f243e;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="244061" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#244061" style="background-color:#244061;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="632423" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#632423" style="background-color:#632423;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="4f6128" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#4f6128" style="background-color:#4f6128;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="3f3151" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#3f3151" style="background-color:#3f3151;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="205867" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#205867" style="background-color:#205867;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="974806" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#974806" style="background-color:#974806;border:solid #ccc;border-width:0 1px 0 1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td colspan="10" class="Easy_Utility_colorPiker_edui-default">标准颜色</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-colorpicker-tablefirstrow Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="c00000" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#c00000" style="background-color:#c00000;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="ff0000" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#ff0000" style="background-color:#ff0000;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="ffc000" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#ffc000" style="background-color:#ffc000;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="ffff00" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#ffff00" style="background-color:#ffff00;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="92d050" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#92d050" style="background-color:#92d050;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="00b050" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#00b050" style="background-color:#00b050;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="00b0f0" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#00b0f0" style="background-color:#00b0f0;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="0070c0" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#0070c0" style="background-color:#0070c0;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="002060" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#002060" style="background-color:#002060;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t\t<td style="padding: 0 2px;" class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t\t\t<a hidefocus="" title="7030a0" onclick="return false;" href="javascript:" unselectable="on" class="Easy_Utility_colorPiker_edui-box Easy_Utility_colorPiker_edui-colorpicker-colorcell Easy_Utility_colorPiker_edui-default" data-color="#7030a0" style="background-color:#7030a0;border:solid #ccc;border-width:1px;"></a>\n' +
                '\t\t\t\t</td>\n' +
                '\t\t\t</tr>\n' +
                '\t\t\t<tr class="Easy_Utility_colorPiker_edui-default">\n' +
                '\t\t\t</tr>\n' +
                '\t\t</tbody>\n' +
                '\t</table>';
            $('#'+aim).after(colorTable);
            $('#'+colorPikerId).css({'left':($('#'+aim).width()+Easy.Utility.getElementPos(aim).x+20)+'px','margin-top':-($('#'+colorPikerId).height()+15)+'px'});
            $('.Easy_Utility_colorPiker_edui-colorpicker-colorcell').on('click',function () {
                var color = $(this).attr('data-color');
                $('#'+aim).val(color);
                $('#'+colorPikerId).remove()
            })
        },
        // 表格tr可排序，需要引入jquery-ui
        tableTrSortable:function (params) {

            $('.'+params.tBodyClass).sortable({
                cursor: "move",
                items: "tr", //只是tr可以拖动
                opacity: 0.7, //拖动时，透明度为0.6
                revert: false, //释放时，增加动画
                update: function(event, ui) { //更新排序之后
                    var tr = $('.'+params.tBodyClass).children('tr');
                    var navObj = new Array(tr.length);
                    var order = tr.length;
                    for (var i=0;i<tr.length;i++){
                        navObj[i] = $(tr[i]).attr(params.tBodyClass+'id');
                        if (params.tdNeedChangeColum) {
                            $('tr[' + params.tBodyClass + 'id="' + navObj[i] + '"]').children().eq(params.tdNeedChangeColum).text(order--)
                        }
                    }
                    $.ajax({
                        url:params.serverUrl,
                        type:'post',
                        data:{'obj':navObj,pages:params.pages},
                        success:function (e) {
                            if (params.success){
                                eval(params.success(e))
                            } else{
                                if (e=='yes'){
                                    // alert('yes')
                                } else{
                                    window.href.reload()
                                }
                            }

                        },error:function (e) {
                            if (params.error){
                                eval(params.error(e))
                            } else{
                                alert('网络错误，请重试')
                            }
                        }
                    });
                    $('.'+params.tBodyClass).disableSelection();
                }
            })
        },
        //水平拖拽
        dragHorizon:function (jqueryObj) {

            jqueryObj.bind("mousedown",start);

            function start(event){
                if(event.button==0){//判断是否点击鼠标左键
                    gapX=event.clientX;
                    startx = $(window).scrollLeft();  // scroll的初始位置

                    //movemove事件必须绑定到$(document)上，鼠标移动是在整个屏幕上的
                    $(document).bind("mousemove",move);
                    //此处的$(document)可以改为obj
                    $(document).bind("mouseup",stop);
                }
                return false;//阻止默认事件或冒泡
            }
            function move(event){
                var left = event.clientX-gapX; // 鼠标移动的相对距离

                $(window).scrollLeft(startx - left );

                return false;//阻止默认事件或冒泡
            }
            function stop(){
                //解绑定，这一步很必要，前面有解释
                $(document).unbind("mousemove",move);
                $(document).unbind("mouseup",stop);
            }
        },
        genCreateDate:function (datetimeStr) {
            var time = new Date();
            var time2 = new Date();
            if (datetimeStr){
                time2 = new Date(datetimeStr)
            }
            var t = time.getTime()-time2.getTime();
            var y = time2.getFullYear() - time.getFullYear();
            t = Math.floor(t/1000);
            if (t<=0){
                return '刚刚'
            }
            if (t < 60){
                return t + '秒前'
            }
            if (t < 60 * 60){
                return Math.floor ( t / 60 ) + '分钟前'
            }
            if (t < 60 * 60 * 24){
                return Math.floor ( t / (60 * 60) ) + '小时前'
            }
            if (t < 60 * 60 * 24 * 3){
                return Math.floor ( time2 / (60 * 60 * 24) ) == 1 ? '昨天 ' + time2.getHours()+':'+time2.getMinutes() : '前天 ' + time2.getHours()+':'+time2.getMinutes()
            }
            if (t < 60 * 60 * 24 * 30){
                return time2.getMonth()+'月'+time2.getDay()+'日 '+time2.getHours()+':'+time2.getMinutes()
            }
            if (t < 60 * 60 * 24 * 365 && y == 0) {
                return time2.getMonth()+'月'+time2.getDay()+'日'
            }

            return time2.getFullYear()+'年'+time2.getMonth()+'月'+time2.getDay()+'日'
        }
        },
    Validate : {
        _exp : {
            'integer' : /^(-|\+)?\d+$/,// 整数
            'float' : /^[-\+]?\d+(\.\d+)?$/,// 浮点数
            'time' : /^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/,// 时间
            'date' : /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,// 日期
            'datetime' : /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,//日期+时间
            'string_cn' : /^[\u0391-\uFFE5]+$/,// 中文字符串
            'string_en' : /^[a-zA-Z0-9_\-]+$/,// 英文字符串
            'url': /^(((ht|f)tp(s?))\:\/\/)[a-zA-Z0-9]+\.[a-zA-Z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,//url
            'email' : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,// 邮箱
            'post' : /^[1-9]{1}(\d){5}$/,// 邮编
            'mobile' : /[1][3-9][0-9]{9,9}/,// 手机
            'tel' : /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/,// 座机
            'idcard' : /(^\d{15}$)|(^\d{17}[0-9Xx]$)/,// 身份证
            'qq' : /^\d{5,9}$/ // QQ
        },
        isInteger : function(v){
            return Easy.Validate._exp.integer.test(v);
        },
        isFloat : function(v){
            return Easy.Validate._exp.float.test(v);
        },
        isTime : function(v){
            return Easy.Validate._exp.time.test(v);
        },
        isDate : function(v){
            return Easy.Validate._exp.date.test(v);
        },
        isDatetime : function(v){
            return Easy.Validate._exp.datetime.test(v);
        },
        isChinese : function(v){
            return Easy.Validate._exp.string_cn.test(v);
        },
        isEnglish : function(v){
            return Easy.Validate._exp.string_en.test(v);
        },
        isUrl : function(v){
            return Easy.Validate._exp.url.test(v);
        },
        isString : function(v){
            return (v+"").replace(/(^\s*)|(\s*$)/g, "")!="";
        },
        isEmail : function(v){
            return Easy.Validate._exp.email.test(v);
        },
        isPost : function(v){
            return Easy.Validate._exp.post.test(v);
        },
        isMobile : function(v){
            return Easy.Validate._exp.mobile.test(v);
        },
        isTel : function(v){
            return Easy.Validate._exp.tel.test(v);
        },
        isIdcard : function(code){
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;

            if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                tip = "身份证号格式错误";
                pass = false;
            }

            else if(!city[code.substr(0,2)]){
                tip = "地址编码错误";
                pass = false;
            }
            else{
                //18位身份证需要验证最后一位校验位
                if(code.length == 18){
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        tip = "校验位错误";
                        pass =false;
                    }
                }
            }
//            if(!pass) alert(tip);
            return pass;
        },
        isPassword : function(v){
            var $strength = 0;
            // 小写字母
            var testreg = /([a-z]+)/;
            if(testreg.test(v)) {
                $strength++;
            }
            // 大写字母
            testreg = /([A-Z]+)/;
            if(testreg.test(v)) {
                $strength++;
            }
            // 数字
            testreg = /([0-9]+)/;
            if(testreg.test(v)) {
                $strength++;
            }
            // 非任意(文字和数字)字母和下滑线的字符
            testreg = /(\W+)/;
            if(testreg.test(v)) {
                $strength++;
            }
            // 密码的长度
            if (v.length < 7) $strength--;
            else $strength++;

            switch($strength) {
                case 0:
                case 1:
                    //echo '密码强度太弱';
                    break;
                case 2:
                    //echo '密码强度弱';
                    break;
                case 3:
                    //echo '密码强度高';
                    break;
                case 4:
                case 5:
                    //echo '密码强度很高';
                    break;
            }

            if($strength<3){
                return false;
            }
            return true;
        },
        isQQ : function(v){
            return Easy.Validate._exp.qq.test(v);
        },
        chkFormInput:function(form){
            for(var i=0; i<form.elements.length; i++){
                if(form.elements[i].required){
                    var tagName = form.elements[i].tagName;
                    tagName = tagName.toLowerCase();
                    switch(tagName){
                        case 'input' :
                            if(!form.elements[i].value){
//								alert('input');
                                alert(form.elements[i].getAttribute('placeholder'));
                                form.elements[i].focus();
                                return false;
                            }
                            break;
                        case 'select' :
                            var value = form.elements[i].options[form.elements[i].options.selectedIndex].value;
                            if(!value || value==0){
                                var placeholder = form.elements[i].getAttribute('placeholder') ? form.elements[i].getAttribute('placeholder') : '请选择';
                                alert(placeholder);
                                form.elements[i].focus();
                                return false;
                            }
                            break;
                        case 'textarea':
                            if(!form.elements[i].value){
                                alert(form.elements[i].getAttribute('placeholder'));
                                form.elements[i].focus();
                                return false;
                            }
                            break;
                    }
                }
                var easy_format = form.elements[i].getAttribute('easy_format');
                var cur_value = form.elements[i].value;
                if (!cur_value){
                    continue;
                }
                if(easy_format){
                    switch(easy_format){
                        case 'chinese':
                            if(!Easy.Validate.isChinese(cur_value)){
                                alert('请输入中文');
                                form.elements[i].select();
                                return false;
                            }
                            break;

                        case 'english':
                            if(!Easy.Validate.isEnglish(cur_value)){
                                alert('请输入英文');
                                form.elements[i].select();
                                return false;
                            }
                            break;
                        case 'chinese+english':
                            if(!Easy.Validate.isChinese(cur_value) && !Easy.Validate.isEnglish(cur_value)){
                                alert('请输入中文或者英文');
                                form.elements[i].select();
                                return false;
                            }
                            break;

                        case 'email':
                            if(!Easy.Validate.isEmail(cur_value)){
                                alert('请输入正确的邮箱');
                                form.elements[i].select();
                                return false;
                            }
                            break;
                        case 'mobile':
                            if(!Easy.Validate.isMobile(cur_value)){
                                alert('请输入正确的手机号');
                                form.elements[i].select();
                                return false;
                            }
                            break;
                        case 'integer':
                        case 'number':
                            if(!Easy.Validate.isInteger(cur_value)){
                                alert('请输入数字');
                                form.elements[i].select();
                                return false;
                            }
                            break;
                    }
                }
            }
            return true;
        }
    },
    Cookie : {
        getItem: function (sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: /* optional method: you can safely remove it! */ function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        },
        setCookie : function(name, value){
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days*24*60*60*1000);
            document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()+';path=/'
        },
        getCookie: function(name) {
            var arg = name + "=";
            var alen = arg.length;
            var clen = document.cookie.length;
            var startindex = document.cookie.indexOf(arg);
            if (startindex == -1) {
                return null
            }
            var endindex = document.cookie.indexOf(";", startindex);
            if (endindex == -1) {
                endindex = document.cookie.length
            }
            return decodeURI(document.cookie.substring(startindex + arg.length, endindex))
        },
        delCookie : function(name){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = Easy.Cookie.getCookie(name);
            if(cval != null){
                document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()+';path=/'
            }
        }
    },
    Msg:{
        alert:function (params) {
            // console.log(params);
            var musk_bg = '<div id="Easy_Msg_Alert_Musk_BG">' +
                '<div id="Easy_Msg_Alert_Musk_BG_TEXT"><img id="Easy_Msg_Alert_Musk_BG_Loading" src="data:image/gif;base64,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"/> '+params.msg+'' +
                '<div><button id="Easy_Msg_Alert_Musk_OK_BTN">确定</button></div>' +
                '</div>' +
                '</div>';
            var old_musk_bg = $('#Easy_Msg_Alert_Musk_BG');
            if (old_musk_bg.length>0){
                $('#Easy_Msg_Alert_Musk_BG').show()
            } else{
                $('body').append(musk_bg)
            }
            $('#Easy_Msg_Alert_Musk_BG').css({
                'position': 'fixed',
                'top': 0,
                'bottom': 0,
                'left': 0,
                'right': 0,
                'background': 'black',
                'opacity': 0.7
            });
            $('#Easy_Msg_Alert_Musk_BG_TEXT').css({
                'position': 'fixed',
                'top': '45%',
                'text-align': 'center',
                'z-index': 999,
                'color': 'white',
                'width': '100%',
                'height': '2rem',
                'line-height': '2rem',
                'font-size': '1rem'
            });
            $('#Easy_Msg_Alert_Musk_OK_BTN').css({
                'color': 'white',
                'border': '1px solid gray',
                'padding': '9px',
                'font-size': '1rem',
                'background': 'black',
                'border-radius': '10px'
            });
            $('#Easy_Msg_Alert_Musk_BG_Loading').css({
                'width':'2rem'
            });
            if (params.zIndex){
                $('#Easy_Msg_Alert_Musk_BG').css({'z-index':params.zIndex})
            }
            if (params.loadingImg){
                $('#Easy_Msg_Alert_Musk_BG_Loading').attr('src',params.loadingImg).show()
            } else{
                $('#Easy_Msg_Alert_Musk_BG_Loading').hide()
            }
            $('#Easy_Msg_Alert_Musk_OK_BTN').on('click',function () {
                $('#Easy_Msg_Alert_Musk_BG').hide()
            })
        }
    }
};
