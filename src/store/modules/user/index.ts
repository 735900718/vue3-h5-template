import { IStore } from "@/store/types";
import { ActionTree, GetterTree, MutationTree } from "vuex";

export type IUserState = {
  username: string;
  sex: number;
};

export const state: IUserState = {
  username: "",
  sex: 0
};

export const getters: GetterTree<IUserState, IStore> = {
  sex: state => state.sex
};

export const mutations: MutationTree<IUserState> = {
  setUser: (state, user: IUserState) => {
    state.username = user.username;
    state.sex = user.sex;
  }
};

export const actions: ActionTree<IUserState, IStore> = {
  // async getUser({ state, commit }) {
  //   commit("setUser", { name: "张三", token: "123" });
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
