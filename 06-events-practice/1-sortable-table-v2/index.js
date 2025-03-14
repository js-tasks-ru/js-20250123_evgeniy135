import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTableV1 {

  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true,
  } = {}) {
    super(headersConfig, data);

    this.isSortLocally = isSortLocally;
    this.arrowElement = this.createArrowElement(this.createArrowTemplate());
    this.createListeners();
    this.sorted = sorted;
    this.sort(sorted.id, sorted.order);

    const defaultHeader = this.subElements.header.querySelector(`[data-id="${sorted.id}"]`);
    this.setSortingHeader(defaultHeader, sorted.order);
  }

  setSortingHeader(headerElement, sortOrder) {
    headerElement.dataset.order = sortOrder;
    headerElement.append(this.arrowElement);
  }

  createArrowElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createArrowTemplate() {
    return `
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow" > </span>
          </span>`;
  }

  handleHeaderCellClick = (event) => {
    const cellElement = event.target.closest('.sortable-table__cell');

    if (!cellElement) {
      return;
    }

    if (cellElement.dataset.sortable === 'false') {
      return;
    }

    const sortField = cellElement.dataset.id;
    const sortOrder = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';

    this.setSortingHeader(cellElement, sortOrder);

    this.sort(sortField, sortOrder);
  }

  sort(sortField, sortOrder) {

    this.sorted.id = sortField;
    this.sorted.order = sortOrder;

    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer(sortField, sortOrder);
    }
  }

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
  }

  sortOnServer(field, order) {

  }

  createListeners() {
    this.handleHeaderCellClick = this.handleHeaderCellClick.bind(this);

    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
