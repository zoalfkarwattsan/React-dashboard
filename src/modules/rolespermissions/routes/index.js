import {lazy} from "react"

export const Routes = [

	{
		path: "/roles",
		component: lazy(() => import("../views/roles-permissions/roles")),
		meta: {
			action: "call",
			resource: "ROLES_VIEW_LIST"
		}
	}
]
