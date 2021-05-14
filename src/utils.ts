import { RehypeAttrsOptions } from './'

export const getURLParameters = (url: string): Record<string, string | number | boolean> =>
(url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
  (a: Record<string, string | number>, v: string) => (
    // eslint-disable-next-line no-sequences
    (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
  ),
  {},
)
/**
 * 获取代码注视的位置
 * @param data 数据
 * @param index 当前数据所在的位置
 * @returns 返回 当前参数数据 Object，`{}`
 */
export const getComment = (data: any[] = [], index: number, isCode = false): Record<string, string | number | boolean | null> => {
  let i = index
  if (isCode) {
    let text = false
    do {
      i--
      if ((data[i].value && data[i].value.replace(/(\n|\s)/g, '') !== '') || data[i].type !== 'text') {
        text = true
      }
    } while (i > -1 && !text)
  } else {
    do {
      i++
    } while (i < data.length && data && data[i] && data[i].type && data[i].type === 'text' && !data[i].value.replace(/(\n|\s)/g, ''))
  }
  if (Array.isArray(data) && data[i] && data[i].type === 'comment') {
    const val = data[i].value
    if (!/rehype:/.test(val)) return {}
    const param = getURLParameters(val.replace(/^rehype:/, ''))
    Object.keys(param).forEach((keyName: string) => {
      if (param[keyName] === 'true') {
        param[keyName] = true
      }
      if (param[keyName] === 'false') {
        param[keyName] = false
      }
      if (typeof param[keyName] === 'string' && !/^0/.test(param[keyName] as string) && !isNaN(+param[keyName])) {
        param[keyName] = +param[keyName]
      }
    })
    return param
  }
  return {}
}

export const propertiesHandle = (defaultAttrs: Record<string, string> = {}, attrs: Record<string, string | number | boolean | null>, type: RehypeAttrsOptions['properties']) => {
  if (type === 'string') {
    return { ...defaultAttrs, 'data-config': JSON.stringify({ ...attrs, rehyp: true })}
  } else if (type === 'attr') {
    return { ...defaultAttrs, ...attrs}
  }
  return { ...defaultAttrs, 'data-config': { ...attrs, rehyp: true }}
}