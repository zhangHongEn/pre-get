// function onError (root, current, path) {}
const proxymise = (target, { onError = console.error, pathStack = [{ path: '$proxymise__root', error: new Error('proxy-promise记录stack') }], root = null } = {}) => {
  target.__proxy__additional = { onError, pathStack, root: root || target };
  if (typeof target === 'object') {
    const proxy = () => target;
    proxy.__proxy__ = true;
    return new Proxy(proxy, handler);
  }
  return typeof target === 'function' ? new Proxy(target, handler) : target;
};

const handler = {
  getPrototypeOf() {
    return Promise.prototype;
  },
  construct(target, argumentsList) {
    if (target.__proxy__) target = target();
    const additional = target.__proxy__additional;
    recordStack(additional, 'new()');
    return proxymise(Reflect.construct(target, argumentsList), additional);
  },

  get(target, property, receiver) {
    if (target.__proxy__) target = target();
    const additional = target.__proxy__additional;
    recordStack(additional, property);
    if (property !== 'then' && property !== 'catch' && property !== 'finally' && typeof target.then === 'function') {
      return proxymise(target.then(value => run(() => get(value, property, receiver), value, additional)), additional);
    }
    return proxymise(get(target, property, receiver), additional);
  },

  apply(target, thisArg, argumentsList) {
    if (target.__proxy__) target = target();
    const additional = target.__proxy__additional;
    recordStack(additional, '()');
    if (typeof target.then === 'function') {
      return proxymise(target.then(value => run(() => Reflect.apply(value, thisArg, argumentsList), value, additional)), additional);
    }
    return proxymise(Reflect.apply(target, thisArg, argumentsList), additional);
  }
};
function recordStack(additional, key) {
  const lastPathStack = additional.pathStack[additional.pathStack.length - 1];
  additional.pathStack.push({
    path: `${lastPathStack.path}.${key}`,
    error: new Error('proxy-promise记录stack'),
  });
}
const get = (target, property, receiver) => {
  const value = typeof target === 'object' ? Reflect.get(target, property, receiver) : target[property];
  if (typeof value === 'function' && typeof value.bind === 'function') {
    return Object.assign(value.bind(target), value);
  }
  return value;
};
function run(fn, current, additional) {
  try {
    return fn();
  } catch (e) {
    const lastPathStack = additional.pathStack[additional.pathStack.length - 1];
    additional.onError({
      $proxymise__root: additional.root,
      pathStack: additional.pathStack,
      errorObj: current,
      errorKey: lastPathStack.path.split('.').pop(),
      error: lastPathStack.error,
      path: lastPathStack.path
    });
    console.error(`proxy-promise debug：\n${e.message}`);
    console.error(lastPathStack.error.stack.toString().split('\n').slice(3).join('\n'));
    throw e;
  }
}
module.exports = proxymise