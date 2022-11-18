import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import sluglify from 'slugify';

import { readAuthLocalStorage, setArrMenuLocalStorage, setObjMenuLocalStorage } from '../toolbox/helpers/local-storage.helper';
import { uniqByKeepFirst } from '../toolbox/helpers/array.helper';

import Unauthorized from '../views/_unautorized';
import Home from '../views/Home/Home-view';
import LoginPage from '../views/Login/Login-view.js';

const replaceViews = {
	'1-1': 'Auditoria/SearchBox/SearchBox-view.js',
	'3-3': 'RegisterUser/RegisterUser-view.js',
	'3-4': 'ProfileManager/ProfileManager-view.js',
}

class AllRoutes extends React.Component {

	staticMenu = [
		// {   name  : 'Iniciar Sesión', 
		//     route : '/login', 
		//     icon  : 'SvgPlay', 
		//     Page  : LoginPage
		// },
		// {   name  : 'Inicio', 
		//     route : '/', 
		//     icon  : 'SvgPlay', 
		//     Page  : HomePage
		// }
	];
	state = {
		menu: this.staticMenu
	}

	camelCase = (str) => {
		return str
			.replace(/\s(.)/g, ($1) => $1.toUpperCase())
			.replace(/\s/g, '')
			.replace(/^(.)/, ($1) => $1.toLowerCase())
	}

	UNSAFE_componentWillMount() {
		const dataStorage = readAuthLocalStorage();
		if (dataStorage) {
			const { userModules } = dataStorage;
			if (userModules) {
				let objMenu = {};
				this.state.menu = [...this.staticMenu];
				const chunckMenu = uniqByKeepFirst(userModules, it => eval("it.MODULO_ID", it));
				const chunckSubMenu = uniqByKeepFirst(userModules, it => eval("it.MODULO_ID+'-'+it.VISTA_ID", it));

				chunckMenu.forEach(itemMenu => {
					const pretty = {
						name: itemMenu.DESC_MODULO,
						icon: itemMenu.DESC_ICONO_MODULO,
						moduloId: itemMenu.MODULO_ID,
						route: itemMenu.DESC_RUTA_MODULO,
						isMenu: true,
						subMenu: [],
					}

					chunckSubMenu.forEach(itemSubMenu => {
						try {
							const page = require('../views/' + replaceViews[itemSubMenu.MODULO_ID + '-' + itemSubMenu.VISTA_ID]).default;
							if (itemSubMenu.MODULO_ID === itemMenu.MODULO_ID) {
								pretty.subMenu.push({
									name: itemSubMenu.DESC_VISTA,
									icon: itemSubMenu.DESC_ICONO_VISTA,
									page: page,
									isMenu: true,
									route: '/' + itemSubMenu.DESC_RUTA_MODULO + '/' + itemSubMenu.DESC_RUTA_VISTA,
									actions: {
										actionInsert: itemSubMenu.ACCION_I == 'X',
										actionUpdate: itemSubMenu.ACCION_U == 'X',
										actionDelete: itemSubMenu.ACCION_D == 'X',
										actionSearch: itemSubMenu.ACCION_S == 'X',
									}
								});
							}
						}
						catch (e) { }
					});
					/* if (pretty.subMenu.length > 0) {
						pretty.isMenu = true
					} */
					objMenu[itemMenu.MODULO_ID] = pretty;
					this.state.menu.push(pretty);
				});
				setArrMenuLocalStorage(this.state.menu);
				setObjMenuLocalStorage(objMenu);
			}
		}
	}

	render() {
		const routeDynamics = [];
		this.state.menu.forEach((menu, key) => {
			menu.subMenu.forEach((item) => {
				routeDynamics.push(
					<Route key={key} exact path={item.route} component={
						(props) => <item.page {...props} actions={item.actions} />
					} />
				)
			})
		});
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					{
						routeDynamics
					}
					<Route path="/login" component={LoginPage} />
					<Route path='*' exact={true} component={() => {
						return <Unauthorized />
					}} />
				</Switch>
			</Router>
		)
	}
}

export default AllRoutes;