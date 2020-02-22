import { getItems, deleteItem, addItem, editItem } from './itemOperations';
import { openModal, closeModal } from './modal';
import { addLeadingZeros } from './utils';

const view = ({ id, title, price, deliveryIncluded, availableFrom, detailsURL }, pushNewURL = true) => {
  const detailsGrid = document.createElement('div');
  detailsGrid.classList = 'item-details';
  const priceRowLabel = document.createElement('div');
  priceRowLabel.className = 'item-details__label';
  priceRowLabel.innerText = 'Price:';
  const priceRowValue = document.createElement('div');
  priceRowValue.className = 'item-details__value';
  priceRowValue.innerText = `EUR ${price.toLocaleString()}`;
  const deliveryIncludedRowLabel = document.createElement('div');
  deliveryIncludedRowLabel.className = 'item-details__label';
  deliveryIncludedRowLabel.innerText = 'Delivery Included:';
  const deliveryIncludedRowValue = document.createElement('div');
  deliveryIncludedRowValue.className = 'item-details__value';
  deliveryIncludedRowValue.innerText = deliveryIncluded ? 'Yes' : 'No';
  const availableFromRowLabel = document.createElement('div');
  availableFromRowLabel.className = 'item-details__label';
  availableFromRowLabel.innerText = 'Available From:';
  const availableFromRowValue = document.createElement('div');
  availableFromRowValue.className = 'item-details__value';
  availableFromRowValue.innerText = new Date(availableFrom).toLocaleDateString();
  const detailsURLRowLabel = document.createElement('div');
  detailsURLRowLabel.className = 'item-details__label';
  detailsURLRowLabel.innerText = 'Details URL:';
  const detailsURLRowValue = document.createElement('div');
  detailsURLRowValue.className = 'item-details__value';
  const detailsColumnAnchor = document.createElement('a');
  detailsColumnAnchor.setAttribute('target', '_blank');
  detailsColumnAnchor.className = 'item-details__value__link';
  detailsColumnAnchor.href = detailsURL;
  detailsColumnAnchor.innerText = 'See details';
  detailsURLRowValue.appendChild(detailsColumnAnchor);
  detailsGrid.appendChild(priceRowLabel);
  detailsGrid.appendChild(priceRowValue);
  detailsGrid.appendChild(deliveryIncludedRowLabel);
  detailsGrid.appendChild(deliveryIncludedRowValue);
  detailsGrid.appendChild(availableFromRowLabel);
  detailsGrid.appendChild(availableFromRowValue);
  detailsGrid.appendChild(detailsURLRowLabel);
  detailsGrid.appendChild(detailsURLRowValue);

  // TODO: re-use value renderers here and in main grid render function

  const cancelButton = document.createElement('button');
  cancelButton.setAttribute('type', 'button');
  cancelButton.className = 'modal-button modal-button--cancel';
  cancelButton.innerText = 'Close';
  cancelButton.addEventListener('click', () => closeModal());
  
  openModal(
    title,
    detailsGrid,
    cancelButton,
    pushNewURL
      ? () => {
          window.history.pushState({}, '', `/view/${id}`);
        }
      : () => {},
    () => {
      window.history.pushState({}, '', '/');
    },
  );
};

const edit = (item, onSave, pushNewURL = true) => {
  // TODO: use label elements
  const currentDate = new Date();
  const detailsGrid = document.createElement('form');
  detailsGrid.addEventListener('submit', event => event.preventDefault());
  detailsGrid.classList = 'item-details item-details--new';
  const titleRowLabel = document.createElement('div');
  titleRowLabel.className = 'item-details__label';
  titleRowLabel.innerText = 'Title:';
  const titleRowValue = document.createElement('div');
  titleRowValue.className = 'item-details__value';
  const titleInput = document.createElement('input');
  titleInput.name = 'title';
  titleInput.className = 'item-details__value__input';
  titleInput.setAttribute('maxLength', 255);
  titleInput.setAttribute('required', 'true');

  if (item) {
    titleInput.value = item.title;
  }

  titleRowValue.appendChild(titleInput);
  const priceRowLabel = document.createElement('div');
  priceRowLabel.className = 'item-details__label';
  priceRowLabel.innerText = 'Price:';
  const priceRowValue = document.createElement('div');
  priceRowValue.className = 'item-details__value';
  const priceInput = document.createElement('input');
  priceInput.name = 'price';
  priceInput.className = 'item-details__value__input';
  priceInput.setAttribute('type', 'number');
  priceInput.setAttribute('step', '0.01');
  priceInput.setAttribute('min', '0');
  priceInput.setAttribute('required', 'true');

  if (item) {
    priceInput.value = item.price;
  }

  priceRowValue.appendChild(priceInput);
  const deliveryIncludedRowLabel = document.createElement('div');
  deliveryIncludedRowLabel.className = 'item-details__label';
  deliveryIncludedRowLabel.innerText = 'Delivery Included:';
  const deliveryIncludedRowValue = document.createElement('div');
  deliveryIncludedRowValue.className = 'item-details__value';
  const deliveryIncludedInput = document.createElement('input');
  deliveryIncludedInput.name = 'deliveryIncluded';
  deliveryIncludedInput.className = 'item-details__value__input item-details__value__input--checkbox';
  deliveryIncludedInput.setAttribute('type', 'checkbox');

  if (item) {
    deliveryIncludedInput.checked = item.deliveryIncluded;
  }

  deliveryIncludedRowValue.appendChild(deliveryIncludedInput);
  const availableFromRowLabel = document.createElement('div');
  availableFromRowLabel.className = 'item-details__label';
  availableFromRowLabel.innerText = 'Available From:';
  const availableFromRowValue = document.createElement('div');
  availableFromRowValue.className = 'item-details__value';
  const availableFromInput = document.createElement('input');
  availableFromInput.name = 'availableFrom';
  availableFromInput.className = 'item-details__value__input';
  availableFromInput.setAttribute('type', 'date');
  availableFromInput.setAttribute('min', `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
  availableFromInput.setAttribute('required', 'true');

  if (item) {
    const availableFrom = new Date(item.availableFrom);

    availableFromInput.value = `${availableFrom.getFullYear()}-${addLeadingZeros(availableFrom.getMonth() + 1, 2)}-${addLeadingZeros(availableFrom.getDate(), 2)}`;
  }

  availableFromRowValue.appendChild(availableFromInput);
  const detailsURLRowLabel = document.createElement('div');
  detailsURLRowLabel.className = 'item-details__label';
  detailsURLRowLabel.innerText = 'Details URL:';
  const detailsURLRowValue = document.createElement('div');
  detailsURLRowValue.className = 'item-details__value';
  const detailsURLInput = document.createElement('input');
  detailsURLInput.name = 'detailsURL';
  detailsURLInput.className = 'item-details__value__input';
  detailsURLInput.setAttribute('type', 'url');
  detailsURLInput.setAttribute('required', 'true');

  if (item) {
    detailsURLInput.value = item.detailsURL;
  }

  detailsURLRowValue.appendChild(detailsURLInput);
  detailsGrid.appendChild(titleRowLabel);
  detailsGrid.appendChild(titleRowValue);
  detailsGrid.appendChild(priceRowLabel);
  detailsGrid.appendChild(priceRowValue);
  detailsGrid.appendChild(deliveryIncludedRowLabel);
  detailsGrid.appendChild(deliveryIncludedRowValue);
  detailsGrid.appendChild(availableFromRowLabel);
  detailsGrid.appendChild(availableFromRowValue);
  detailsGrid.appendChild(detailsURLRowLabel);
  detailsGrid.appendChild(detailsURLRowValue);

  const saveButton = document.createElement('button');
  saveButton.setAttribute('type', 'button');
  saveButton.className = 'modal-button modal-button--save';
  saveButton.innerText = 'Save';
  saveButton.addEventListener('click', async () => {
    const form = document.querySelector('.item-details.item-details--new');

    if (form.reportValidity()) {
      try {
        const formData = new FormData(form);
        const dataOject = {};
        let savedItem;

        for (const [key, value]  of formData.entries()) {
          dataOject[key] = value;
        }

        if (item) {
          savedItem = await editItem({ ...dataOject, id: item.id });
        } else {
          savedItem = await addItem(dataOject);
        }

        const closeErrorButton = document.createElement('button');
        closeErrorButton.setAttribute('type', 'button');
        closeErrorButton.className = 'modal-button modal-button--cancel';
        closeErrorButton.innerText = 'OK';
        closeErrorButton.addEventListener('click', () => closeModal());

        openModal(
          `Item successfully ${item ? 'updated' : 'added'}`,
          document.createElement('span'),
          closeErrorButton,
          () => {
            window.history.pushState({}, '', '/');
          },
          () => {}
        );

        onSave(savedItem);
      } catch (error) {
        const errorCnt = document.createElement('span');
        errorCnt.innerText = error.toString();
        const closeErrorButton = document.createElement('button');
        closeErrorButton.setAttribute('type', 'button');
        closeErrorButton.className = 'modal-button modal-button--cancel';
        closeErrorButton.innerText = 'OK';
        closeErrorButton.addEventListener('click', () => closeModal());
  
        openModal(
          `An error occurred while ${item ? 'updating the' : 'saving new'} item`,
          errorCnt,
          closeErrorButton,
          () => {
            window.history.pushState({}, '', '/');
          },
          () => {}
        );
      }
    }
  });
  const cancelButton = document.createElement('button');
  cancelButton.setAttribute('type', 'button');
  cancelButton.className = 'modal-button modal-button--cancel';
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => closeModal());
  const buttonsCnt = document.createElement('div');
  buttonsCnt.appendChild(saveButton);
  buttonsCnt.appendChild(cancelButton);
  
  openModal(
    item ? 'Edit item' : 'New item',
    detailsGrid,
    buttonsCnt,
    pushNewURL
      ? () => {
          window.history.pushState({}, '', item ? `/edit/${item.id}` : '/new');
        } 
      : () => {},
    () => {
      window.history.pushState({}, '', '/');
    }
  );
};

const remove = async ({ id, title }, onRemove, pushNewURL = true) => {
  const question = document.createElement('div');
  question.innerText = 'Are you sure you want to delete this item?';

  const buttonsCnt = document.createElement('div');
  const confirmButton = document.createElement('button');
  confirmButton.setAttribute('type', 'button');
  confirmButton.className = 'modal-button modal-button--confirm-delete';
  confirmButton.innerText = 'Confirm';
  confirmButton.addEventListener('click', async () => {
    closeModal(
      () => {
        window.history.replaceState({}, '', '/');
      }
    );

    const success = await deleteItem(id);

    if (success) {
      onRemove();
    }
  });
  const cancelButton = document.createElement('button');
  cancelButton.setAttribute('type', 'button');
  cancelButton.className = 'modal-button modal-button--cancel';
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => closeModal());
  buttonsCnt.appendChild(confirmButton);
  buttonsCnt.appendChild(cancelButton);
  
  openModal(
    `Delete "${title}"?`,
    question,
    buttonsCnt,
    pushNewURL
      ? () => {
          window.history.pushState({}, '', `/delete/${id}`);
        }
      : () => {},
    () => {
      window.history.pushState({}, '', '/');
    }
  );
};

export {
  view,
  edit,
  remove
};
