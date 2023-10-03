export default class OffersModel {
  #service = null;
  #offers = [];

  constructor(service) {
    this.#service = service;
    // this.#offers = this.#service.getOffers();
  }

  async init() {
    // this.#destinations = await this.#service.destinations;
    this.#offers = await this.#service.offers;
    // console.log(`this.offers: ${this.#offers}`);
    return this.#offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type).offers;
  }
}
