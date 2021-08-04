import { defHttp } from "@/utils/axios";

export interface GetUserInfoModel {
  username: string;
  sex: number;
}

export enum Api {
  GET_USER = "/api/user"
}

export const getUserApi = () => defHttp.get<GetUserInfoModel>({ url: Api.GET_USER });
