# Injection

[![NPM version][npm-img]][npm]
[![Build Status][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]
[![XO code style][xo-img]][xo]


[npm-img]:         https://img.shields.io/npm/v/@tadashi/injection.svg
[npm]:             https://www.npmjs.com/package/@tadashi/injection
[ci-img]:          https://travis-ci.org/lagden/injection.svg
[ci]:              https://travis-ci.org/lagden/injection
[coveralls-img]:   https://coveralls.io/repos/github/lagden/injection/badge.svg?branch=master
[coveralls]:       https://coveralls.io/github/lagden/injection?branch=master
[xo-img]:          https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:              https://github.com/sindresorhus/xo


Inject data into file


## Install

```
$ npm i -S @tadashi/injection
```


## Sample

This is the file that will be inject: `script.js`  
```js
const a = 'Horray';
alert(a);
```

This is the source file with the markup showing where is the place will be injected: `input.html`  
```html
<body>
  <script>/* inject: ./script.js */</script>
</body>
```

Making injection specifying the output file  
```js
const injection = require('@tadashi/injection');

(async () => {
  await injection('./input.html', './output.html', '\/\\*\\sinject:\\s([\\w./]+)\\s\\*\\/')
})()
```

Result: `output.html`  
```html
<body><script>const a = 'Horray';alert(a);</script></body>
```


### API

#### injection(input[, output][, pattern])

Name        | Type                 | Required    | Default                             | Description
----------- | -------------------- | :---------: | :---------------------------------: | ------------
input       | string               | yes         | -                                   | Source file
output      | string               | no          | ./out                               | Result file
pattern     | string               | no          | `<!--\\sinject:\\s([\\w./]+)\\s-->` | RegExp pattern


## License

MIT © [Thiago Lagden](https://github.com/lagden)
