const endpointURL = 'http://localhost:3000/items';

// TODO: read endpoint URL from environment variable

const getAjaxExeption = status => new Error(`Unknown AJAX error. HTTP Status: ${status}`);

const getItems = async (page = undefined, pageSize = undefined) => {
  let response;

  if (page >= 0 && pageSize > 0) {
    response = await fetch(`${endpointURL}?_page=${page}&_limit=${pageSize}`);
  } else {
    response = await fetch(endpointURL);
  }

  if (response.ok) {
    return await response.json();
  } else {
    throw getAjaxExeption(response.status);
  }
};

const getItem = async id => {
  const response = await fetch(`${endpointURL}/${id}`);

  if (response.ok) {
    return await response.json();
  } else {
    throw getAjaxExeption(response.status);
  }
};

const deleteItem = async id => {
  const response = await fetch(`${endpointURL}/${id}`, {
    method: 'DELETE'
  });

  return response.ok;
};

const addItem = async itemData => {
  const response = await fetch(endpointURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(itemData)
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw getAjaxExeption(response.status);
  }
};

const editItem = async item => {
  const response = await fetch(`${endpointURL}/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw getAjaxExeption(response.status);
  }
};

export {
  getItems,
  getItem,
  deleteItem,
  addItem,
  editItem
};
