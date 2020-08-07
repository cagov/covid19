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
})
