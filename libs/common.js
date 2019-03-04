/**
 * 当前文件为公共的模块JS
 * @type {OBJ}
 */
let PHP = require('./php.js');


/**
 * 获取唯一标识
 *  type : 1  缓存 2  重新获取
 */
let fnGetUUID = function fnGetUUID(type = 1) {
	let uuid = '';

	if (type == 1) {
		uuid = fnCache({
			cacheType: '0-0-1',
			handle: 'GET',
		})
		if (uuid) {
			return uuid;
		}
	}

	var d = new Date().getTime();

	uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});

	if (type == 1) {
		fnCache({
			data: uuid,
			cacheType: '0-0-1',
			handle: 'ADD',
		})
	}
	return uuid;
}

/**
 * 显示Loading
 * 统一使用的Loading
 * @returns {boolean}
 */
let fnShowLoading = function fnShowLoading(opt = {}) {
	let _this = this;
	if (!opt.success) {
		opt.success = function() {}
	};
	if (!opt.fail) {
		opt.fail = function() {}
	};
	if (!opt.complete) {
		opt.complete = function() {}
	};
	if (requestStatus) {
		return false;
	}
	requestStatus = true;
	outLoading = setTimeout(function() {
		uni.showLoading({
			title: '数据加载中...',
			mask: true,
			success(res) {
				opt.success(res);
			},
			fail(err) {
				opt.fail(err);
			}
		});

	}, 300);

}

/**
 * 隐藏Loading
 * 统一使用的Loading
 * @returns {boolean}
 */
let fnHideLoading = function fnHideLoading() {
	let _this = this;
	clearTimeout(outLoading);
	uni.hideLoading();
	requestStatus = false;
}


/**
 *显示模态没有取消的对话框
 * @param title
 * @param content
 * @param callback
 */
let fnShowModal = function fnShowModal(opt) {
	let _this = this;
	if (!opt.success) {
		opt.success = function() {}
	};
	if (!opt.fail) {
		opt.fail = function() {}
	};
	if (!opt.complete) {
		opt.complete = function() {}
	};
	let confirmText = opt.confirmText ? opt.confirmText : '确定';
	let cancelText = opt.cancelText ? opt.cancelText : '取消';
	let title = opt.title ? opt.title : '提示';
	let content = opt.content ? opt.content : '';
	let confirmColor = opt.confirmColor ? opt.confirmColor : '';
	let cancelColor = opt.cancelColor ? opt.cancelColor : '';
	let showCancel = opt.showCancel ? opt.showCancel : false; //是否显示取消按钮
	uni.showModal({
		title: title,
		content: content,
		cancelText: cancelText,
		confirmText: confirmText,
		showCancel: showCancel,
		confirmColor: confirmColor,
		cancelColor: cancelColor,
		success(res) {
			opt.success(res);
		},
		fail(err) {
			opt.fail
		}
	})
}




/**
 * 根据两个地图坐标计算两点间的直线距离
 * @param lat1 纬度
 * @param lng  经度
 * @param lng1 纬度
 * @param lat2 经度
 * @returns {number}
 */
let fnGetSiteLong = function fnGetSiteLong(lat1, lng1, lat2, lng2) {

	//获取两点距离
	lat1 = lat1 || 0;
	lng1 = lng1 || 0;
	lat2 = lat2 || 0;
	lng2 = lng2 || 0;



	var rad1 = lat1 * Math.PI / 180.0;
	var rad2 = lat2 * Math.PI / 180.0;
	var a = rad1 - rad2;
	var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

	var r = 6378137;
	var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(
		Math.sin(b / 2), 2)));

	// 	if (distance > 1000){
	// 	  distance = Math.round(distance / 1000);
	// 	}
	return distance;
}

/**
 * 对距离进行格式化
 */
let fnGetLongFormat = function fnGetLongFormat(long) {
	//格式化距离
	if (long > 1000) {
		return (long / 1000).toFixed(2) + 'km';
	} else {
		return long.toFixed(2) + 'm';
	}
}


/**
 * 根据经纬度获取当前位置信息
 * @param lat 纬度
 * @param lng 经度
 * @param callback
 */
let fnGetLocation = function fnGetLocation(opt = {}) {
	let _this = this;
	if (!opt.success) {
		opt.success = function() {}
	}
	if (!opt.fail) {
		opt.fail = function() {}
	}
	if (!opt.complete) {
		opt.complete = function() {}
	}
	let lat = opt.lat;
	let lng = opt.lng;


	uni.getLocation({
		type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
		success: function(res) {
			let myAmapFun = new amapFile.AMapWX({
				key: CONFIG.key
			});
			myAmapFun.getRegeo({
				location: (lng ? lng : res.longitude) + ',' + (lat ? lat : res.latitude),
				success: function(data) {
					opt.success(data[0]);
				},
				fail: function(err) {
					//失败回调
					opt.fail(err);
				}
			})
		},
		fail: function(err) {
			console.log('getLocation',err);

			opt.fail({msg:err.errMsg});
		}

	})
}


/**
 * 价格格式化
 * @param price  价格 分
 * @param type  1 分转元  2 元转分
 * @returns {number}
 */
let fnPriceFormat = function fnPriceFormat(price, type = 1) {
	if (type == 1) {
		return this.fnOperation(price, 100, '/').toFixed(2);
	}
	if (type == 2) {
		return this.fnOperation(price, 100, '*');
	}
}

/**
 * 运算 解决价格计算问题
 * @param num1
 * @param num2
 * @param symbol
 * @returns {number}
 */
let fnOperation = function fnOperation(num1, num2, symbol) {
	if (isNaN(Number(num1))) {
		num1 = 0;
	}
	if (isNaN(Number(num2))) {
		num2 = 0;
	}

	let sq1, sq2, m;
	try {
		sq1 = num1.toString().split('.')[1].length;
	} catch (e) {
		sq1 = 0;
	}
	try {
		sq2 = num2.toString().split('.')[1].length;
	} catch (e) {
		sq2 = 0;
	}
	m = Math.pow(10, Math.max(sq1, sq2));

	var result = 0;
	if (symbol == '+') {
		result = (Math.round(num1 * m) + Math.round(num2 * m)) / m;
	}

	if (symbol == '-') {
		result = (Math.round(num1 * m) - Math.round(num2 * m)) / m;
	}
	if (symbol == '*') {
		result = (Math.round(num1 * m) * Math.round(num2 * m)) / m / m;
	}
	if (symbol == '/') {
		result = (Math.round(num1 * m) / Math.round(num2 * m)) / m * m;
	}

	return Number(result.toFixed(2));
}

/**
 * 获取字符串的参数，URL参数等
 */
let fnGetStrValue = function fnGetStrValue(url) {
	if(url){
		var paramarr = url.split("?");
		if (paramarr.length > 1) {
			var paramstrarr = paramarr[1].split("&");
			var paramData = [];
			for (var i in paramstrarr) {
				var param = paramstrarr[i].split("=");
				paramData[param[0]] = param[1];
			}
			return paramData;
		}
	}
	
	return [];
}

/**
 * 检测 当前时间是否在某个时间范围
 */
let fnCheckTimeScope = function fnCheckTimeScope(starttime, endtime, type = 1) {
	let dTime = PHP.time();
	let sTime = 0;
	let eTime = 0;
	if (type == 1) {
		sTime = PHP.strtotime(PHP.date('Y-m-d ' + starttime + ':00'));
		eTime = PHP.strtotime(PHP.date('Y-m-d ' + endtime + ':00'));

	}
	if (type == 2) {
		sTime = starttime;
		eTime = endtime;
	}

	if ((dTime >= sTime && dTime <= eTime) || (eTime < sTime && dTime >= sTime && dTime >= eTime)) {
		return true;
	} else {
		return false;
	}
}



/**
 * 获取指定页面URL 或者 URL+参数
 */
let fnCurrentPageUrlOrParam = function fnCurrentPageUrlOrParam(opt = {
	type: 1,
	delta: 1,
}) {
	let delta = opt.delta ? opt.delta : 1;
	var pages = getCurrentPages() //获取加载的页面
	let indexNum = pages.length > delta ? pages.length - delta : pages.length - 1;
	var currentPage = pages[indexNum] //获取当前页面的对象
	var url = '/' + currentPage.route //当前页面url
	var options = currentPage.options //如果要获取url中所带的参数可以查看options
	if (opt.type == 1) {

		return url;
	}
	if (opt.type == 2) {
		//拼接url的参数
		var urlWithArgs = url + '?'
		for (var key in options) {
			var value = options[key]
			urlWithArgs += key + '=' + value + '&'
		}
		urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

		return urlWithArgs
	}
}



module.exports = {
	fnShowLoading,
	fnHideLoading,
	fnShowModal,
	fnGetSiteLong,
	fnGetLongFormat,
	fnGetLocation,
	fnPriceFormat,
	fnOperation,
	fnGetStrValue,
	fnCheckTimeScope,
	fnCurrentPageUrlOrParam,
	fnGetUUID
};
