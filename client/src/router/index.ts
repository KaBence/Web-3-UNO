import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Game from "../views/Game.vue";
import Lobby from "@/views/Lobby.vue";
import Login from "@/views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    },
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/lobby",
      name: "lobby",
      component: Lobby,
    },
    {
      path: "/game",
      name: "game",
      component: Game,
    },
  ],
});

export default router;
