import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import SessionLogger from "../views/SessionLogger.vue";
import SessionViewer from "../views/SessionViewer.vue";
import StudentAdder from "../views/StudentAdder.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/log",
    name: "Logger",
    component: SessionLogger
  },
  {
    path: "/view",
    name: "Viewer",
    component: SessionViewer
  },
  {
    path: "/adder",
    name: "Adderer",
    component: StudentAdder
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
  
export default router;