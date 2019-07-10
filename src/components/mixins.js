import { getStyle } from '../config/utils'
export const loadMore = {
  directives: {
    'load-more': {
      bind:(el, binding) => {
        let elHeight
        let setTop
        let paddingBottom
        let marginBottom
        let oldScrollTop
        let scrollTop
        let heightEl
        let windowHeight = window.screen.height
        let scrollType = el.attributes.type && el.attributes.type.value

        el.addEventListener('touchstart', () => {
          elHeight = el.clientHeight; // 当前文档的整体高度
          setTop = el.offsetTop; // 当前文档离顶端距离
          paddingBottom = getStyle(el, 'paddingBottom')
          marginBottom = getStyle(el, 'marginBottom')
        }, false)

        el.addEventListener('touchmove', () => {
          loadMore()
        }, false)

        el.addEventListener('touchend', () => {
          scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          oldScrollTop = scrollTop
          moveEnd()
        }, false)

				const moveEnd = () => {
					const requestFram = requestAnimationFrame(() => {
            console.log('scrollTop :', scrollTop);
						if (elHeight.scrollTop != oldScrollTop) {
              oldScrollTop = el.scrollTop
							moveEnd()
						} else {
							cancelAnimationFrame(requestFram)
							heightEl = el.clientHeight
              loadMore()
						}
					})
				}

        const loadMore = () => {
          if (window.scrollY + windowHeight >= elHeight + setTop + paddingBottom + marginBottom) {
            binding.value()
          }
        }
      }
    }
  }
}

// 解析图片重新组合成 https://fuss10.elemecdn.com/b/ff/533cf9617bd57fe1dfb05603bebcfpng.png
export const getImgPath = {
  methods: {
    getImgPath(path) {
      let suffix
      if (!path) {
        return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
      }
      if (path.indexOf('jpeg') !== -1) {
        suffix = '.jpeg'
      } else {
        suffix = '.png'
      }
      let url = '/' + path.substr(0,1) + '/' + path.substr(1,2) + '/' + path.substr(3) + suffix;
      return 'https://fuss10.elemecdn.com' + url;
    }
  }
}
