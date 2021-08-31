import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import SessionLogger from "../views/SessionLogger.vue";
import SessionViewer from "../views/SessionViewer.vue";
import StudentAdder from "../views/StudentAdder.vue";
import LoggedOut from "../views/LoggedOut.vue";
import NoAccount from "../views/NoAccount.vue";
import Invite from "../views/Invite.vue";
import EditGoals from '../views/EditGoals'
import firebase from 'firebase/app';
import {db} from '../firebase.js';

const routes = [
  {
    path: "/dashboard",
    name: "Home",
    component: Home
  },
  {
    path: "/",
    name: "LoggedOut",
    component: LoggedOut
  },
  {
    path: "/log/:id",
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
  },
  {
    path: "/noaccount",
    name: "NoAccount",
    component: NoAccount
  },
  {
    path: "/invite",
    name: "Invite",
    component: Invite
  },
  {
    path: "/editgoals",
    name: "EditGoals",
    component: EditGoals
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/dashboard'
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  }
)};

function isInvited(email) {
  return db.collection(`invites`).where('email', '==', email).get()
}

//reroute to /loggedout if not logged in
router.beforeEach(async (to, from, next) => {
  if (to.name !== 'LoggedOut' && await firebase.getCurrentUser() === null) next({ name: 'LoggedOut' })
  else next()
})

//reroute /loggedout to /home if logged in
router.beforeEach(async (to, from, next) => {
  if(to.name === 'LoggedOut' &&  await firebase.getCurrentUser() !== null) {
    next({name: 'Home'})
  }
  else next()
})

//reroute to /noaccount if logged in but not invited
//reroute /noaccount to /home if invited
router.beforeEach(async (to, from, next) => {
  const user = await firebase.getCurrentUser()
  if(user !== null) {
    const docs = await isInvited(user.email)
    if(to.name !== 'LoggedOut' && to.name !== 'NoAccount' && docs.size === 0) next({ name: 'NoAccount'})
    else if(to.name === 'NoAccount' && docs.size !== 0) next({name: 'Home'})
    else next()
  }
  else next()
})
  
export default router;