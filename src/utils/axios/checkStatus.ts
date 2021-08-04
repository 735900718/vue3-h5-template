import { errorMessageEnum } from "@/enums/httpEnum";
import { Notify } from "vant";

export function checkStatus(status: number, msg: string): string {
  switch (status) {
    case 1001:
      return "车队不存在";
    case 1002:
      //无车队成员信息
      return "";
    case 1003:
      return "找不到该车队，请输入正确口令";
    case 1009:
      return "当前活动已达到人数上限，请关注下次活动";
    case 1004:
      return "用户已在其他车队中";
    case 1103:
      return "您输入的车队码已被使用，请更换";
    case 1105:
      return "您输入的车队码已被使用，请更换";
    case 1107:
      return "好友已删除";
    case 602:
      return "此活动不存在";
    case 500:
      return "未知错误";
    default:
      return `${msg}`;
  }
}
