import {
  ContentTypeEnum,
  errorEnum,
  errorMessageEnum,
  RequestEnum,
  ResultEnum,
} from "@/enums/httpEnum";
import { AxiosResponse } from "axios";
import { AxiosTransform, CreateAxiosOptions } from "./axiosTransform";
import { RequestOptions, Result } from "./types";
import { Dialog, Notify, Toast } from "vant";
import { useGlobSetting } from "@/hook/setting";
import { isString } from "../is";
import { createNow, formatRequestDate, setObjToUrlParams } from "./helper";
import { VAxios } from "./Axios";
import { checkStatus } from "./checkStatus";
import { merge } from "lodash";

const globSetting = useGlobSetting();
const prefix = globSetting.urlPrefix;

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const transform: AxiosTransform = {
  /**
   * @description 处理请求成功后的数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const { isTransformRequestResult, isReturnNativeResponse } = options;

    // 是否返回原生响应头  比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }

    // 不进行任何处理，直接返回
    // 用户页面代码可能需要直接获取code, data, message这些信息时开启
    if (!isTransformRequestResult) {
      return res.data;
    }

    // 数据错误时返回
    const { data: result } = res;
    if (!result) {
      return errorEnum.RESULT;
    }

    // 这里的code, data, message是后台统一的字段
    // 如果项目有修改，需要在types.ts中设置为项目自己的接口返回格式
    const { code, data, message } = result;

    // 这里判断成功的逻辑需要根据项目进行调整
    const hasSuccess =
      Reflect.has(result, "code") && code === ResultEnum.SUCCESS;

    // 成功后的处理
    if (hasSuccess) {
      return data;
    }
    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = checkStatus(code, message);
    // switch (code) {
    //   case ResultEnum.SUCCESS:
    //     return data;
    //   case ResultEnum.ERROR:
    //     timeoutMsg = message || errorMessageEnum.ERROR_MESSAGE;
    //     break;
    //   case ResultEnum.TIMEOUT:
    //     timeoutMsg = errorMessageEnum.TIMEOUT_MESSAGE;
    //     break;
    //   default:
    //     timeoutMsg = message;
    // }

    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    // 如果有信息才弹窗
    if (timeoutMsg) {
      if (options.errorMessageMode === "modal") {
        Dialog({
          title: "温馨提示",
          message: timeoutMsg,
          confirmButtonText: "我知道了",
        });
      } else if (options.errorMessageMode === "message") {
        Toast(timeoutMsg);
      }
    }

    throw result;
  },

  /**
   * @description: 处理请求失败后的数据
   */
  requestCatchHook: (error: any, options) => {
    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (isString(error) && error) {
      if (options.errorMessageMode === "modal") {
        Notify({
          message: error,
        });
      } else if (options.errorMessageMode === "message") {
        if (error !== "Unauthorized") {
          Toast(error);
        }
      }
    }

    return Promise.reject(error);
  },

  /**
   * @description 请求之前处理config
   */
  beforeRequestHook: (config, options) => {
    const {
      joinPreFix,
      apiUrl,
      joinTime = true,
      formatDate,
      joinParamsToUrl,
    } = options;

    if (joinPreFix) {
      config.url = `${prefix}${config.url}`;
    }

    if (isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }

    const params = config.params || {};
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给get请求加上时间戳参数，避免从缓存中拿数据
        config.params = Object.assign(params || {}, createNow(joinTime, false));
      } else {
        // 兼容RESTful风格
        config.url =
          (config.url as string) + params + `${createNow(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        config.data = params;
        config.params = undefined;
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, config.data);
        }
      } else {
        // 兼容RESTful风格
        config.url = (config.url as string) + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description 请求拦截器设置
   */
  requestInterceptors: (config) => {
    return config;
  },

  /**
   * @description 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    console.log(`responseInterceptorsCatch`);
    console.dir(error);

    const { response, code, config, message } = error || {};
    const requestOptions = config.requestOptions as RequestOptions;
    const msg: string = response?.data?.message ?? "";
    const err: string = error?.toString?.() ?? "";

    try {
      if (
        code === "ECONNABORTED" &&
        message.indexOf("timeout") !== -1 &&
        !requestOptions.ignoreTimeout
      ) {
        console.error(errorMessageEnum.API_TIMEOUT_MESSAGE);
        Toast(errorMessageEnum.API_TIMEOUT_MESSAGE);
      }
      // 这里因为是没走到 request 方法里，所以拿不到接口单独配置的 requestOptions
      if (err?.includes("Network Error")) {
        console.error(errorMessageEnum.NETWORK_EXCEPTION_MSG);
        Toast(errorMessageEnum.NETWORK_EXCEPTION_MSG);
      }
    } catch (error) {
      throw new Error(error);
    }

    return Promise.reject(msg || response?.data || error);
  },
};

export function createAxios(opt?: Partial<CreateAxiosOptions>) {
  const baseURL = globSetting.apiUrl;
  return new VAxios(
    merge(
      {},
      {
        timeout: 10 * 1000,
        // 基础接口地址
        baseURL,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        // prefixUrl: prefix,
        headers: { "Content-Type": ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformRequestResult: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "message",
          // 接口地址
          apiUrl: opt?.baseURL || baseURL,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否需要loading等待
          needLoading: false,
          // 忽略超时报错
          ignoreTimeout: false,
        },
      },
      opt || {}
    )
  );
}

export const defHttp = createAxios({ transform });

export const ignoreErrorHttp = createAxios({
  transform,
  requestOptions: { ignoreTimeout: true },
});
