rehype-attr
---

[![NPM version](https://img.shields.io/npm/v/rehype-attr.svg?style=flat)](https://npmjs.org/package/rehype-attr)
[![Build](https://github.com/jaywcjlove/rehype-attr/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/rehype-attr/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/jaywcjlove/rehype-attr/badge.svg?branch=main)](https://coveralls.io/github/jaywcjlove/rehype-attr?branch=main)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/rehype-attr)](https://bundlephobia.com/result?p=rehype-attr)

New syntax to add attributes to Markdown. `rehype-attr` like [`remark-attr`](https://github.com/arobase-che/remark-attr)

## Default Syntax

### `Links`

###### `HTML Example`

```html
<a href="https://github.com">github</a><!--rehype:rel=external&style=color:pink;&data-name=kenny-->
```

> Output: 
> ```html
> <a href="https://github.com" rel="external" style="color:pink;" data-name="kenny">github</a>
> ```

<details>
<summary>Example Code</summary>

```js
const rehype = require('rehype')
const rehypeAttrs = require('rehype-attr')

const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeAttrs, { properties: 'attr' })
  .processSync(`<a href="https://github.com">github</a><!--rehype:rel=external-->`)
  .toString()
```

</details>

###### `Markdown Example`

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


<details>
<summary>Example Code</summary>

```js
const unified = require("unified");
const stringify = require('rehype-stringify')
const rehypeRaw = require('rehype-raw')
const remark2rehype = require('remark-rehype')
const remarkParse = require('remark-parse')
const rehypeAttrs = require('rehype-attr')

const htmlStr = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeAttrs, { properties: 'attr' })
  .use(stringify)
  .processSync(`[github](https://github.com)<!--rehype:rel=external-->`)
  .toString()
```

</details>

<br />

### `Header`

###### `HTML Example`

```html
<h1>This is a title</h1><!--rehype:style=color:pink;-->
```

> Output: 
> ```html
> <h1 style="color:pink;">This is a title</h1>
> ```

<details>
<summary>Example Code</summary>

```js
const rehype = require('rehype')
const rehypeAttrs = require('rehype-attr')

const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeAttrs, { properties: 'attr' })
  .processSync(`<h1>This is a title</h1><!--rehype:style=color:pink;-->`)
  .toString()
```

</details>

###### `Markdown Example`

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

###### `HTML Example`

```html
This is a <strong>Unicorn</strong><!--rehype:style=color: grey-->
```

> Output: 
> ```html
> This is a <strong style="color: grey">Unicorn</strong>
> ```

###### `Markdown Example`

```markdown
This is a **Unicorn**<!--rehype:style=color: grey-->
```

> Output:
> ```html
> <p>This is a <strong style="color: grey">Unicorn</strong> <!--rehype:style=color: grey--></p>
> ```

### `Emphasis`

###### `HTML Example`

```html
Npm stand for <em>node</em><!--rehype:style=color: red--> packet manager.
```

> Output: 
> ```html
> Npm stand for <em style="color: red">node</em> packet manager.
> ```

###### `Markdown Example`

```markdown
Npm stand for *node* <!--rehype:style=color: red--> packet manager.
```

> Output:
> 
> ```html
> <p>Npm stand for <em style="color: red">node</em><!--rehype:style=color: red--> packet manager.</p>
> ```

### `Code`

```markdown
<!--rehype:title=Rehype Attrs&abc=1&hello=2-->
\```js
console.log('')
\```
```

> Output:
> 
> ```html
> <pre data-type="rehyp">
>   <code class="language-js" data-config="[object Object]">
>     console.log('')
>   </code>
> </pre>
> ```

### `Inlne Code`

###### `HTML Example`

```html
This is the <code>content</code><!--rehype:style=color:pink;-->
```

> Output: 
> ```html
> This is the <code style="color:pink;">content</code>
> ```

###### `Markdown Example`

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

###### `HTML Example`

```js
const rehype = require('rehype')
const rehypeAttrs = require('rehype-attr')

const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeAttrs, { properties: 'attr' })
  .processSync(`<a href="https://github.com">github</a><!--rehype:rel=external-->`)
  .toString()
```

Output: 
```html
<h1 style="color:pink;">This is a title</h1>
```

###### `Markdown Example`

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

- [`rehype-rewrite`](https://github.com/jaywcjlove/rehype-rewrite) Rewrite element with rehype.
- [`rehypejs`](https://github.com/rehypejs/rehype) HTML processor powered by plugins part of the @unifiedjs collective
- [`remark-parse`](https://www.npmjs.com/package/remark-parse) remark plugin to parse Markdown
- [`remark-rehype`](https://www.npmjs.com/package/remark-rehype) remark plugin to transform to rehype
- [`rehype-raw`](https://www.npmjs.com/package/rehype-raw) rehype plugin to reparse the tree (and raw nodes)
- [`rehype-stringify`](https://www.npmjs.com/package/rehype-stringify) rehype plugin to serialize HTML

## License

MIT © [Kenny Wong](https://github.com/jaywcjlove)
