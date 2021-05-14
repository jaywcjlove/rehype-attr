/// <reference types="jest" />

const unified = require("unified");
const stringify = require('rehype-stringify')
const rehypeRaw = require('rehype-raw')
const remarkParse = require('remark-parse')
const remark2rehype = require('remark-rehype')
const rehypeAttrs = require('../lib')

const mrkStr = "<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log('')\n```"

describe('rehype-attr test case', () => {
  it('default options="data"', async () => {
    const expected = `<!--rehype:title=Rehype Attrs-->\n<pre><code class="language-js" data-config="[object Object]">console.log('')\n</code></pre>`
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
    const expected = `<!--rehype:title=Rehype Attrs-->\n<pre><code class="language-js" data-config="{&#x22;title&#x22;:&#x22;Rehype Attrs&#x22;,&#x22;rehyp&#x22;:true}">console.log('')\n</code></pre>`
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
  
  [
    {
      title: 'options="attr"',
      markdown: '<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log("")\n```',
      expected: '<!--rehype:title=Rehype Attrs-->\n<pre><code class="language-js" title="Rehype Attrs">console.log("")\n</code></pre>',
    },
    {
      title: 'options="attr" - Emphasis <strong>',
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
    }
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
  })

});
