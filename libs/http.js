const APIURL = 'http://api.yunshouyin.org'
import php from './php.js'

const getPostData = function(data) {
  const extJson = my.getExtConfigSync();
  data['appid'] = extJson.appid;
  data['version'] = '1.0';
  data['timestamp'] = php.time();
  data['xinyitoken'] = extJson.xinyitoken;
  data['sign'] = getSign(data,extJson.secret);
  if (data['secret']) delete data['secret'];
  return data;
}
const getSign = function(data,secret) {
  data['secret'] = secret;
  php.ksort(data); // array按照key进行排序
  const queryString = [];
  var value = '';
  for (var key in data) {
    value = data[key];
    if (typeof value === 'object') value = php.json_encode(value, JSON_UNESCAPED_UNICODE)
    queryString.push(key + '=' + value);
  }
  console.log(queryString.join('&'))
  return php.md5(queryString.join('&'));
}
const post = function(postdata, callback) {
  my.httpRequest({
    url: APIURL,
    data: getPostData(postdata),
    method: 'POST',
    header: {
      'custom-header': 'Alipaysoft/application' //自定义请求头信息
    },
    success(res) {
      console.log(res)
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