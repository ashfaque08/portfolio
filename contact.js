(function initContactDialog() {
  const dialog = document.getElementById('contact-dialog');
  const form = document.getElementById('contact-form');
  if (!dialog) return;

  const closeDialog = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-contact-open]');
    if (trigger) {
      const service = dialog.querySelector('#contact-service');
      if (service) service.value = trigger.dataset.contactOpen;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      return;
    }

    if (event.target.closest('.contact-close')) closeDialog();
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog();
  });

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = `Project inquiry — ${data.get('service')}`;
      const body = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Service: ${data.get('service')}`,
        '',
        data.get('message')
      ].join('\n');
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
