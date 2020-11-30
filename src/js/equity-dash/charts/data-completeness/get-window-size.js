export default function getScreenDisplayType() {
  // Putting this in a special scope for just this component.
  window.missingness = {};
  // Get window size, return based on breakpoint settings,
  // Then return mobile, tablet or desktop.
  const getWindowSize = () => {
    let windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    if (window.missingness !== undefined) {
      if (windowSize.width <= 576) {
        window.missingness.displayType = 'mobile';
      } else if (windowSize.width > 576 && windowSize.width <= 768) {
        return 'tablet'
        window.missingness.displayType = 'tablet';
      } else {
        window.missingness.displayType = 'desktop';
      }
    }
  }

  const handleResize = () => {
    getWindowSize();
  };

  window.addEventListener('resize', handleResize);
  handleResize();
}
