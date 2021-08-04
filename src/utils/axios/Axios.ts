import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { isFunction } from "../is";
import { AxiosCanceler } from "./axiosCancel";
import { CreateAxiosOptions } from "./axiosTransform";
import { RequestOptions, Result } from "./types";
import { cloneDeep } from "lodash";
import { ContentTypeEnum, errorEnum, RequestEnum } from "@/enums/httpEnum";
import qs from "qs";

export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  private getTransform() {
    return this.options.transform;
  }
  /**
   * @description: 设置拦截器
   */
  private setupInterceptors() {
    const transform = this.getTransform();
    // 未配置拦截器，退出设置
    if (!transform) {
      return;
    }

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();

    // 请求拦截器配置处理
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 处理重复请求   如果有ignoreCancelToken,则自动取消重复请求功能将被禁止
        const { ignoreCancelToken } = config.headers;

        const ignoreCancel =
          ignoreCancelToken !== undefined
            ? ignoreCancelToken
            : this.options.requestOptions?.ignoreCancelToken;

        // 没有设置忽略重复， 增加取消方法
        !ignoreCancel && axiosCanceler.addPending(config);

        if (isFunction(requestInterceptors)) {
          config = requestInterceptors(config);
        }
        return config;
      },
      undefined
    );

    // 请求拦截器错误捕获
    isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      );

    // 响应拦截器配置处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      console.log(`响应拦截器配置处理`, res);
      res && axiosCanceler.removePending(res.config);
      if (isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应拦截器错误捕获
    isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(
        undefined,
        responseInterceptorsCatch
      );
  }

  // 支持formData格式
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;

    const contentType = headers["Content-Type"] || headers["content-type"];

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, "data") ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: "brackets" }),
    };
  }

  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    let conf: AxiosRequestConfig = cloneDeep(config);
    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformRequestHook } =
      transform || {};

    if (isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }

    conf = this.supportFormData(conf);

    console.log(`conf`, conf);
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error("request error!"));
            }
            return;
          }
          return resolve((res as unknown) as Promise<T>);
        })
        .catch((e: Error) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          return reject(e);
        });
    });
  }

  get<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: "GET" }, options);
  }

  post<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: "POST" }, options);
  }
}
