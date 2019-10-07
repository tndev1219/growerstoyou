/**
 *  admin sidebar menu
 */
/* eslint-disable */
export default [
   {
      "menu_title": "dashboard",
      "type": "null",
      "path": "/farmer/dashboard",
      "icon": "poll",
      "child_routes": null
   },
   {
      "menu_title": "orders",
      "type": "null",
      "path": "/farmer/orders",
      "icon": "recent_actors",
      "child_routes": null
   },
   {
      "menu_title": "products",
      "type": "subMenu",
      "path": "javascript:void(0)",
      "icon": "shopping_cart",
      "child_routes": [
         {
            "path": "/farmer/products",
            "menu_title": "products",
            "icon": "arrow_right_alt"
         },
         {
            "path": "/farmer/product-add",
            "menu_title": "product add",
            "icon": "arrow_right_alt"
         }
      ]
	},
	{
		"menu_title": "contact us",
		"type": "null",
		"path": "/farmer/contact-us",
		"icon": "contacts",
		"child_routes": null
	},
   {
      "menu_title": "profile",
      "type": "null",
      "path": "/farmer/account",
      "icon": "account_circle",
      "child_routes": null
   },
   {
      "menu_title": "go to site",
      "type": "null",
      "path": "/",
      "icon": "home",
      "child_routes": null
   },
]   