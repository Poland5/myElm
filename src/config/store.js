/**
*  html5提供两种新的客户端存储数据的方法：localStorage和sessionStorage。
*  localStorage 方法是长期保存，存储的数据没有时间限制。
*  而sessionStorage 方法是临时保存，针对一个 session 进行数据存储。
*  当用户关闭浏览器窗口后，数据会被删除。
*  这里主要讲解一下localstorage的用法。
*  localstorage官方建议5M的存储空间，它只能存储字符串格式的数据，所以最好在每次存储时把数据转换成json格式，取出的时候再转换回来。
*/

export const setStore = (name, context) => {
  if (typeof context !== 'String') {
    context = JSON.stringify(context)
  }
  window.localStorage.setItem(name, context);
}

export const getStore = name => {
  if (!name) {
    return
  }
  return window.localStorage.getItem(name);
}

export const clearStore = key => {
  if (!key) {
    return
  }
  return window.localStorage.removeItem(key)
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
      target = element.scrollTop;
    } else if (element.currentStyle) {
      target = element.currentStyle[attr];
    } else {
      target = document.defaultView.getComputedStyle(element,null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
  }
