import staticDecodeURIComponent from './staticDecodeURIComponent'
import arrayEach from './arrayEach'
import isString from './isString'

/**
 * 反序列化查询参数
 * @param {String} query 字符串
 */
function unserialize (str) {
  var items
  var result = {}
  if (str && isString(str)) {
    arrayEach(str.split('&'), function (param) {
      items = param.split('=')
      result[staticDecodeURIComponent(items[0])] = staticDecodeURIComponent(items[1] || '')
    })
  }
  return result
}

export default unserialize
