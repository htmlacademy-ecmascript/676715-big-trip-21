import AbstractView from '../framework/view/abstract-view.js';

function createTripInfo () {
  /* html */
  return `
    <section class="trip-main__trip-info  trip-info">
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  get template() {
    return createTripInfo();
  }
}
