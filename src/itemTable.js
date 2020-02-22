const renderRows = (items, { view: onView, edit: onEdit, delete: onDelete }) => {
  var fragment = new DocumentFragment();

  items.forEach(({ id, title, price, deliveryIncluded, availableFrom, detailsURL }) => {
    const row = document.createElement('div');
    row.className = 'table__row';
    row.id = `item-${id}`;

    const titleColumn = document.createElement('div');
    titleColumn.className = 'table__row__title';
    titleColumn.innerText = title;

    const priceColumn = document.createElement('div');
    priceColumn.className = 'table__row__price';

    const priceColumnLabel = document.createElement('span');
    priceColumnLabel.className = 'table__row__price__label';
    priceColumnLabel.innerText = 'Price: ';

    const priceColumnValue = document.createElement('span');
    priceColumnValue.className = 'table__row__price__value';
    priceColumnValue.innerText = `EUR ${price.toLocaleString()}`;

    priceColumn.appendChild(priceColumnLabel);
    priceColumn.appendChild(priceColumnValue);

    const deliveryIncludedColumn = document.createElement('div');
    deliveryIncludedColumn.className = `table__row__included table__row__included--${deliveryIncluded ? 'ticked' : 'not-ticked'}`;

    const deliveryIncludedLabel = document.createElement('span');
    deliveryIncludedLabel.className = 'table__row__included__label';
    deliveryIncludedLabel.innerText = 'Delivery included: ';

    const deliveryIncludedCheckbox = document.createElement('span');
    deliveryIncludedCheckbox.className = 'table__row__included__checkbox';

    deliveryIncludedColumn.appendChild(deliveryIncludedLabel);
    deliveryIncludedColumn.appendChild(deliveryIncludedCheckbox);

    const availabilityColumn = document.createElement('div');
    availabilityColumn.className = 'table__row__availability';

    const availabilityColumnLabel = document.createElement('span');
    availabilityColumnLabel.className = 'table__row__availability__label';
    availabilityColumnLabel.innerText = 'Available from:';

    const  availabilityColumnValue = document.createElement('span');
    availabilityColumnValue.className = 'table__row__availability__value';
    availabilityColumnValue.innerText = new Date(availableFrom).toLocaleDateString();

    availabilityColumn.appendChild(availabilityColumnLabel);
    availabilityColumn.appendChild(availabilityColumnValue);

    const detailsColumn = document.createElement('div');
    detailsColumn.className = 'table__row__details';

    const detailsColumnLabel = document.createElement('span');
    detailsColumnLabel.className = 'table__row__details__label';
    detailsColumnLabel.innerText = 'Details:';

    const detailsColumnValue = document.createElement('a');
    detailsColumnValue.setAttribute('target', '_blank');
    detailsColumnValue.className = 'table__row__details__link';
    detailsColumnValue.href = detailsURL;
    detailsColumnValue.innerText = 'See details';

    detailsColumn.appendChild(detailsColumnLabel);
    detailsColumn.appendChild(detailsColumnValue);

    const actionsColumn = document.createElement('div');
    actionsColumn.className = 'table__row__actions';

    const openButton = document.createElement('button');
    openButton.setAttribute('type', 'button');
    openButton.className = 'table__row__actions--open';
    openButton.innerText = 'Open';
    openButton.addEventListener('click', () => {
      onView({ id, title, price, deliveryIncluded, availableFrom, detailsURL });
    });

    const editButton = document.createElement('button');
    editButton.setAttribute('type', 'button');
    editButton.className = 'table__row__actions--edit';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => {
      onEdit({ id, title, price, deliveryIncluded, availableFrom, detailsURL });
    });

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.className = 'table__row__actions--delete';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
      onDelete({ id, title });
    });

    actionsColumn.appendChild(openButton);
    actionsColumn.appendChild(editButton);
    actionsColumn.appendChild(deleteButton);

    row.appendChild(titleColumn);
    row.appendChild(priceColumn);
    row.appendChild(deliveryIncludedColumn);
    row.appendChild(availabilityColumn);
    row.appendChild(detailsColumn);
    row.appendChild(actionsColumn);

    fragment.appendChild(row);
  });

  return fragment;
};

const updateRow = ({ id, title, price, deliveryIncluded, availableFrom, detailsURL }) => {
  const row = document.querySelector(`.table__row[id="item-${id}"]`);
  
  if (row) {
    row.querySelector('.table__row__title').innerText = title;
    row.querySelector('.table__row__price__value').innerText = `EUR ${price.toLocaleString()}`;
    row.querySelector('.table__row__included').className = `table__row__included table__row__included--${deliveryIncluded ? 'ticked' : 'not-ticked'}`;
    row.querySelector('.table__row__availability__value').innerText = new Date(availableFrom).toLocaleDateString();
    row.querySelector('.table__row__details__link').href = detailsURL;
  }
};

const appendRows = rows => document.querySelector('.table').appendChild(rows);

const clear = () => document.querySelectorAll('.table__row').forEach(r => r.remove());

export {
  renderRows,
  appendRows,
  updateRow,
  clear
};
