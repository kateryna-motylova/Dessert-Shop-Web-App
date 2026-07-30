import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.modal-form');
const closeBtn = document.querySelector('.modal-close');
const modalContainer = document.querySelector('.modal-container');

let dessertsId = null;

function openOrderModal(dessertId) {
  dessertsId = dessertId;
  modalContainer.classList.add('is-open');
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');

  closeBtn.addEventListener('click', closeOrderModal);
  modalContainer.addEventListener('click', handleBackdropClick);
  document.addEventListener('keydown', handleEscKey);
}

function closeOrderModal() {
  modalContainer.classList.remove('is-open');
  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');

  closeBtn.removeEventListener('click', closeOrderModal);
  modalContainer.removeEventListener('click', handleBackdropClick);
  document.removeEventListener('keydown', handleEscKey);

  dessertsId = null;
}

function handleBackdropClick(event) {
  if (event.target === modalContainer) closeOrderModal();
}

function handleEscKey(event) {
  if (event.key === 'Escape' && modalContainer.classList.contains('is-open')) {
    closeOrderModal();
  }
}

document.addEventListener('open-order', event => {
  openOrderModal(event.detail.dessertId);
});

form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  const { username, phone, textComment } = event.target.elements;

  const formData = {
    name: username.value.trim(),
    phone: phone.value.trim(),
    dessertId: dessertsId,
    comment: textComment.value.trim(),
  };

  try {
    const res = await axios.post(
      'https://deserts-store.b.goit.study/api/orders',
      formData
    );

    const orderData = res.data;
    iziToast.success({
      title: `${orderData.name}`,
      message: `Ви замовили ${orderData.dessertName}, номер вашого замовлення ${orderData.orderNum}`,
      position: 'topRight',
    });

    form.reset();
    closeOrderModal();
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: `${error}`,
      position: 'topRight',
    });
  }
}
