// Add a class when the search fields are focused, remove on blur, taken from trilogy and dejquerified
document.querySelector('.header-search-field').addEventListener('focus', () => {
   document.querySelector('.header-search').classList.add('focused');
})
document.querySelector('.header-search-button').addEventListener('focus', () => {
   document.querySelector('.header-search').classList.add('focused');
})
document.querySelector('.header-search-label').addEventListener('focus', () => {
   document.querySelector('.header-search').classList.add('focused');
})
document.querySelector('.header-search-field').addEventListener('blur', () => {
   document.querySelector('.header-search').classList.remove('focused');
})
document.querySelector('.header-search-button').addEventListener('blur', () => {
   document.querySelector('.header-search').classList.remove('focused');
})
document.querySelector('.header-search-label').addEventListener('blur', () => {
   document.querySelector('.header-search').classList.remove('focused');
});





// media query event handler
if (matchMedia) {
   const mq = window.matchMedia("(min-width: 768px)");
   mq.addListener(WidthChange);
   WidthChange(mq);
   }
   
   // media query change
   function WidthChange(mq) {
      var oSearch = document.getElementById("header-search-site");
      var oLanguage = document.querySelector('#dropdown-text');
   if (mq.matches) {
      oSearch.placeholder = oSearch.dataset.placeholderWide;
      oLanguage.innerText = oLanguage.dataset.labelWide;
   } else {
      oLanguage.innerText = oLanguage.dataset.labelMobile;
      oSearch.placeholder = oSearch.dataset.placeholderMobile;
   }
   }