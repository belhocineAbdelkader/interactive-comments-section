export default class Counter {
  value: number;
  minValue: number;
  maxValue: number;
  constructor(initialValue: number, minValue: number, maxValue: number) {
    this.value = initialValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  increment() {
    if (this.value < this.maxValue) {
      this.value++;
    }
  }

  decrement() {
    if (this.value > this.minValue && this.value > 0) {
      this.value--;
    }
  }

  getValue() {
    return this.value;
  }
}
