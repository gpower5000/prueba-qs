import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Redirect,withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from "redux";
import { connect } from "react-redux";

import { LateralMenu }         from '../../components/common/LateralMenu/LateralMenu';
import ModalCenter             from '../../components/common/Modal/ModalCentered';
import NavBar                  from '../../components/common/NavBar';
import {
    apiVerifyToken, 
    apiLogoutUser }            from '../../services/http/authentication.service';

import {
    readAuthLocalStorage,
    removeAuthLocalStorage,
    removeArrMenuLocalStorage,
    removeObjMenuLocalStorage
} from '../../toolbox/helpers/local-storage.helper';
import { APP_DESKTOP_WIDTH } from '../../toolbox/config';
import { readAuthCookie, removeAuthCookie } from '../../toolbox/helpers/cookie.helper';
import { useLocalStorage } from '../../toolbox/hooks/local-storage.hook';
import { ActionDeleteUser, ActionStoreUser } from  '../../redux/actions';


import { ByIddle } from './Iddle';
import './Protected.css';

export const Layout = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [appIsReady, setIsReady] = useState(false);
    const [userData, setUserData]  = useState(props.$store.auth.userData);
    const [toogleMenu, changeMenu] = useLocalStorage('userToogleMenu', false);
    const modalDefault = {
        show        : false,
        title       : 'AVISO',
        textBody    : '',
        closable    : false,
        showCancel  : false,
        nameBtnOne  : 'Aceptar',
        nameBtnTwo  : 'Cancelar',
        onConfirm   : () => {},
        onCancel    : () => {}
    };
    const [modalClose, setModalClose]   = useState({
        ...modalDefault,
        closable  : true,
        showCancel: true,
        onClose   : () => {}
    });

    const clearToken = () => {
        removeAuthCookie();
        removeAuthLocalStorage();
        removeArrMenuLocalStorage();
        removeObjMenuLocalStorage();
        setIsAuthenticated(false);
        setIsReady(true);
        props.$action.actionDeleteUser();
    }

    const didMount = async () => {
        const token = readAuthCookie();
        const dataStorage = readAuthLocalStorage();
        if (token != null) {
            if (dataStorage === null) {
                setIsAuthenticated(false);
                setIsReady(true);
            } else {
                let verify;
                if (dataStorage.status) {
                    verify = dataStorage;
                } else {
                    const receipt = await apiVerifyToken({token});
                    verify = receipt;
                }
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                axios.defaults.timeout = 0;
                setTimeout(() => {
                    if (verify.status) {
                        setIsAuthenticated(true);
                        setIsReady(true);
                        setUserData(verify.userData);
                        props.$action.actionStoreUser(verify);
                    } else { clearToken() }   
                });
            }
        } else {
            clearToken();
        }

        (screen.width < APP_DESKTOP_WIDTH) && changeMenu(false);

    }

    const didUnmount = () => {
    }

    const askLogout = () => {
        const modal = {
            ...modalClose,
            show        : true,
            title       : 'Cerrar Sesión',
            textBody    : '¿Desea Cerrar Sesión?. Se perderán sus cambios actuales.',
            closable    : true,
            onConfirm   : () => {
                setModalClose({ ...modal,show: false });
                setTimeout(logout, 250);
            },
            onClose     : () => {
                setModalClose({ ...modal,show: false });
            },
            onCancel    : () => {
                setModalClose({ ...modal,show: false });
            }
        };
        setModalClose(modal);
    }

    const logout = async () => {
        try {
            await apiLogoutUser({ 
                code : props.$store.auth.userData.code
            });
        } catch (e) { }
        removeAuthCookie();
        removeAuthLocalStorage();
        removeArrMenuLocalStorage();
        removeObjMenuLocalStorage();    
        props.$action.actionDeleteUser();
        window.location.href = `${window.location.origin}/login`;
    }

    useEffect(() => {
        didMount();
        return () => { didUnmount() }
    },[]);

    if (appIsReady) {
        if (isAuthenticated) {
            return (
                <ByIddle logout={logout}>
                    <div>
                        <ModalCenter {...modalClose} />
                        <div className = "l-intranet">
                            <div
                                className = {"l-intranet__bg" + (toogleMenu ? ' --open' : '')}
                                onClick = {() => changeMenu(false)}
                            />
                            <LateralMenu
                                location = {props.location}
                                history  = {props.history}
                                logout   = {askLogout}
                                userData = {{}}
                                openMenu = {toogleMenu}
                                onToogleMenu = {(a) => changeMenu(a)}
                            />
                            <div className={"l-intranet__page "+ props.className}>
                                <NavBar
                                    userData   = {props.$store.auth.userData}
                                    changeMenu = {() => changeMenu(!toogleMenu)}
                                    openMenu   = {toogleMenu}
                                    logout     = {() => logout()}
                                />
                                <div className="l-intranet__main-page">
                                    {props.children}
                                    <footer className="l-intranet__footer bg-light">
                                        Copyright © {(new Date).getFullYear()} Química Suiza. Todos los derechos reservados.
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </div>
                </ByIddle>
            );
        } else {
            return (<Redirect to='/login' />);
        }
    } else {
        return (
            <div className = "l-intranet">
                <div
                    className = {"l-intranet__bg" + (toogleMenu ? ' --open' : '')}
                    onClick = {() => changeMenu(false)}
                />
                <LateralMenu
                    location = {props.location}
                    history  = {props.history}
                    logout   = {logout}
                    userData = {{}}
                    openMenu = {toogleMenu}
                    onToogleMenu = {(a) => changeMenu(a)}
                />
                <div className={"l-intranet__page "+ props.className} >
                    <NavBar
                        changeMenu = {() => changeMenu(!toogleMenu)}
                        openMenu   = {toogleMenu}
                        logout     = {() => logout()}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        $store: {
            auth: state.auth
        }
    }
}
const mapDispatchToProps = dispatch => {
    return {
        $action: bindActionCreators({
            actionStoreUser: ActionStoreUser,
            actionDeleteUser: ActionDeleteUser
        }, dispatch)
    }
}
export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Layout);