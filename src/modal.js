let animationDurationMs;
let closeTimeout;
let closeCallback;

const resetModal = () => {
  document.querySelector('.modal').className = 'modal';
  document.body.className = '';
};

export const closeModal = onClose => {
  if (document.querySelector('.modal.modal--open')) {
    document.querySelector('.modal').className = 'modal modal--closing';

    if (onClose) {
      closeCallback = onClose;
    }

    closeTimeout = setTimeout(() => {
      resetModal();
      closeTimeout = undefined;

      if (closeCallback) closeCallback();
    }, animationDurationMs);
  }
};

export const openModal = (title, content, buttons, onOpen, onClose) => {
  if (closeTimeout !== undefined) {
    clearTimeout(closeTimeout);
    resetModal();
  }

  document.querySelector('.modal .modal__window__header__title').innerText = title;
  document.querySelector('.modal .modal__window__content').innerHTML = '';
  document.querySelector('.modal .modal__window__content').appendChild(content);
  document.querySelector('.modal .modal__window__footer').innerHTML = '';
  document.querySelector('.modal .modal__window__footer').appendChild(buttons);
  document.querySelector('.modal').className = 'modal modal--open';
  document.body.className = 'modal-open';

  if (onOpen) onOpen();

  closeCallback = onClose;
};

const setupModal = (animationDuration = 500) => {
  animationDurationMs = animationDuration;
  document.querySelector('.modal').style.animationDuration = `${(animationDurationMs / 1000).toFixed(2)}s`;
  document.querySelector('.modal .modal__window').addEventListener('click', event => {
    event.stopPropagation();
  });
  document.querySelector('.modal .modal__overlay').addEventListener('click', () => closeModal());
  document.querySelector('.modal .modal__window__header__close').addEventListener('click', () => closeModal());
  // TODO: remove listeners on page unload
  window.addEventListener('keyup', ({ key }) => {
    const modal = document.querySelector('.modal.modal--open');

    if (key === 'Escape' && modal) {
      closeModal();
    }
  });

  return {
    closeModal,
    openModal
  };
};

export default setupModal;
