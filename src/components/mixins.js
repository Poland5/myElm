export const loadMore = {
  directives: {
    'load-more':{
      bind:(el, binding) => {
        let elHeight;
        let setTop;
        let windowHeight = window.screen.height;
        let elScroll = document.body;

        el.addEventListener('touchstart', () => {
          elHeight = el.clientHeight;
          setTop = el.offsetTop;
        },false);

        el.addEventListener('touchmove', () => {
          loadMore();
        })

        el.addEventListener('touchend', () => {
					oldScrollTop = scrollEl.scrollTop;
					moveEnd();
				}, false)

				const moveEnd = () => {
					requestFram = requestAnimationFrame(() => {
						if (elScroll.scrollY != oldScrollTop) {
							oldScrollTop = elScroll.scrollY;
							moveEnd()
						} else {
							cancelAnimationFrame(requestFram);
							height = elHeight.clientHeight;
							loadMore();
						}
					})
				}
        
        const loadMore = () => {
          if(window.scrollY + windowHeight >= elHeight + setTop){
            binding.value();
          }
        }
      }
    }
  }
}

export const getImgPath = {
  methods:{
    getImgPath(path){
      let suffix;
      if(!path){
        return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
      }
      if(path.indexOf('jpeg') !== -1){
        suffix = '.jpeg'
      }else{
        suffix = '.png'
      }
      let url = '/' + path.substr(0,1) + '/' + path.substr(1,2) + '/' + path.substr(3) + suffix;
      return 'https://fuss10.elemecdn.com' + url;
    }
  }
}