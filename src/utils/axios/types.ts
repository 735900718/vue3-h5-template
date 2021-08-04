import { ComponentInstance } from "vant/lib/utils/base";

export type ErrorMessageMode = "none" | "modal" | "message" | undefined;

export interface RequestOptions {
  // 是否将请求参数拼接到URL
  joinParamsToUrl?: boolean;
  // 请求参数格式设置
  formatDate?: boolean;
  // 是否处理请求结果
  isTransformRequestResult?: boolean;
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean;
  // 是否加入url
  joinPreFix?: boolean;
  // 接口地址，使用默认apiUrl
  apiUrl?: string;
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 是否添加时间戳
  joinTime?: boolean;
  // 忽略取消token
  ignoreCancelToken?: boolean;
  // 是否需要Loading等待
  needLoading?: any;
  // 是否需要屏蔽加载超时的提醒
  ignoreTimeout?: boolean;
}

export interface Result<T = any> {
  code: number;
  // type?: "success" | "error" | "warning";
  message: string;
  data: T;
}
