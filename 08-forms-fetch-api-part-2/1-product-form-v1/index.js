import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const CATEGORIES_URL = `${BACKEND_URL}/api/rest/categories`;
const PRODUCT_URL = `${BACKEND_URL}/api/rest/products`;
const IMAGE_UPLOAD_URL = 'https://api.imgur.com/3/image';

export default class ProductForm {

  subElements = {};

  constructor (productId) {
    this.productId = productId;
  }

  selectSubElements() {
    return [...this.element.querySelectorAll('[data-element]')]
      .reduce((acc, part) => ({ ...acc, [part.dataset.element]: part }), {});
  }

  async fetchCategories() {
    try {
      const url = new URL(CATEGORIES_URL);
      url.searchParams.set('_sort', 'weight');
      url.searchParams.set('_refs', 'subcategory');
      return await fetchJson(url);
    }
    catch (error) {
      console.error(error);
    }
  }

  getDefaultProductData () {
    return {
      title: '',
      description: '',
      quantity: 1,
      subcategory: '',
      status: 1,
      price: 100,
      discount: 0,
      images: []
    };
  }

  async fetchProduct() {
    try {

      if (!this.productId) {
        return this.getDefaultProductData();
      }

      const url = new URL(PRODUCT_URL);
      url.searchParams.set('id', this.productId);
      const response = await fetchJson(url);

      return response[0];
    }
    catch (error) {
      console.error(error);
    }
  }

  async render() {
    this.categories = await this.fetchCategories();
    this.productData = await this.fetchProduct();
    this.element = this.createElement(this.getTemplate());
    this.subElements = this.selectSubElements();
    this.createListeners();

    return this.element;
  }

  getImagesContainerTemplate() {
    return `
      <div data-element="imageListContainer">
        ${this.getImagesListTemplate()}
        <button type="button" name="uploadImage" data-element="uploadButton" class="button-primary-outline">
          <span>Загрузить</span>
        </button>
      </div>
    `;
  }

  getImagesListTemplate() {
    return `<ul class="sortable-list">
        ${this.productData.images.map(image => `
            <li class="products-edit__imagelist-item sortable-list__item" style="">
            <span>
              <img src="icon-grab.svg" data-grab-handle alt="grab">
              <img class="sortable-table__cell-img" alt="Image" src="${this.getProcessedValue(image.url)}">
              <span>${this.getProcessedValue(image.source)}</span>
            </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle alt="delete">
            </button>
            </li>
          `).join('')}
      </ul>`;
  }

  getCategoryOptionsTemplate() {
    return this.categories
      .reduce((acc, category) => {
        const subcategories = category.subcategories.map(subcategory => {
          return {id: subcategory.id, title: `${category.title} > ${subcategory.title}`};
        });
        acc.push(...subcategories);

        return acc;
      }, [])
      .map(item => {
        return `
            <option value="${this.getProcessedValue(item.id)}" ${this.productData.subcategory === item.id ? 'selected' : ''}>
              ${this.getProcessedValue(item.title)}
            </option>
      `;
      });
  }

  getProcessedValue(value) {
    return escapeHtml(String(value));
  }

  getCategorySelectTemplate() {
    return `
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory" data-element="subcategory">
              ${this.getCategoryOptionsTemplate()}
            </select>
          </div>
          `;
  }

  getPriceDiscountQuantityStatus() {
    return `
    <div class="form-group form-group__half_left form-group__two-col">
      <fieldset>
        <label class="form-label">Цена ($)</label>
        <input id="price" required="" type="number" name="price" class="form-control" placeholder="100"
         value = ${this.getProcessedValue(this.productData.price)} data-element="price">
      </fieldset>
      <fieldset>
        <label class="form-label">Скидка ($)</label>
        <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0"
         value = ${this.getProcessedValue(this.productData.discount)} data-element="discount">
      </fieldset>
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Количество</label>
      <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1"
      value = ${this.getProcessedValue(this.productData.quantity)} data-element="quantity">
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Статус</label>
      <select id="status" class="form-control" name="status" data-element="status">
        <option value="1" ${this.getProcessedValue(this.productData.status) === '1' ? 'selected' : ''}>Активен</option>
        <option value="0" ${this.getProcessedValue(this.productData.status) === '0' ? 'selected' : ''}>Неактивен</option>
      </select>
    </div>
  `;
  }

  getTemplate() {
    return `
      <div class="product-form">
         <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input value="${this.getProcessedValue(this.productData.title)}" id="title" data-element="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
         <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="" class="form-control" name="description" data-element="description"
         placeholder="Описание товара"
         >${this.getProcessedValue(this.productData.description)}</textarea>
      </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          ${this.getImagesContainerTemplate()}
          ${this.getCategorySelectTemplate()}
          ${this.getPriceDiscountQuantityStatus()}
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
          </form>
      </div>
    `;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  handleFormSubmit = async event => {
    event.preventDefault();
    await this.save();
  }

  async save() {
    try {
      await fetchJson(PRODUCT_URL, {
        method: this.productId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          Object.assign(Object.fromEntries(
            new FormData(this.subElements.productForm)
          ), {images: this.productData.images})
        ),
      });

      this.dispatchResponseEvent(this.productId ? 'updated' : 'saved');
    }
    catch (error) {
      console.error(error);
    }
  }

  dispatchResponseEvent(type) {
    this.element.dispatchEvent(new CustomEvent(`product-${type}`));
  }

  handleUploadButtonClick = () => {
    const inputFileElement = document.createElement('input');

    Object.assign(inputFileElement, {
      type: 'file',
      accept: 'image/*',
      style: 'display:none',
      onchange: () => {
        this.uploadImage(inputFileElement.files[0]);
      }
    });

    document.body.append(inputFileElement);

    inputFileElement.click();

    document.body.removeChild(inputFileElement);
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(IMAGE_UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData,
      });

      // получаю 429 Too Many Requests, в связи с этим делаю заглушку
      const result = await response.json();

      this.productData.images.push({
        url: 'url',
        source: 'source'
      });

      this.subElements.imageListContainer.innerHTML = this.getImagesListTemplate();
    } catch (error) {
      console.error(error);
    }
  }

  createListeners() {
    this.subElements.uploadButton.addEventListener('click', this.handleUploadButtonClick);
    this.subElements.productForm.addEventListener('submit', this.handleFormSubmit);
  }

  destroyListeners() {
    this.subElements.uploadButton.removeEventListener('click', this.handleUploadButtonClick);
    this.subElements.productForm.removeEventListener('submit', this.handleFormSubmit);
  }

  remove() {
    this.element.remove();
  }

  destroy () {
    this.destroyListeners();
    this.remove();
  }
}
