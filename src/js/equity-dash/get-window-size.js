export default function getScreenDisplayType() {
  window.equitydash = {};
  // Get window size, return based on breakpoint settings, then return mobile, tablet or desktop.
  const getWindowSize = () => {
    let windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    // @TODO how best to configure global breakpoint settings?
    if (window.equitydash !== undefined) {
      if (windowSize.width < 576) {
        window.equitydash.displayType = 'mobile';
      } else if (windowSize.width > 576 && windowSize.width <= 768) {
        return 'tablet'
        window.equitydash.displayType = 'tablet';
      } else {
        window.equitydash.displayType = 'desktop';
      }
    }
  }

  const handleResize = () => {
    getWindowSize();
    console.log('resized', window.equitydash.displayType);
  };

  // @TODO connect debounce
  // const debounce = (value, delay) => {
  //   let debouncedValue = value;
  //   const handler = setTimeout(() => {
  //     debouncedValue = value;
  //   }, delay);
  //
  //   return () => {
  //     clearTimeout(handler);
  //   };
  //
  //   return debouncedValue;
  // };
  
  window.addEventListener('resize', handleResize);
  handleResize();
}
