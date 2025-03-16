import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {

  static pageSize = 10;

  offsetStart = 0;
  offsetEnd = 30;
  isFetching = false;

  constructor(headersConfig, {
    data = [],
    isSortLocally = false,
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    url
  } = {}) {
    super(headersConfig, {data, sorted, isSortLocally});

    this.url = url;
    this.isSortLocally = isSortLocally;
  }
  async handleWindowScroll() {
    const shouldFetch = window.scrollY + window.innerHeight >= document.body.clientHeight - 200;
    if (shouldFetch) {
      this.offsetStart += SortableTable.pageSize;
      this.offsetEnd += SortableTable.pageSize;
      await this.render();
    }
  }

  fetchData() {

    if (this.isFetching) {
      return;
    }

    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.set('_embed', 'subcategory.category');
    url.searchParams.set('_sort', this.sorted.id);
    url.searchParams.set('_order', this.sorted.order);
    url.searchParams.set('_start', this.offsetStart);
    url.searchParams.set('_end', this.offsetEnd);

    this.subElements.loading.style.display = 'block';

    this.isFetching = true;

    return fetchJson(url)
      .then((data) => {
        this.data = [...this.data, ...data];
        this.update();
      })
      .catch((error) => {
        console.log('Fetch error', error);
      })
      .finally(() => {
        this.subElements.loading.style.display = 'none';
        this.isFetching = false;
      });

  }

  async render() {
    await this.fetchData();
  }

  async sortOnServer(sortField, sortOrder) {

    super.sortOnServer(sortField, sortOrder);

    this.sorted.id = sortField;
    this.sorted.order = sortOrder;

    this.data = [];

    this.offsetStart = 0;
    this.offsetEnd = 30;

    await this.render();
  }

  createListeners() {
    super.createListeners();

    this.handleWindowScroll = this.handleWindowScroll.bind(this);

    window.addEventListener('scroll', this.handleWindowScroll);
  }

  destroyListeners() {
    super.destroyListeners();
    window.removeEventListener('scroll', this.handleWindowScroll);
  }
}
