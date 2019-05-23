import {baseUrl} from './env'
//定义请求接口方法
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
    let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		}
    if(type == 'POST'){
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    try{
      const response = await fetch(url, requestConfig);
      const responseJson = await response.json();
      return responseJson;
    }catch(err){
      throw new Error;
    }
  }
}



