const preloader = document.querySelector('.preloader');

window.addEventListener('load', () => {
  preloader.classList.add('hide');
  setTimeout(() => {
    preloader.remove('hide');
  }, 1500);
});
