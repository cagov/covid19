const modal = document.getElementById('video-modal');
const video = document.getElementById('video-container');
const openers = document.getElementsByClassName('video-modal-open');
const closers = document.getElementsByClassName('video-modal-close');

// Embed is straight from YouTube's UI. One exception: added the '?autoplay=1' at end of src.
const youtubeEmbed = `
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/1zDX9PXkotA?autoplay=1" 
  frameborder="0" 
  allow="accelerometer; autoplay; encrypted-media; gyroscope" 
  allowfullscreen>
</iframe>
`;

// When modal pops up, add various listeners so user can close it.
const addModalListeners = () => {
  Array.from(closers).forEach(element => { element.addEventListener('click', toggleModal); });
  modal.addEventListener('click', toggleModal);
  document.addEventListener('keydown', escapeModal);
};

// When modal is closed, undo addModalListeners. We don't need the listeners when the modal isn't open.
const removeModalListeners = () => {
  Array.from(closers).forEach(element => { element.removeEventListener('click', toggleModal); });
  modal.removeEventListener('click', toggleModal);
  document.removeEventListener('keydown', escapeModal);
};

// Close the modal when user presses escape key.
const escapeModal = (event) => {
  if (event.keyCode === 27) { closeModal(); }
};

// Manipulate HTML to open the modal. Add listeners too.
const openModal = () => {
  modal.style.display = 'block';
  document.body.classList.add('popup_visible');
  video.innerHTML = youtubeEmbed;
  addModalListeners();
};

// Manipulate HTML to close the modal. Remove listeners.
const closeModal = () => {
  modal.style.display = 'none';
  document.body.classList.remove('popup_visible');
  video.innerHTML = '';
  removeModalListeners();
};

// Open or close the modal depending upon modal's display property.
// Seems redundant but the secret sauce here is the event.preventDefault().
// We can put a fallback link into the open-the-modal link's href.
// This fallback link will work in no-JS browsers. event.preventDefault() will otherwise block it.
const toggleModal = (event) => {
  event.preventDefault();
  if (modal.style.display === 'none') {
    openModal();
  } else {
    closeModal();
  }
};

// Add listeners to various elements to open up the modal.
Array.from(openers).forEach(element => { element.addEventListener('click', toggleModal); });
