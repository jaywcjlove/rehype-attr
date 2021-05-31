/// <reference types="jest" />

const unified = require("unified");
const rehype = require('rehype')
const stringify = require('rehype-stringify')
const rehypeRaw = require('rehype-raw')
const remark2rehype = require('remark-rehype')
const remarkParse = require('remark-parse')
const gfm = require('remark-gfm')
const rehypeAttrs = require('../lib')
const utils = require('../lib/utils')
const visit = require('../lib/visit')

const mrkStr = "<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log('')\n```"

describe('rehype-attr function test case', () => {
  it('visit', async () => {
    const node = {
      "type": "root",
      "children": [
        {
          "type": "element",
          "tagName": "p",
          "properties": {},
          "children": [
            { "type": "text", "value": "This is a " },
            { "type": "element", "tagName": "del", "properties": {}, "children": [ { "type": "text", "value": "title" } ] },
            { "type": "comment", "value": "rehype:style=color:pink;" }
          ]
        }
      ],
      "data": { "quirksMode": false }
    }
    visit(node, 'element', (node, index, parent) => {
      expect(/(del|p)/.test(node.tagName)).toBeTruthy()
      expect(typeof node).toEqual('object')
      expect(typeof index).toEqual('number')
      expect(typeof parent).toEqual('object')
    })
    expect(visit(node)).toBeUndefined()
    expect(visit(node, 'element')).toBeUndefined()
    expect(visit(node, 'element', () => {})).toBeUndefined()
    expect(visit({ type: 'root' }, 'element', () => {})).toBeUndefined()
    expect(visit({ type: 'root', children: [ { type: 'element' }] }, 'element', () => {})).toBeUndefined()
    expect(visit()).toBeUndefined()
    expect(visit(undefined)).toBeUndefined()
    expect(visit(undefined, undefined)).toBeUndefined()
    expect(visit(undefined, undefined, undefined)).toBeUndefined()
  });
  it('getCommentObject', async () => {
    expect(utils.getCommentObject({})).toEqual({ });
    expect(utils.getCommentObject({ value: 'rehype:title=Rehype Attrs' })).toEqual({ title: 'Rehype Attrs' });
  });
  it('prevChild', async () => {
    expect(utils.prevChild(undefined, 0)).toBeUndefined()
    expect(utils.prevChild(undefined, -1)).toBeUndefined()
    expect(utils.prevChild([ { type: 'comment', value: 'rehype:title=Rehype Attrs' }, { type: 'text', value: '\n' } ], 1)).toEqual({ type: "comment", value: "rehype:title=Rehype Attrs" })
    expect(utils.prevChild([ { type: 'comment', value: 'rehype:title=Rehype Attrs' }, { type: 'text' } ], 1)).toEqual({ type: "comment", value: "rehype:title=Rehype Attrs" })
    expect(utils.prevChild([ { type: 'text', value: '\n' }, { type: 'comment', value: 'rehype:title=Rehype Attrs' } ], 2)).toEqual({ type: "comment", value: "rehype:title=Rehype Attrs" })
  });
  it('nextChild', async () => {
    expect(utils.nextChild(undefined, 0)).toBeUndefined()
    expect(utils.nextChild(undefined, -1)).toBeUndefined()
    expect(utils.nextChild([ { type: 'elment', value: 'rehype:title=Rehype Attrs' } ], 0)).toBeUndefined()
    expect(utils.nextChild([ { type: 'text' }, { type: 'comment', value: 'rehype:title=Rehype Attrs' } ], 0)).toEqual({ type: "comment", value: "rehype:title=Rehype Attrs" })
    expect(utils.nextChild([ { type: 'text', value: '\n' }, { type: 'comment', value: 'rehype:title=Rehype Attrs' } ], 0)).toEqual({ type: "comment", value: "rehype:title=Rehype Attrs" })
    expect(utils.nextChild([ { type: 'text', value: '\n' }, { type: 'text', value: '' }, { type: 'element', tagName: 'pre' } ], 0, 'pre')).toEqual({ type: 'element', tagName: 'pre' })
  });
  it('propertiesHandle', async () => {
    expect(utils.propertiesHandle({}, {})).toEqual({
      'data-config': {
        rehyp: true
      }
    });
    expect(utils.propertiesHandle(null, {})).toEqual({
      'data-config': {
        rehyp: true
      }
    });
    expect(utils.propertiesHandle(null, {}, 'string')).toEqual({
      'data-config': '{\"rehyp\":true}'
    });
    expect(utils.propertiesHandle(null, {}, 'string')).toEqual({
      'data-config': '{\"rehyp\":true}'
    });
    expect(utils.propertiesHandle(null, null, 'string')).toEqual({
      'data-config': '{\"rehyp\":true}'
    });
    expect(utils.propertiesHandle(null, null, 'attr')).toEqual({});
    expect(utils.propertiesHandle(null, { a: 1 }, 'attr')).toEqual({ a: 1 });
  });
})

describe('rehype-attr test case', () => {
  it('default options="data"', async () => {
    const expected = `<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" data-config="[object Object]">console.log('')\n</code></pre>`
    const htmlStr = unified()
      .use(remarkParse)
      .use(remark2rehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeAttrs)
      .use(stringify)
      .processSync(mrkStr)
      .toString()
      expect(htmlStr).toEqual(expected);
  });
  it('options="string"', async () => {
    const expected = `<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" data-config="{&#x22;title&#x22;:&#x22;Rehype Attrs&#x22;,&#x22;rehyp&#x22;:true}">console.log('')\n</code></pre>`
    const htmlStr = unified()
      .use(remarkParse)
      .use(remark2rehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeAttrs, { properties: 'string' })
      .use(stringify)
      .processSync(mrkStr)
      .toString()
      expect(htmlStr).toEqual(expected);
  });

  it('options="string" - Multiple value settings', async () => {
    const markdown = "<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log('')\n```\n\n```js\nconsole.log('')\n```\n<!--rehype:title=Rehype Attrs Sub-->\n```js\nconsole.log('')\n```\n"
    const expected = `<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" data-config="{&#x22;title&#x22;:&#x22;Rehype Attrs&#x22;,&#x22;rehyp&#x22;:true}">console.log('')\n</code></pre>\n<pre><code class="language-js">console.log('')\n</code></pre>\n<!--rehype:title=Rehype Attrs Sub-->\n<pre data-type="rehyp"><code class="language-js" data-config="{&#x22;title&#x22;:&#x22;Rehype Attrs Sub&#x22;,&#x22;rehyp&#x22;:true}">console.log('')\n</code></pre>`
    const htmlStr = unified()
      .use(remarkParse)
      .use(remark2rehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeAttrs, { properties: 'string' })
      .use(stringify)
      .processSync(markdown)
      .toString()
      expect(htmlStr).toEqual(expected);
  });

  [
    {
      title: 'options="attr" - Table',
      markdown: '| Property | Description |\n |---- |---- |\n | 1 | 2 |\n\n<!--rehype:border=1-->',
      expected: '<table border="1"><thead><tr><th>Property</th><th>Description</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>\n<!--rehype:border=1-->',
    }, {
      title: 'options="attr" - Table 2 `\\n\\n` ???',
      markdown: '| Property | Description |\n |---- |---- |\n | 1 | 2 |\n<!--rehype:border=1-->',
      expected: '<table><thead><tr><th>Property</th><th>Description</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td><!--rehype:border=1--></td><td></td></tr></tbody></table>',
    }
  ].forEach((data, idx) => {
    it(data.title, async () => {
      const htmlStr = unified()
        .use(remarkParse)
        .use(gfm)
        .use(remark2rehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeAttrs, { properties: 'attr' })
        .use(stringify)
        .processSync(data.markdown)
        .toString()
        expect(htmlStr.replace(/^\n+/, '')).toEqual(data.expected);
    });
  });

  [
    {
      title: 'options="attr" - not config 1',
      markdown: 'test\n<!--title=Rehype Attrs-->',
      expected: '<p>test</p>\n<!--title=Rehype Attrs-->',
    },
    {
      title: 'options="attr" - not config 2',
      markdown: 'test',
      expected: '<p>test</p>',
    },
    {
      title: 'options="attr" - not config 3',
      markdown: 'test\n<!---->',
      expected: '<p>test</p>\n<!---->',
    },
    {
      title: 'options="attr" - not config 4',
      markdown: 'test\n<!--rehype:-->',
      expected: '<p>test</p>\n<!--rehype:-->',
    },
    {
      title: 'options="attr" - not config 5',
      markdown: 'test\n<!--rehype-->',
      expected: '<p>test</p>\n<!--rehype-->',
    },
    {
      title: 'options="attr" - not config 6',
      markdown: 'test\n<!--rehype:a&-->',
      expected: '<p>test</p>\n<!--rehype:a&-->',
    },
    {
      title: 'options="attr" - Code - not config 7',
      markdown: '<!--rehype:-->\n```js\nconsole.log("")\n```',
      expected: '<!--rehype:-->\n<pre><code class="language-js">console.log("")\n</code></pre>',
    },
    {
      title: 'options="attr" - Code - not config 8',
      markdown: '<!--wrehype:a=1-->\n```js\nconsole.log("")\n```',
      expected: '<!--wrehype:a=1-->\n<pre><code class="language-js">console.log("")\n</code></pre>',
    },
    {
      title: 'options="attr" - not config 8',
      markdown: 'test\n<!--23rehype:a=1&-->',
      expected: '<p>test</p>\n<!--23rehype:a=1&-->',
    },
    {
      title: 'options="attr" - Code',
      markdown: '<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log("")\n```',
      expected: '<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" title="Rehype Attrs">console.log("")\n</code></pre>',
    },
    {
      title: 'options="attr" - Code - stting attr',
      markdown: '```js\nconsole.log("")\n```\n<!--rehype:title=Rehype Attrs-->',
      expected: '<pre title="Rehype Attrs"><code class="language-js">console.log("")\n</code></pre>\n<!--rehype:title=Rehype Attrs-->',
    },
    {
      title: 'options="attr" - Code - 1',
      markdown: 'test\n<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log("")\n```',
      expected: '<p>test</p>\n<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" title="Rehype Attrs">console.log("")\n</code></pre>',
    },
    {
      title: 'options="attr" - Code - 2',
      markdown: 'test\n<!--rehype:title=Hello World-->\n<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log("")\n```',
      expected: '<p title="Hello World">test</p>\n<!--rehype:title=Hello World-->\n<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" title="Rehype Attrs">console.log("")\n</code></pre>',
    },
    {
      title: 'options="attr" - Code - 3',
      markdown: 'test\n\n<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log("")\n```',
      expected: '<p>test</p>\n<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" title="Rehype Attrs">console.log("")\n</code></pre>',
    },
    {
      title: 'options="attr" - Emphasis <em>',
      markdown: 'Npm stand for *node*<!--rehype:style=color: red--> packet manager.',
      expected: '<p>Npm stand for <em style="color: red">node</em><!--rehype:style=color: red--> packet manager.</p>',
    },
    {
      title: 'options="attr" - Strong <strong>',
      markdown: 'This is a **Unicorn**<!--rehype:style=color: grey-->',
      expected: '<p>This is a <strong style="color: grey">Unicorn</strong><!--rehype:style=color: grey--></p>',
    },
    {
      title: 'options="attr" - Links <a>',
      markdown: '[github](https://github.com)<!--rehype:rel=external-->',
      expected: '<p><a href="https://github.com" rel="external">github</a><!--rehype:rel=external--></p>',
    },
    {
      title: 'options="attr" - Header <h1> `====`',
      markdown: 'This is a title\n====\n<!--rehype:style=color:pink;-->',
      expected: '<h1 style="color:pink;">This is a title</h1>\n<!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - Header <h2> `----`',
      markdown: 'This is a title\n----\n<!--rehype:style=color:pink;-->',
      expected: '<h2 style="color:pink;">This is a title</h2>\n<!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - Header <h1> `#`',
      markdown: '# This is a title\n<!--rehype:style=color:pink;-->',
      expected: '<h1 style="color:pink;">This is a title</h1>\n<!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - Header <h1> `#` - Multiple value settings',
      markdown: '# This is a title\n<!--rehype:style=color:pink;-->\n# This is a title\n<!--rehype:style=color:red;-->\n',
      expected: '<h1 style="color:pink;">This is a title</h1>\n<!--rehype:style=color:pink;-->\n<h1 style="color:red;">This is a title</h1>\n<!--rehype:style=color:red;-->',
    },
    {
      title: 'options="attr" - Header <h2> `##`',
      markdown: '## This is a title\n<!--rehype:style=color:pink;-->',
      expected: '<h2 style="color:pink;">This is a title</h2>\n<!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - Header <h3> `###`',
      markdown: '### This is a title\n<!--rehype:style=color:pink;-->',
      expected: '<h3 style="color:pink;">This is a title</h3>\n<!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - Header <h4> `####`',
      markdown: '#### This is a title\n<!--rehype:style=color:pink;-->',
      expected: '<h4 style="color:pink;">This is a title</h4>\n<!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - <p>',
      markdown: 'This is the content\n<!--rehype:style=color:pink;-->',
      expected: '<p style="color:pink;">This is the content</p>\n<!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - inlne code <code>',
      markdown: 'This is the `content`<!--rehype:style=color:pink;-->',
      expected: '<p>This is the <code style="color:pink;">content</code><!--rehype:style=color:pink;--></p>',
    },
    {
      title: 'options="attr" - <img> `![alt](img)`',
      markdown: '![alt](img)<!--rehype:style=width:100px;-->',
      expected: '<p><img src=\"img\" alt=\"alt\" style=\"width:100px;\"><!--rehype:style=width:100px;--></p>',
    },
    {
      title: 'options="attr" - <ul> `- list`',
      markdown: '- list \n<!--rehype:style=width:100px;-->',
      expected: '<ul style="width:100px;">\n<li>list</li>\n</ul>\n<!--rehype:style=width:100px;-->',
    },

    {
      title: 'options="attr" - test parameter value type ',
      markdown: '#### This is a title\n<!--rehype:data-bool=true&data-bool2=false&data-num=213&data-num1=0213&data-str=2s13-->',
      expected: '<h4 data-bool data-num="213" data-num1="0213" data-str="2s13">This is a title</h4>\n<!--rehype:data-bool=true&data-bool2=false&data-num=213&data-num1=0213&data-str=2s13-->',
    },
    {
      title: 'options="attr" - test identifier',
      markdown: '#### This is a title\n<!--wwww:data-bool=true',
      expected: '<h4>This is a title</h4>\n',
    },
  ].forEach((data, idx) => {
    it(data.title, async () => {
      const htmlStr = unified()
        .use(remarkParse)
        .use(remark2rehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeAttrs, { properties: 'attr' })
        .use(stringify)
        .processSync(data.markdown)
        .toString()
        expect(htmlStr).toEqual(data.expected);
    });
  });

  [
    {
      title: 'options="attr" - Delete <del> `~~Text~~`',
      markdown: 'This is a ~~title~~<!--rehype:style=color:pink;-->',
      expected: '<p>This is a <del style="color:pink;">title</del><!--rehype:style=color:pink;--></p>',
    }
  ].forEach((data, idx) => {
    it(data.title, async () => {
      const htmlStr = unified()
        .use(remarkParse)
        .use(gfm)
        .use(remark2rehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeAttrs, { properties: 'attr' })
        .use(stringify)
        .processSync(data.markdown)
        .toString()
        expect(htmlStr).toEqual(data.expected);
    });
  });


  [
    {
      title: 'options="attr" - <p>',
      markdown: '<p>text</p><!--rehype:id=text-->',
      expected: '<p id="text">text</p><!--rehype:id=text-->',
    },
    {
      title: 'options="attr" - <b>',
      markdown: '<b>Title</b><!--rehype:style=color:pink;&data-name=kenny-->',
      expected: '<b style="color:pink;" data-name="kenny">Title</b><!--rehype:style=color:pink;&data-name=kenny-->',
    },
    {
      title: 'options="attr" - <i>',
      markdown: '<i>Title</i><!--rehype:style=color:pink;-->',
      expected: '<i style="color:pink;">Title</i><!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - <strong>',
      markdown: 'This is a <strong>Unicorn</strong><!--rehype:style=color: grey-->',
      expected: 'This is a <strong style="color: grey">Unicorn</strong><!--rehype:style=color: grey-->',
    },
    {
      title: 'options="attr" - <code>',
      markdown: 'This is the <code>content</code><!--rehype:style=color:pink;-->',
      expected: 'This is the <code style="color:pink;">content</code><!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - <blockquote>',
      markdown: '<blockquote>content</blockquote><!--rehype:style=color:pink;-->',
      expected: '<blockquote style="color:pink;">content</blockquote><!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - <ol>',
      markdown: '<ol><li>Red</li><li>Green</li></ol><!--rehype:style=color:pink;-->',
      expected: '<ol style="color:pink;"><li>Red</li><li>Green</li></ol><!--rehype:style=color:pink;-->',
    },
    {
      title: 'options="attr" - <a>',
      markdown: '<a href="https://github.com">github</a><!--rehype:rel=external&style=color:pink;&data-name=kenny-->',
      expected: '<a href="https://github.com" rel="external" style="color:pink;" data-name="kenny">github</a><!--rehype:rel=external&style=color:pink;&data-name=kenny-->',
    }
  ].forEach((data, idx) => {
    it(data.title, async () => {
      const htmlStr = rehype()
        .data('settings', { fragment: true })
        .use(rehypeAttrs, { properties: 'attr' })
        .processSync(data.markdown)
        .toString()
        expect(htmlStr).toEqual(data.expected);
    });
  })

});

