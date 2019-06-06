/**
 * 获取style样式
 */
export const getStyle = (element, attr, numberModel = 'int') => {
  let target
  if (element.currentStyle) {
    target = element.currentStyle[attr]
  } else {
    target = document.defaultView.getComputedStyle(element,null)[attr]
  }
  return numberModel == 'float' ? parseFloat(target) : parseInt(target)
}
