import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { Popover } from '@material-ui/core';
import { i_sp_lg, i_sp_svg }  from '../../../providers/modules/images';
import { ItemLateralMenu }    from '../ItemLateralMenu/ItemLateralMenu';
import ModalCenter from '../../common/Modal/ModalCentered';
// import { ROUTES_SUPER_ADMIN } from '../../toolbox/config/navigation';
import { APP_NAME_PROJECT }   from '../../../toolbox/config';
import { readArrMenuLocalStorage } from '../../../toolbox/helpers/local-storage.helper';
import './LateralMenu.css';

let menuCurrent     = null;
let subMenuCurrent  = null;

const defaultProps = {
    loadApp: true
}

export const LateralMenu = (props) => {
    const [ROUTES_APP, setRoutes]   = React.useState([]);
    const [ activeSubMenu , setActiveSubMenu ] = React.useState(subMenuCurrent);
    const { openMenu: openLateralMenu } = props;
    
    const handleClick = () => {
        props.onToogleMenu && props.onToogleMenu(!openLateralMenu);
    }

    const handleClass = () => {
        return ['c-lateral-menu', !openLateralMenu ? 'c-lateral-menu__collapse': ''].join(' ');
    }

    const handleGoPage = (e, route, menu) => {
        menuCurrent = route;
        subMenuCurrent = menu;
        setActiveSubMenu(menu);
    }
    const handleActiveSubMenu = (e, menu) => {
        e.preventDefault();
        subMenuCurrent = menu;
        setActiveSubMenu(menu);
    }

    const getUserName = () => {
        if (!!props.userData) {
            const { nombre, apepat, apemat } = props.userData;
            return [nombre,apepat,apemat].join(' ');
        }
        return 'Usuario';
    }

    React.useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const routes = readArrMenuLocalStorage();
        
        if (Array.isArray(routes)) {
            setRoutes(routes);
        } else {
            setRoutes([]);
        }

        menuCurrent  = null;
        
        return () => {
            source.cancel();
        };
    },[]);

    return (
        <div className={handleClass()}>
            <div className="c-lateral-menu__actions --menu-top">
                <ItemLateralMenu 
                    route  = '#'
                    name   = 'Ocultar Menú' 
                    show   = {true}
                    active = {false}
                    svgTag = {() => openLateralMenu ? 
                        <i_sp_svg.SvgMenuFold/> : 
                        <i_sp_svg.SvgMenuUnFold/>
                    }
                    goPage = {handleClick}
                />
            </div>
            <div className="c-lateral-menu__logo">
                <Link to="/" onClick={()=>{ menuCurrent = null }}>
                    <img  className="c-lateral-menu__img-first"  src = {i_sp_lg.img_qs_logo} alt="logo" />
                    <img  className="c-lateral-menu__img-second" src = {i_sp_lg.img_qs_logo_mini}  alt="logo" />
                </Link>
            </div>
            <div className="c-lateral-menu__project" title={APP_NAME_PROJECT}>
                <ItemLateralMenu 
                    route  = {'/'}
                    name   = {APP_NAME_PROJECT} 
                    show   = {true}
                    goPage = {()=>{ menuCurrent = null }}
                />
            </div>
            <div className="c-lateral-menu__content-menu">
                <div className="c-lateral-menu__routes">
                    {(()=> {
                        let routes = [];
                        if (props.loadApp) {
                            ROUTES_APP.forEach( (menu, i) => {
                                if (menu.subMenu.length === 1) {
                                    const item = menu.subMenu[0];
                                    routes.push(
                                        <React.Fragment key = {menu.route+i}>
                                            <ItemLateralMenu
                                                route  = {item.route} 
                                                name   = {item.name} 
                                                show   = {item.isMenu}
                                                svgTag = {!!i_sp_svg[item.icon] ? i_sp_svg[item.icon] : i_sp_svg['SvgDefault']}
                                                active = {item.route === (menuCurrent || props.location.pathname)}
                                                goPage = { e => { handleGoPage(e, item.route, item.route) }}
                                            />
                                        </React.Fragment>
                                    )
                                } else {
                                    let smenuActive = activeSubMenu;
                                    menu.subMenu.forEach( (s,i) => {
                                        s.route === (activeSubMenu || props.location.pathname) ? s.route+i : activeSubMenu
                                    });
                                    routes.push(
                                        <React.Fragment key = {menu.route+i}>
                                            <ItemLateralMenu
                                                route  = {menu.route} 
                                                name   = {menu.name} 
                                                show   = {menu.isMenu}
                                                class  = {'--menu' + (menu.route+i === smenuActive ? ' --open' : '')}
                                                svgTag = {!!i_sp_svg[menu.icon] ? i_sp_svg[menu.icon] : i_sp_svg['SvgDefault']}
                                                active = {menu.route === (menuCurrent || props.location.pathname)}
                                                goPage = { e => { handleActiveSubMenu(e, activeSubMenu === menu.route+i ? null : menu.route+i) }}
                                            />
                                            <div className={"c-lateral-menu__submenu"+ (menu.route+i === smenuActive ? ' --open' : '')}>
                                                {menu.subMenu.map( (item, j) => (
                                                    <ItemLateralMenu 
                                                        key    = {i+'-'+j} 
                                                        route  = {item.route} 
                                                        name   = {item.name} 
                                                        show   = {item.isMenu}
                                                        svgTag = {!!i_sp_svg[item.icon] ? i_sp_svg[item.icon] : i_sp_svg['SvgDefault']}
                                                        active = {item.route === (menuCurrent || props.location.pathname)}
                                                        goPage = { e => { handleGoPage(e, item.route, menu.route+i) }}
                                                    />
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    )
                                }
                            });
                        }
                        return routes;
                    })()}
                </div>
                <div className="c-lateral-menu__actions">
                    <div className="c-lateral-menu__congrats">
                        <span>
                            <span>Power by </span><b>QS</b><b> {(new Date).getFullYear()}</b>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
LateralMenu.defaultProps =  defaultProps;