# pre-get

[中文文档](doc/chinese)

fork proxymise, The information related to the "proxymise" execution stack will be lost, and the pre get is tracked, which greatly improves the availability


![npm](./doc/pre-get-stack.png)
![npm](./doc/pre-get-stack2.png)
In addition, pre-get also makes proxy proxy more in line with normal thinking
1. ``` javascript
    preget(xx) instanceof Promise // true 
    ;(await preget({a: 1})).a  // 1
    ```
2. ``` javascript
    preget(xx).finally()  // Proxymise omits the processing of finally, and preget can be used normally
    ```

[![npm](https://img.shields.io/npm/v/pre-get.svg)](https://www.npmjs.com/package/pre-get)

Chainable Promise Proxy.

Lightweight ES6 [Proxy] for [Promises] with no additional dependencies. pre-get allows for method
and property chaining without need for intermediate `then()` or `await` for cleaner and simpler code.

[Proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[Promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

## Use

```shell
npm i pre-get
```

```javascript
const preget = require('pre-get');

// Instead of thens
foo.then(value => value.bar())
  .then(value => value.baz())
  .then(value => value.qux)
  .then(value => console.log(value));

// Instead of awaits
const value1 = await foo;
const value2 = await value1.bar();
const value3 = await value2.baz();
const value4 = await value3.qux;
console.log(value4);

// Use pre-get
const value = await preget(foo).bar().baz().qux;
console.log(value);
```

## Practical Examples

- [Fetch and parse JSON](https://github.com/kozhevnikov/proxymise/blob/master/test/fetch.test.js)
- [Amazon DynamoDB get item](https://github.com/kozhevnikov/proxymise/blob/master/test/dynamodb.test.js)
- [Selenium WebDriverJS and Page Objects](https://github.com/kozhevnikov/proxymise/blob/master/test/selenium.test.js)

## Performance

Proxymised [benchmark] with 10000 iterations is practically as performant as the non-proxymised one.

[benchmark]: https://github.com/kozhevnikov/proxymise/blob/master/test/benchmark.js

```shell
node test/benchmark.js 
with proxymise: 3907.582ms
without proxymise: 3762.375ms
```
