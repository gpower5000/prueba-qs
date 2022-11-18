import React from 'react'
import { Link } from 'react-router-dom';
import { i_sp_svg } from '../../../providers/modules/images';

const NavBar = (props) => {

    const userData = props.userData || {
        apepat: '',
        apemat: '',
        nombre: '',
        dni   : ''
    };

    return (
        <div className="">
            <nav className="l-intranet__navbar navbar navbar-expand-lg navbar-light bg-light justify-content-between">
                <Link
                    to="#"
                    className="navbar-brand"
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onClick = {() => props.changeMenu()}
                >
                    {props.openMenu ? 
                        <i_sp_svg.SvgMenuFold style={{fill: 'var(--black-color)'}}/> : 
                        <i_sp_svg.SvgMenuUnFold style={{fill: 'var(--black-color)'}}/>
                    }
                </Link>
                {userData.dni !== '' &&
                    <div className="l-intranet__userdata">
                        { userData.apepat + ' ' + userData.apemat + ', ' + userData.nombre}
                    </div>
                }
                {userData.dni !== '' &&
                    <span className='l-intranet__userdata-logo'>{userData.apepat[0] || ''}</span>
                }
                <div className="form-inline">
                    <button
                      className="l-intranet__userdata-btn my-1 btn-sm"
                      onClick={() => { props.logout() }}
                    >Cerrar sesión</button>
                </div>
            </nav>
        </div>
    )
}

export default NavBar;