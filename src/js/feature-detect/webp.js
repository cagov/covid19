(function() {

  function test(uri) {

    var image = new Image();

    function addResult(event) {
      // if the event is from 'onload', check the see if the image's width is
      // 1 pixel (which indiciates support). otherwise, it fails

      var result = event && event.type === 'load' ? image.width == 1 : false;
      if(!result) {
        document.body.classList.add('no-webp')
      }

    }

    image.onerror = addResult;
    image.onload = addResult;

    image.src = uri;
  }

  test('data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=');
  
})()