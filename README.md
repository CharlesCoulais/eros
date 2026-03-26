# Eros

Tiny lib to style easily Chrome console logs


## run POC
```
make run
```


## use

First, import Eros as module in your Javascript.
```
import style from './eros.js';
```

Then build a style using Eros'shortcuts. Shorcuts are made to be chained.
```
const erosStyle = style.bold.italic.underline['#FF8888']
```

Finally use the `%c` flag in your log string, and add your style as next param calling toString() method.
```
console.log('My name is %cEros', erosStyle.toString());
```


## List of currently available css shortcuts

- **font-weight**:
  - .bold
  - .light
  - .bolder
  - .lighter

- **font-style**:
  - .italic
  - .oblique

- **text-decoration-line**:
  - .underline
  - .overline
  - .line-through

- **text-decoration-style**:
  - .solid
  - .double
  - .dotted
  - .dashed
  - .wavy

- **color**:
  - named colors (_eg: .red, .purple, .gold, etc... see [this file](namedColors.js) to have a complete list_)
  - custom colors as dynamic shortcuts (_eg: ['#F00'], ['#800080'], ['#FFD700']_)
