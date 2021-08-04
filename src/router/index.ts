import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import { routeLoadError } from "./routeLoadError";
import { Path } from "./routePath.enum";

const routes: Array<RouteRecordRaw> = [
  {
    path: Path.HOME,
    name: "Home",
    component: Home
  },
  {
    path: Path.ABOUT,
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue").catch(routeLoadError)
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export function setupRouter(app: App) {
  app.use(router);
}

export default router;
