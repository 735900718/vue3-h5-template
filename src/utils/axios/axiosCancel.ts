import axios, { AxiosRequestConfig, Canceler } from "axios";
import { isFunction } from "../is";

// 用于存储每个请求的标识和取消功能
let pendingMap = new Map<string, Canceler>();

export const getPendingUrl = (config: AxiosRequestConfig) =>
  [config.method, config.url].join("&");

export class AxiosCanceler {
  // 添加请求
  addPending(config: AxiosRequestConfig) {
    this.removePending(config);
    const url = getPendingUrl(config);
    // 设置取消token
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          pendingMap.set(url, cancel);
        }
      });
  }

  // 删除请求
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      const cancel = pendingMap.get(url);
      cancel?.(url);
      pendingMap.delete(url);
    }
  }

  // 删除所有请求
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      isFunction(cancel) && cancel();
    });
    pendingMap.clear();
  }

  reset(): void {
    pendingMap = new Map<string, Canceler>();
  }
}
