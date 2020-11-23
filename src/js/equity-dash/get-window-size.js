export default function getScreenDisplayType() {
  window.charts = {};
  // Get window size, return based on breakpoint settings, then return mobile, tablet or desktop.
  const getWindowSize = () => {
    let windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    // @TODO how best to configure global breakpoint settings?
    if (window.charts !== undefined) {
      if (windowSize.width < 576) {
        window.charts.displayType = 'mobile';
      } else if (windowSize.width > 576 && windowSize.width <= 768) {
        return 'tablet'
        window.charts.displayType = 'tablet';
      } else {
        window.charts.displayType = 'desktop';
      }
    }
  }

  const handleResize = () => {
    getWindowSize();
    // console.log('resized', window.charts.displayType);
  };

  // @TODO connect a debouncer

  window.addEventListener('resize', handleResize);
  handleResize();
}
