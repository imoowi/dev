chrome.tabs.getSelected(null, function(tab) {
  // alert(encodeURIComponent(tab.url))
  // window.open('http://qr.imoowi.com/?url='+encodeURIComponent(tab.url));
  // document.getElementById('qr').src = 'http://qr.imoowi.com/?url='+encodeURIComponent(tab.url);
  var showArea = document.getElementById('qrcode')
  var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 200,
	height : 200
	});
  qrcode.makeCode(tab.url)
  $('#url').text(tab.url)
});