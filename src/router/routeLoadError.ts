import { errorMessageEnum } from "@/enums/httpEnum";
import { Dialog } from "vant";

export function routeLoadError() {
  Dialog({
    title: "温馨提示",
    message: errorMessageEnum.ERR_ROUTE,
    confirmButtonText: "知道了"
  }).then(() => {
    location.reload();
  });
}
