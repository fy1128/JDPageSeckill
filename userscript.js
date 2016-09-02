// ==UserScript==
// @name           京东优惠券领取
// @description    到时间自动点击
// @include        http*://*coupon.m.jd.com/*
// @author         ying
// @copyright      ying
// @version        0.1
// @grant  none
// @namespace https://greasyfork.org/users/4421
// ==/UserScript==

var timeCounter;
var seckilltime = '15:05:00';
var stime = '';
var end = '';
var cha;
//console.log(seckilltime);
var currtime = '';

(function() {

	if (window.location.host.indexOf("jd.com") >= 0) {
		var body = document.body;
		div = document.createElement("div");
		div.setAttribute("id", "info");
		div.setAttribute("style", "position: fixed; z-index: 999; background-color: #FFFF99; padding: 5px; padding:10px; font-size: 20px; width: 100%");
		
		var formdata = document.createElement("input");
		formdata.setAttribute("type", "text");
		formdata.setAttribute("id", "time");
		formdata.setAttribute("style", "padding: 5px;");
		formdata.setAttribute("placeholder", "请输入时间（00:00:00）");
		formdata.setAttribute("value", "");
		
		var binfo = document.createElement("button");
		binfo.setAttribute("style", "margin-left: 20px; padding: 2px 5px; line-height: 25px;");
		binfo.innerHTML = "确认";
		
		body.insertBefore(div, document.getElementsByTagName('header')[0]);
		div.appendChild(formdata);
		div.appendChild(binfo);
		binfo.onclick = function (event) {
          	  	startTimer();
        	}
		//formdata.innerHTML = " <span style='line-height: 35px; maring-left: 20px;'>确认</span>";
	}
	//setInterval(function(){var time = UTCToLocalTimeString(new Date(),'yyyy/MM/dd hh:mm:ss');console.log(time)},1000);

})();

function couponInit() {
	div.innerHTML = "准备运行，正在获取数据";
	stime = new Date().getTime();
	getServerdate(document.location, function(result) {
		var d = new Date();
		end = d.getTime();
		cha = d.getTime() - (stime + ~~((end - stime) / 2));
		var currtime = new Date(result).getTime();
		//console.log('cha: '+cha);
		var delaytime = seckilltime - currtime + cha;
		//delaytime = new Date(delaytime).toTimeString().substring(0,8);
		//console.log(delaytime);
		if (delaytime <= 0) {
			kill();
			return false;
		} else {
			var waited = 0;
			timeCounter = setInterval(function() {
				waited += 1;
				if (waited % 60 == 0 && delaytime > 60000) {
					div.innerHTML = "正在重新对时...";
					console.log("正在重新对时...");
					setTimeout(couponInit(), 1000);
					stopTimer();
				}
				delaytime = delaytime - 1000;
				if (delaytime <= 0) {
					console.log(delaytime);
					kill();
					stopTimer();
					return false;
				}
				timer(delaytime);
			}, 1000);  
			//setInterval(function(){console.log(--delaytime)},1000);
			//console.log(currtime);
		}
	});
}

function getServerdate(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if( xhr.readyState === 4 && xhr.status === 200 ) {
			callback( xhr.getResponseHeader("Date") );
		}
	}
	xhr.open("HEAD", url, true);
	xhr.send();
}

Date.prototype.strftime = function(format){
	o = {
	  "M+" :  this.getMonth()+1,  //month
	  "d+" :  this.getDate(),     //day
	  "h+" :  this.getHours(),    //hour
	  "m+" :  this.getMinutes(),  //minute
	  "s+" :  this.getSeconds(), //second
	  "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
	  "S"  :  this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
  
	for(var k in o) {
		if(new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return format;
}
 
function UTCToLocalTimeString(d, format) {   
	var timeOffsetInHours = (new Date().getTimezoneOffset()/60) + - -8;
	d.setHours(d.getHours() + timeOffsetInHours);
	return d.strftime(format);
}

function startTimer(){
	isRunning=true;
	window.onbeforeunload = function(event){   
	  return '当前正在监听网页，确认立即退出？'; 
	};
	seckilltime = document.getElementById('time').value;
	seckilltime = new Date((new Date().getFullYear())+','+(new Date().getMonth()+1)+','+(new Date().getDate())+' '+seckilltime).getTime();
	window.scrollTo(0,0);
	couponInit();
}

function stopTimer(){
	clearInterval(timeCounter);
	isRunning=false;
	window.onbeforeunload='';
}

function timer(ts='') {
	//var ts = (new Date(2018, 11, 11, 9, 0, 0)) - (new Date());//计算剩余的毫秒数  
	var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数  
	var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数  
	var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数  
	var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数  
	dd = checkTime(dd);  
	hh = checkTime(hh);  
	mm = checkTime(mm);  
	ss = checkTime(ss);  
	//document.getElementById("timer").innerHTML = dd + "天" + hh + "时" + mm + "分" + ss + "秒";
    console.log(new Date().toLocaleTimeString() + ': 剩余'+dd + "天" + hh + "时" + mm + "分" + ss + "秒");	
	div.innerHTML = new Date().toLocaleTimeString() + ': 剩余'+dd + "天" + hh + "时" + mm + "分" + ss + "秒";
}

function checkTime(i) {    
	if (i < 10) {    
	   i = "0" + i;    
	}    
	return i;    
}

function kill() {
	document.getElementById("btnSubmit").click();
}
