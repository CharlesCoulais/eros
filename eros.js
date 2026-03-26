import namedColors from "./namedColors.js";


function camelCase(str) {
  return str.replace(/\-(.)/, (match, capture) => capture.toUpperCase());
}

class Style {
  #properties;

  get properties() {
    return this.#properties;
  }

  constructor(properties = {}) {
    this.#properties = properties;
  }

  toString() {
    return Object.entries(this.#properties).map(entry => entry.join(': ')).join('; ') + ';';
  }

  getProxiedInstance(newPropertyObj = {}) {
    return createStyleProxy(new Style({ ...this.properties, ...newPropertyObj }));
  }

  execDynamic(propName) {
    const { regExp, method } = Style.#dynamicShortcuts.find(({ regExp }) => regExp.test(propName));
    const [match, ...captures] = Array.from(propName.match(regExp) || []);
    return this[method].call(this, ...captures);
  }


  static #dynamicShortcuts = [];

  static createPropMethod(propName) {
    const methodName = camelCase(propName);

    Object.defineProperty(Style.prototype, methodName, {
      value: function(propValue) {
        return this.getProxiedInstance({ [propName]: propValue });
      }
    });
  }

  static createShortcut(propertyName, shortcutValues, transformFn) {
    shortcutValues.forEach(value => {
      const shortcut = camelCase(value);

      Object.defineProperty(Style.prototype, shortcut, {
        get() {
          const newValue = transformFn?.(this.properties[propertyName] || '', value) || value;  
          return this.getProxiedInstance({ [propertyName]: newValue });
        }
      });
    });
  }

  
  static createDynamicShortcut(regExp, method) {
    this.#dynamicShortcuts.push({
      regExp,
      method,
    });
  }

  static matchDynamic(propName) {
    return this.#dynamicShortcuts.some(({ regExp }) => regExp.test(propName));
  }
}


// Methods
{
  Style.createPropMethod('color');
}

// Shortcuts
{
  // font-weight
  Style.createShortcut(
    'font-weight',
    ['bold', 'light', 'bolder', 'lighter']
  );

  // font-style
  Style.createShortcut(
    'font-style',
    ['italic', 'oblique']
  );

  // text-decoration-line
  Style.createShortcut(
    'text-decoration-line',
    ['underline', 'overline', 'line-through'],
    (currentValue, value) => {
      if (currentValue.includes(value)) return currentValue;
      if (currentValue) return `${currentValue} ${value}`;
      return value;
    },
  );

  // text-decoration-style
  Style.createShortcut(
    'text-decoration-style',
    ['solid', 'double', 'dotted', 'dashed', 'wavy'],
  );

  // color
  Style.createShortcut(
    'color',
    namedColors,
  );
}

// Dynamic shortcuts
{
  Style.createDynamicShortcut(/^(\#(?:[0-a-f9]{3}){1,2})$/i, 'color');
}

function createStyleProxy(style) {
  return new Proxy(style, {
    get(target, propName, proxy) {
      if (Style.matchDynamic(propName)) {
        return target.execDynamic(propName);
      }
      if (typeof target[propName] === 'function') {
        return (...args) => target[propName](...args);
      }
      return target[propName];
    }
  });
}


export default new Style().getProxiedInstance();
