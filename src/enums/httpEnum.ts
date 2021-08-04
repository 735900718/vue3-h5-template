/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = "success"
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data  upload
  FORM_DATA = "multipart/form-data;charset=UTF-8"
}

export enum errorEnum {
  // 返回结果为此值时，判定为返回失败
  RESULT = "__ERROR_RESULT__"
}

export enum errorMessageEnum {
  // 路由加载失败
  ERR_ROUTE = "服务器错误，请重新进入应用",
  OPERATION_FAILED = "操作失败",
  ERROR_TIP = "错误提示",
  ERROR_MESSAGE = "操作失败,系统异常!",
  TIMEOUT_MESSAGE = "登录超时,请重新登录!",
  API_TIMEOUT_MESSAGE = "接口请求超时,请刷新页面重试",
  NETWORK_EXCEPTION = "网络异常",
  NETWORK_EXCEPTION_MSG = "网络不畅，请检查网络后重试",

  ERR_MSG_401 = "用户没有权限（令牌、用户名、密码错误）!",
  ERR_MSG_403 = "用户得到授权，但是访问是被禁止的。!",
  ERR_MSG_404 = "网络请求错误,未找到该资源!",
  ERR_MSG_405 = "网络请求错误,请求方法未允许!",
  ERR_MSG_408 = "网络请求超时!",
  ERR_MSG_500 = "服务器错误,请联系管理员!",
  ERR_MSG_501 = "网络未实现!",
  ERR_MSG_502 = "网络错误!",
  ERR_MSG_503 = "服务不可用，服务器暂时过载或维护!",
  ERR_MSG_504 = "网络超时!",
  ERR_MSG_505 = "http版本不支持该请求!"
}
