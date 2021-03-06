/* 
*  实现promise，模拟
*  http://www.zhufengpeixun.cn/plan/html/2.Promise.html#t95.%20promise%20%E5%81%9A%E4%B8%BA%E5%87%BD%E6%95%B0%E7%9A%84%E8%BF%94%E5%9B%9E%E5%80%BC 
*  基于Promise/A+规范实现 Promise https://promisesaplus.com/
*/
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(fn) {
    this.status = PENDING;
    this.value = "";
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject.bind(this, e);
    }
  }
  resolve(value) {
    if (value instanceof Promise) {
      return value.then(this.resolve.bind(this), this.reject.bind(this));
    }
    setTimeout(() => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.map(fn => fn(this.value));
      }
    });
  }
  reject(err) {
    setTimeout(() => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.value = err;
        this.onRejectedCallbacks.map(fn => fn(this.value));
      }
    });
  }
  then(onFulfilled, onRejected) {
    let that = this;
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };

    let promise2;

    if (this.status === FULFILLED) {
      promise2 = new MyPromise(function(resolve, reject) {
        setTimeout(() => {
          try {
            let x = onFulfilled(that.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
    if (this.status === REJECTED) {
      return new MyPromise(function(resolve, reject) {
        setTimeout(() => {
          try {
            let x = onRejected(that.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
    if (this.status === PENDING) {
      promise2 = new MyPromise(function(resolve, reject) {
        that.onResolvedCallbacks.push(function(value) {
          try {
            let x = onFulfilled(value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        that.onRejectedCallbacks.push(function(value) {
          try {
            let x = onRejected(value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    return promise2;
  }

  catch(obRejected) {
    return this.then(null, onRejected);
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  let then, called;

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          function(y) {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          function(r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

module.exports = MyPromise;
