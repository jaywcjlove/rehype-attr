import { Content } from 'ts-mdast'
import { RehypeAttrsOptions } from './'

export const getURLParameters = (url: string): Record<string, string | number | boolean> =>
(url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
  (a: Record<string, string | number>, v: string) => (
    // eslint-disable-next-line no-sequences
    (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
  ),
  {},
);

type CommentData = {
  type: 'comment',
  value?: string,
}

export const prevChild = (data: Content[] = [], index: number): CommentData | undefined => {
  let i = index;
  while (i > -1) {
    i--;
    if ((data[i].value && (data[i].value as string).replace(/(\n|\s)/g, '') !== '') || data[i].type !== 'text') {
      if (!/rehype:/.test(data[i].value as string) && (data[i].type as string) !== 'comment') return;
      return data[i] as unknown as CommentData;
    }
  }
  return {} as CommentData;
}

export const nextChild = (data: Content[] = [], index: number, tagName?: string): CommentData | undefined => {
  let i = index;
  while (i < data.length) {
    i++;
    if (tagName) {
      if (data[i] && data[i].value && (data[i].value as string).replace(/(\n|\s)/g, '') !== '' || data[i] && (data[i].type as string) === 'element') {
        if (data[i].tagName !== tagName) return;
        if (data[i].tagName === tagName) return data[i] as unknown as CommentData;
      }
    } else {
      if (!data[i] || (data[i].type !== 'text' && (data[i].type as string) !== 'comment') || (data[i].type == 'text' && (data[i].value as string).replace(/(\n|\s)/g, '') !== '')) return
      if ((data[i].type as string) === 'comment') {
        if (!/rehype:/.test(data[i].value as string)) return;
        const nextNode = nextChild(data, i, 'pre')
        if (nextNode) return;
        return data[i] as unknown as CommentData;
      }
    }
  }
  return
}

/**
 * 获取代码注视的位置
 * @param data 数据
 * @param index 当前数据所在的位置
 * @returns 返回 当前参数数据 Object，`{}`
 */
export const getCommentObject = ({ value = '' }: CommentData): Record<string, string | number | boolean | null> => {
  const param = getURLParameters(value.replace(/^rehype:/, ''));
  Object.keys(param).forEach((keyName: string) => {
    if (param[keyName] === 'true') {
      param[keyName] = true;
    }
    if (param[keyName] === 'false') {
      param[keyName] = false;
    }
    if (typeof param[keyName] === 'string' && !/^0/.test(param[keyName] as string) && !isNaN(+param[keyName])) {
      param[keyName] = +param[keyName];
    }
  })
  return param;
}

export const propertiesHandle = (defaultAttrs: Record<string, string> = {}, attrs: Record<string, string | number | boolean | null>, type: RehypeAttrsOptions['properties']) => {
  if (type === 'string') {
    return { ...defaultAttrs, 'data-config': JSON.stringify({ ...attrs, rehyp: true })}
  } else if (type === 'attr') {
    return { ...defaultAttrs, ...attrs}
  }
  return { ...defaultAttrs, 'data-config': { ...attrs, rehyp: true }}
}