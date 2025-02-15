import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTableV1 {
  constructor(
    headersConfig,
    {
      data = [],
      sorted = {
        id: 'name',
        order: 'asc' }
    } = {},
    isSortLocally = true
  ) {
    super(headersConfig, data);

    this.isSortLocally = isSortLocally;
    this.arrowElement = this.createArrowElement(this.createArrowTemplate());

    this.createListeners();
    this.setDefaultSort(sorted.id, sorted.order);
  }

  setSortingHeader(headerElement, sortOrder) {
    headerElement.dataset.order = sortOrder;
    headerElement.append(this.arrowElement);
  }

  setDefaultSort(sortField, sortOrder) {
    const defaultHeader = this.subElements.header.querySelector(`[data-id="${sortField}"]`);

    if (defaultHeader) {
      this.setSortingHeader(defaultHeader, sortOrder);
      this.sort(sortField, sortOrder);
    }
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

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell');

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
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
  }

  sortOnServer() {

  }

  createListeners() {
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
