import { lazy } from "react"

export const Routes = [
  {
    path: "/login",
    component: lazy(() => import("../views/auth/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true
    }
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../views/dashboard")),
    meta: {
      general: true
    }
  },
  {
    path: "/privacy",
    component: lazy(() => import("../views/privacy")),
    layout: "BlankLayout",
    meta: {
      publicRoute:true
    }
  },
  {
    path: "/support",
    component: lazy(() => import("../views/support")),
    layout: "BlankLayout",
    meta: {
      publicRoute:true
    }
  },
  {
    path: "/admin/list",
    component: lazy(() => import("../views/admin-list")),
    meta: {
      action: "call",
      resource: "NoPermissionCode"
    }
  },
  {
    path: "/users/list",
    component: lazy(() => import("../views/responsibles/responsibles-list")),
    meta: {
      action: "call",
      resource: "NoPermissionCode"
    }
  },
  {
    path: '/users/:id',
    component: lazy(() => import('../views/responsibles/responsible-profile')),
    meta: {
      action: "call",
      resource: "NoPermissionCode"
      // navLink: '/teams'
    }
  },
  {
    path: '/categories/list',
    component: lazy(() => import('../views/characteristics/categories')),
    meta: {
      action: "call",
      resource: "NoPermissionCode"
      // navLink: '/teams'
    }
  },
  {
    path: '/characteristics/list',
    component: lazy(() => import('../views/characteristics/characteristics-list')),
    meta: {
      action: "call",
      resource: "NoPermissionCode"
      // navLink: '/teams'
    }
  }
]
