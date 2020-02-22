import './index.css';
import './table.css';
import './modal.css';

import setupModal from './modal';
import { getItems, getItem } from './itemOperations';
import {
  view as openItemDetails, 
  edit as openEditItemDialog, 
  remove as openItemDeleteDialog
} from './itemDialogs';
import { renderRows, appendRows, updateRow, clear as clearTable } from './itemTable';

let closeModal;
let page = 1;
let allItemsLoaded = false;
const pageSize = 10;
const actions = {
  view: item => openItemDetails(item),
  edit: item => {
    openEditItemDialog(
      item,
      savedItem => updateRow(savedItem)
    );
  },
  delete: item => {
    openItemDeleteDialog(
      item,
      rerenderAfterDelete
    );
  }
};

const needToLoadMore = () => {
  const d = document.documentElement;
  const offset = d.scrollTop + window.innerHeight;
  const height = d.offsetHeight;

  return !allItemsLoaded && height < offset;
};

const rerenderAfterDelete = async () => {
  const scrollTop = document.documentElement.scrollTop;
  const items = await getItems(1, (page - 1) * pageSize);

  clearTable();
  appendRows(renderRows(items, actions));
  window.scrollTo(0, scrollTop);
};

const loadItems = async () => {
  const items = await getItems(page, pageSize);

  if (items.length === 0) {
    allItemsLoaded = true;
  } else {
    page++;
  }

  appendRows(renderRows(items, actions));
};

const restoreItemFromPathname = async (pathname, onSuccess) => {
  try {
    const item = await getItem(pathname.match(/([0-9]+)/)[0]);

    onSuccess(item);
  } catch (error) {
    console.error('An error occurred trying to restore a state', error);
    window.history.replaceState({}, '', '/');
  }
}

const handleLocationChange = async () => {
  const pathname = document.location.pathname;

  if (pathname === '/') {
    closeModal();
  } else if (pathname === '/new') {
    openEditItemDialog(
      undefined,
      savedItem => {
        if (allItemsLoaded) {
          appendRows(renderRows([savedItem], actions));
        }
      },
      false
    );
  } else if (/^\/view\/[0-9]+$/.test(pathname)) {
    restoreItemFromPathname(pathname, item => openItemDetails(item, false));
  } else if (/^\/edit\/[0-9]+$/.test(pathname)) {
    restoreItemFromPathname(
      pathname,
      item => {
        openEditItemDialog(
          item,
          savedItem => updateRow(savedItem),
          false
        );
      }
    );
  } else if (/^\/delete\/[0-9]+$/.test(pathname)) {
    restoreItemFromPathname(pathname, item => openItemDeleteDialog(item, rerenderAfterDelete, false));
  }
};

async function init() {
  const { closeModal: close } = setupModal();
  closeModal = close;

  handleLocationChange();

  window.addEventListener('popstate', () => {
    handleLocationChange();
  });

  document.addEventListener('scroll', async () => {
    const d = document.documentElement;
    const offset = d.scrollTop + window.innerHeight;
    const height = d.offsetHeight;
  
    if (offset === height) {
      await loadItems();
    }
  });

  document.querySelector('.add-new-item').addEventListener('click', () => {
    openEditItemDialog(
      undefined,
      savedItem => {
        if (allItemsLoaded) {
          appendRows(renderRows([savedItem], actions));
        }
      }
    );
  });

  try {
    while(needToLoadMore()) {
      await (loadItems());
    }
  } catch (excetion) {
    console.error('An error occurred while fetching items', excetion);
  }
}

init();
