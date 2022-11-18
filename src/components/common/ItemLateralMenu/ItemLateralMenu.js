import React from 'react';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import './ItemLateralMenu.css';

const defaultProps = {
    route  : '/',
    name   : 'Item',
    show   : false,
    active : false,
    class  : '',
    goPage : () => {}
}

export const ItemLateralMenu = (props) => {
    if(!props.show) {
        return null;
    } else {
        return (
            <div className = {"c-item-lateral-menu "+props.class+" "+(props.active ? "c-item-lateral-menu--active": "")}>
                <Link
                    to           = {props.route}
                    onClick      = {props.goPage} 
                    onMouseEnter = {(evt) => {
                        try {
                            const { top } = evt.target.getBoundingClientRect();
                            const child   = evt.target.parentNode.getElementsByClassName("c-item-lateral-menu__hidden-text");
                            child[0].style.top = (top)+'px';
                        } catch (e) {}
                    }}
                >
                    <span className={"c-item-lateral-menu__hidden-text"}>
                        {props.name}
                    </span>
                    <span>
                        {props.name}
                    </span>
                    <i className="c-item-lateral-menu__icon">
                        {!!props.svgTag ? 
                            <props.svgTag/>: <span className="c-item-lateral-menu__capital-letter">{props.name[0]}</span>
                        }
                    </i>
                </Link>
            </div>
        );
    }
}

ItemLateralMenu.defaultProps =  defaultProps;