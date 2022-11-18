import React, { Fragment, useRef }  from 'react';
import IdleTimer from 'react-idle-timer'
import { ToastNew } from "../common/Toast/ToastNew";
import icon_warning from "../../assets/images/warning.svg";
    
export const ByIddle = (props) =>{

    const idleTimer = useRef(null);
    const toastManagerRef = useRef(null);

    const setConfigToast = (config) => {
        if (!!toastManagerRef) {
            toastManagerRef.current && toastManagerRef.current.changeToast(config);
        }
    };

    const _onAction = (e) =>{}
    const _onActive = (e) =>{}

    const _onIdle = (e) => {
        setConfigToast({
            show: true, srcImg: icon_warning, backColor: "color-warning",
            text: 'Usuario inactivo, la sesión será cerrada', title: "Mensaje",
        });
        setTimeout(()=>{
            props.logout && props.logout();
        },2000);
    }

    return(
        <Fragment>
            <ToastNew ref={toastManagerRef} />
            <IdleTimer
                ref      = {idleTimer}
                element  = {document}
                onActive = {_onActive}
                onIdle   = {_onIdle}
                onAction = {_onAction}
                debounce = {250}
                timeout  = {1000 * 60 * 30} 
            />
            {
                props.children
            }
        </Fragment>
    )
}