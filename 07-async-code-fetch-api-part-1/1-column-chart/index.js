import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

export default class ColumnChart extends ColumnChartV1 {

  constructor({
    url = '',
    range = {},
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = value => value
  } = {}) {
    super({data, label, formatHeading, link, value});

    const {from, to} = range;

    this.url = url;

    this.fetchData(from, to);
  }

  createURL(from, to) {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    return url;
  }

  fetchData(from, to) {
    return fetch(this.createURL(from, to).toString())
      .then((response) => { return response.json(); })
      .then((data) => {
        const values = Object.values(data);
        this.value = values.reduce((acc, part) => acc + part, 0);
        super.update(values);

        return data;
      })
      .catch((error) => { console.error(error); });
  }

  async update(from, to) {
    return await this.fetchData(from, to);
  }
}
