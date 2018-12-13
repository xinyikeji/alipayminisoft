const APPID = 1;
const SECRET = 'e10adc3949ba59abbe56e057f20f883e'
const APIURL = 'https://api.yunshouyin.net.cn'
import php from './php.js'

const getPostData = function(data) {
	data['appid'] = APPID;
	data['timestamp'] = php.time();
	data['sign'] = getSign(data);
	if (data['secret']) delete data['secret'];
	return data;
}
const getSign = function(data) {
	data['secret'] = SECRET;
	php.ksort(data); // array按照key进行排序
	const queryString = [];
	var value = '';
	for (var key in data) {
		value = data[key];
		if (typeof value === 'object') value = json_encode(value, JSON_UNESCAPED_UNICODE)
		queryString.push(key + '=' + value);
	}
	return php.md5(queryString.join('&'));
}
const post = function(postdata, callback) {
	uni.request({
		url: APIURL,
		data: postdata,
		method: 'POST',
		header: {
			'custom-header': 'Alipaysoft/application' //自定义请求头信息
		},
		success(res) {
			console.log(php.json_encode(res))
			callback(true, res)
		},
		fail(res) {
			callback(false, res)
		}
	});
}
export default {
	getPostData,
	post
}