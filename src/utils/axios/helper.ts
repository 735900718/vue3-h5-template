import { isObject, isString } from "../is";

export function createNow<T extends boolean>(
  join: boolean,
  restful: T
): T extends true ? string : object;

export function createNow(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? "" : {};
  }

  const now = new Date().getTime();

  if (restful) {
    return `?_t=${now}`;
  }

  return {
    _t: now,
  };
}

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";

export function formatRequestDate(params: any) {
  for (const key in params) {
    if (params[key]?._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = "";
  for (const key in obj) {
    parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
  }
  parameters = parameters.replace(/&$/, "");
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, "?") + parameters;
}
