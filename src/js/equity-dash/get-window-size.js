export default function getScreenResizeCharts() {
  // Putting this in a special scope for just this component.
  window.charts = {};
  // Get window size, return based on breakpoint settings,
  // Then return mobile, tablet or desktop.
  const getIsHighDensity = () => {
    return (
      (window.matchMedia &&
        (window.matchMedia(
          "only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)"
        ).matches ||
          window.matchMedia(
            "only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)"
          ).matches)) ||
      (window.devicePixelRatio && window.devicePixelRatio > 1.3)
    );
  };

  const getIsRetina = () => {
    return (
      ((window.matchMedia &&
        (window.matchMedia(
          "only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)"
        ).matches ||
          window.matchMedia(
            "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)"
          ).matches)) ||
        (window.devicePixelRatio && window.devicePixelRatio >= 2)) &&
      /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
    );
  };

  const getOrientation = () => {
    var orientation =
      (screen.orientation || {}).type ||
      screen.mozOrientation ||
      screen.msOrientation;
    if (orientation === "landscape-primary") {
      return 'landscape';
    } else if (orientation === "landscape-secondary") {
      // Upside down
      return 'landscape';
    } else if (
      orientation === "portrait-secondary" ||
      orientation === "portrait-primary"
    ) {
      return 'portrait';
    } else if (orientation === undefined) {
      return null;
    }
    return null;
  };

  const getWindowSize = () => {
    let windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let isRetina = getIsRetina();
    let highDensity = getIsHighDensity();
    let orientation = getOrientation();

    // console.log('retina', isRetina, 'highDensity', highDensity, 'orientation', orientation);
  
    if (window.charts !== undefined) {
      if (windowSize.width <= 576) {
        window.charts.displayType = "mobile";
        if (highDensity === true || isRetina === true) {
          window.charts.displayType = "retina";
        }
      } else if (windowSize.width > 576 && windowSize.width <= 768) {
        window.charts.displayType = "tablet";
      } else {
        window.charts.displayType = "desktop";
      }
    }
  };

  

  const handleResize = () => {
    getWindowSize();
  };

  window.addEventListener("resize", handleResize);
  handleResize();
}
