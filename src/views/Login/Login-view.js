import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';
import { Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from "react-redux";
import Loading from '../../components/common/Loading/Loading';
import { ToastNew } from "../../components/common/Toast/ToastNew";
import { i_sp_lg, i_sp_svg } from '../../providers/modules/images';

import { useAlert } from '../../toolbox/hooks/alert.hook';
import { isEmpty } from '../../toolbox/helpers/validator.helper';
import { ActionStoreUser } from '../../redux/actions';
import { loginSaga, verifyCookieSaga } from '../../redux/saga/auth.saga';

import './login-view.css';

function LoginPage(props) {
    const { toastManagerRef, setToastWarning } = useAlert(null);
    const [loadData, setLoadData] = useState({ show: false, text: '' });
    const [loadView, setLoadView] = useState(false);

    const { errors, register, handleSubmit, reset: resetSearch } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });
    const formRules = {
        username: {
            required: { value: true, message: 'Username es obligatorio' },
            minLength: { value: 3, message: 'Username mínimo 3 caracteres' },
        },
        password: {
            required: { value: true, message: 'Password es obligatorio' },
            minLength: { value: 6, message: 'Password mínimo 6 caracteres' },
            maxLength: { value: 15, message: 'Password máximo 15 caracteres' },
        }
    }

    async function handleLogin(data) {
        loginSaga(
            data,
            setLoadData,
            setToastWarning,
            props.$action.actionStoreUser
        );
    }

    useEffect(() => {
        verifyCookieSaga(setLoadView);
    }, []);

    if (loadView) {
        return (
            <div className="p-login">
                <Helmet>
                    <title>{`${props.$store.application.name} : Iniciar Sesión`}</title>
                </Helmet>
                {loadData.show && <Loading text={loadData.text}/>}
                <ToastNew ref={toastManagerRef} />
                <div className="p-login__image-background">
                    <div className="p-login__image" />
                </div>
                <form className="p-login__form" onSubmit={handleSubmit(handleLogin)} >
                    <div className="p-login__content-left">
                        <div className="p-login__login-mobile">
                            <h1>{props.$store.application.project_name}</h1>
                            <span>{props.$store.application.format_name}</span>
                        </div>
                        <div className="p-login__logo">
                            <figure>
                                <img src={i_sp_lg.img_qs_icon_image} alt="Logo"></img>
                            </figure>
                            <span>{props.$store.application.format_name}</span>
                        </div>
                        <footer>
                            <span>Power by <b>{props.$store.application.format_owner}</b></span>
                        </footer>
                    </div>
                    <div className="p-login__content-right">
                        <h2 className="p-login__title text-info">Iniciar Sesión</h2>
                        <div className="p-login__content-input">
                            <div className="form-group">
                                <div className="p-login__input">
                                    <input
                                        id="txt_username"
                                        type="text"
                                        name="username"
                                        placeholder="usuario"
                                        className={'form-control' + (!isEmpty(errors.username) ? ' is-invalid' : '')}
                                        ref={register(formRules.username)}
                                        onKeyDown={(event) => {
                                            if (event.keyCode === 13 || event.keyCode === 9) {
                                                event.preventDefault();
                                                document.getElementById('txt_password').focus();
                                            }
                                        }}
                                    />
                                    <label htmlFor="txt_username"><i_sp_svg.SvgUser /></label>
                                    {!isEmpty(errors.username) &&
                                        <div className="invalid-feedback">{errors.username.message}</div>
                                    }
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="p-login__input">
                                    <input
                                        id="txt_password"
                                        type="password"
                                        name="password"
                                        placeholder="password"
                                        className={'form-control' + (!isEmpty(errors.password) ? ' is-invalid' : '')}
                                        ref={register(formRules.password)}
                                        onKeyDown={(event) => {
                                            if (event.keyCode === 13 || event.keyCode === 9) {
                                                event.preventDefault();
                                                document.getElementById('btnLogin').focus();
                                                document.getElementById('btnLogin').click();
                                            }
                                        }}
                                    />
                                    <label htmlFor="txt_password"><i_sp_svg.SvgPassword /></label>
                                    {!isEmpty(errors.password) &&
                                        <div className="invalid-feedback">{errors.password.message}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="p-login__button">
                            <Button id="btnLogin" className="w-100" style={{ fontSize: 18 }} variant="info" type="submit">
                                Ingresar
                            </Button>
                        </div>
                        <footer className="p-login__footer">
                            <span>Power by <b>{props.$store.application.format_owner}</b></span>
                        </footer>
                    </div>
                </form>
            </div>
        );
    } else {
        return (<div></div>);
    }
}

const mapStateToProps = (state) => ({
    $store: {
        application: state.application,
        auth: state.auth
    }
})
const mapDispatchToProps = dispatch => ({
    $action: bindActionCreators({
        actionStoreUser: ActionStoreUser
    }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
