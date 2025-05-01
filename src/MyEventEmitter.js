'use strict';

class MyEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = { regular: [], prepended: [] };
    }

    this.events[event].regular.push(listener);
  }
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };

    this.on(event, onceWrapper);
  }
  off(event, listener) {
    if (!this.events[event]) {
      return;
    }

    const index1 = this.events[event].regular.indexOf(listener);
    const index2 = this.events[event].prepended.indexOf(listener);

    if (index1 !== -1) {
      this.events[event].regular.splice(index1, 1);
    }

    if (index2 !== -1) {
      this.events[event].prepended.splice(index2, 1);
    }
  }
  emit(event, ...args) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].prepended.forEach((lstnr) => lstnr(...args));
    this.events[event].regular.forEach((lstnr) => lstnr(...args));
  }
  prependListener(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].prepended.push(listener);
  }
  prependOnceListener(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };

    this.prependListener(event, onceWrapper);
  }
  removeAllListeners(event) {
    if (!event) {
      this.events = {};
    } else if (this.events[event]) {
      delete this.events[event];
    }
  }
  listenerCount(event) {
    return this.events[event]
      ? this.events[event].regular.length + this.events[event].prepended.length
      : 0;
  }
}

module.exports = MyEventEmitter;
