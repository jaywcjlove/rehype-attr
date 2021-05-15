rehype-attr
---

[![NPM version](https://img.shields.io/npm/v/rehype-attr.svg?style=flat)](https://npmjs.org/package/rehype-attr)
[![Build](https://github.com/jaywcjlove/rehype-attr/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/rehype-attr/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/jaywcjlove/rehype-attr/badge.svg?branch=main)](https://coveralls.io/github/jaywcjlove/rehype-attr?branch=main)

New syntax to add attributes to Markdown. `rehype-attr` like [`remark-attr`](https://github.com/arobase-che/remark-attr)

## Default Syntax

### `Code`

```markdown
<!--rehype:title=Rehype Attrs-->
\```js
console.log('')
\```
```

### `Links`

```markdown
[github](https://github.com)<!--rehype:rel=external-->
```

> Output:
> ```html
> <p>
>   <a href="https://github.com" rel="external">github</a>
>   <!--rehype:rel=external-->
> </p>
> ```

### `Header`

```markdown
This is a title
====
<!--rehype:style=color:pink;-->
```

> Output:
> ```html
> <h1 style="color:pink;">This is a title</h1>
> ```

```markdown
# This is a title
<!--rehype:style=color:pink;-->
```

> Output:
> ```html
> <h1 style="color:pink;">This is a title</h1>
> ```

### `Strong`

```markdown
This is a **Unicorn**<!--rehype:style=color: grey-->
```

> Output:
> ```html
> <p>This is a <strong style="color: grey">Unicorn</strong> <!--rehype:style=color: grey--></p>
> ```

### `Emphasis`

```markdown
Npm stand for *node* <!--rehype:style=color: red--> packet manager.
```

> Output:
> 
> ```html
> <p>This is a <strong style="color: grey">Unicorn</strong> <!--rehype:style=color: grey--></p>
> ```

### `Inlne Code`

```markdown
This is the `content`<!--rehype:style=color:pink;-->
```

> Output:
> 
> ```html
> <p>This is the <code style="color:pink;">content</code><!--rehype:style=color:pink;--></p>
> ```

### `List`

```markdown
- list
<!--rehype:style=width:100px;-->
```

> Output:
> 
> ```html
> <ul style="width:100px;">
>   <li>list</li>
> </ul>
> <!--rehype:style=width:100px;-->
> ```

## Usage

```bash
npm i rehype-attr
yarn add rehype-attr
```

```js
const unified = require("unified");
const stringify = require('rehype-stringify')
const rehypeRaw = require('rehype-raw')
const remarkParse = require('remark-parse')
const remark2rehype = require('remark-rehype')
const rehypeAttrs = require('rehype-attr')

const mrkStr = `[github](https://github.com)<!--rehype:rel=external-->`
const htmlStr = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeAttrs, { properties: 'attr' })
  .use(stringify)
  .processSync(mrkStr)
  .toString()
```

Output: 

```html
<p>
  <a href="https://github.com" rel="external">github</a>
  <!--rehype:rel=external-->
</p>
```

## Options

#### `properties`

> Default Value: `data`  
> Value: `data`, `string`, `attr`

## Related

- [`rehypejs`](https://github.com/rehypejs/rehype) HTML processor powered by plugins part of the @unifiedjs collective
- [`remark-parse`](https://www.npmjs.com/package/remark-parse) remark plugin to parse Markdown
- [`remark-rehype`](https://www.npmjs.com/package/remark-rehype) remark plugin to transform to rehype
- [`rehype-raw`](https://www.npmjs.com/package/rehype-raw) rehype plugin to reparse the tree (and raw nodes)
- [`rehype-stringify`](https://www.npmjs.com/package/rehype-stringify) rehype plugin to serialize HTML

## License

MIT © [Kenny Wong](https://github.com/jaywcjlove)