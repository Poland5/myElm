import {baseUrl} from './env'
//定义请求接口方法
// http://cangdu.org:8001/v1/cities?type=guess

export default async(url = '', data = {}, type = 'GET', method='fetch') => {
  
  //解析URL
  url = baseUrl + url;
  if(type == 'GET'){
    let dataStr = '';
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })
    if(dataStr !== ''){
      dataStr = dataStr.substr(0,dataStr.lastIndexOf('&'));
    }
    url = url + '?' + dataStr;
  }
  if(window.fetch && method == 'fetch'){
    try{
      const response = await fetch(url);
      const responseJson = await response.json();
      return responseJson;
    }catch(err){
      throw new Error;
    }
  }
}



