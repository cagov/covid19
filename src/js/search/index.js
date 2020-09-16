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
   if (mq.matches) {
     document.getElementById("header-search-site").placeholder = "Search this site";
     document.querySelector('#dropdown-text').innerText = 'Select language';
   } else {
      document.querySelector('#dropdown-text').innerText = 'Language';
      document.getElementById("header-search-site").placeholder = "SEARCH";
   }
   }