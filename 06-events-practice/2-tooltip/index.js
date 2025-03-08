class Tooltip {

  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize () {
    this.createListeners();
  }

  render(content) {
    const element = document.createElement('div');
    element.innerHTML = `<div class="tooltip">${content}</div>`;
    this.element = element.firstElementChild;

    document.querySelector('body').append(this.element);
  }

  handleDocumentPointerOver = (event) => {

    const tooltipData = event.target.dataset.tooltip;

    if (tooltipData) {
      this.render(tooltipData);
    }
  }

  handleDocumentPointerOut = (event) => {
    if (event.target.dataset.tooltip) {
      this.remove();
    }
  }

  handleDocumentMouseMove = (event) => {
    if (event.target.dataset.tooltip) {
      this.element.style.top = `${event.clientY + 10}px`;
      this.element.style.left = `${event.clientX + 10}px`;
    }
  }

  createListeners() {
    document.addEventListener('pointerover', this.handleDocumentPointerOver);
    document.addEventListener('pointerout', this.handleDocumentPointerOut);
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.handleDocumentPointerOver);
    document.removeEventListener('pointerout', this.handleDocumentPointerOut);
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
