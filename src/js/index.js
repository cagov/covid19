import '@cagov/step-list';
import '@cagov/accordion';

document.querySelectorAll('.show-all').forEach(btn => {
  const isCloseButton = btn.classList.contains('d-none');
  btn.addEventListener('click', () => {
    let wait = 0;
    document
      .querySelectorAll(
        `cwds-step-list .list-group-item-action${
          isCloseButton ? '.list-open' : ':not(.list-open)'
        }`
      )
      .forEach(lstitem => setTimeout(() => lstitem.click(), 50 * wait++));
    document
      .querySelectorAll('.show-all')
      .forEach(y => y.classList.toggle('d-none'));
  });
});

