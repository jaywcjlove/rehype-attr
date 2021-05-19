/// <reference types="jest" />

const unified = require("unified");
const rehype = require('rehype')
const stringify = require('rehype-stringify')
const rehypeRaw = require('rehype-raw')
const remark2rehype = require('remark-rehype')
const remarkParse = require('remark-parse')
const gfm = require('remark-gfm')
const rehypeAttrs = require('../lib')

const mrkStr = "<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log('')\n```"

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
      title: 'options="attr" - Code',
      markdown: '<!--rehype:title=Rehype Attrs-->\n```js\nconsole.log("")\n```',
      expected: '<!--rehype:title=Rehype Attrs-->\n<pre data-type="rehyp"><code class="language-js" title="Rehype Attrs">console.log("")\n</code></pre>',
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

