import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { connect } from "react-redux";
import { useForm, Controller } from 'react-hook-form';
import { Form, Col, Row, Button } from "react-bootstrap";
import { i_sp_svg } from "../../providers/modules/images";
import Protected from '../../components/layout/Protected';
import { ToastNew } from "../../components/common/Toast/ToastNew";
import { Select, prettySelectConfig } from "../../components/common/Select";
import ModalCentered from '../../components/common/Modal/ModalCentered';
import Loading from "../../components/common/Loading/Loading";

import { useAlert } from '../../toolbox/hooks/alert.hook';
import { FORM_RULES } from './RegisterUser-data';
import { isEmpty } from '../../toolbox/helpers/validator.helper';

import {
    downloadExcelFile,
    apiGetAllStateUser,
    apiGetAllTypeUser,
    apiGetUserById,
    apiSaveUser,
    apiUpdateUser,
    apiGetAllStore,
    apiSaveUserStore,
} from '../../services/http/user-register.service';
import {
    apiGetAllRoles
} from '../../services/http/role.service';

const RegisterUserView = ({
  $store
}) => {
    const nameView = useRef('Registro de Usuarios');
    const alertMessage = 'Error en cargar los datos';
    const [loadData, setLoadData] = useState(false);
    const [profileList, setProfileList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [typeUserList, setTypeUserList] = useState([]);
    const [disabledForm, setDisabledForm] = useState(true);
    const [errorCode, setErrorCode] = useState(false);
    const [disabledSearch, setDisabledSearch] = useState(false);

    const [dataTypeUser, setDataTypeUser] = useState('1');
    const [dataModeForm, setDataModeForm] = useState('INSERT');

    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [listTemporalSucur, setListTemporalSucur] = useState([]);
    const [listTemporalDeleteSucur, setListTemporalDeleteSucur] = useState([]);
    const [checkedPrincipal, setCheckedPrincipal] = useState('');

    const profileRef = useRef(null);
    const stateRef = useRef(null);

    const { toastManagerRef, setToastInfo, setToastWarning, setToastSuccess } = useAlert(null);

    const { errors, control, handleSubmit, reset: resetSearch, setError, getValues, setValue } = useForm({
        defaultValues: {
            txtUser: '',
            txtPassword: '',
            txtNames: '',
            txtFirstName: '',
            txtLastName: '',
            txtProfile: '',
            txtState: ''
        }
    });
    const [dataModal, setDataModal] = useState({
        show: false,
        title: "",
        textBody: "",
        nameBtnOne: "",
        nameBtnTwo: "",
        disabled1: true,
        disabled2: true,
    });

    const { RiFileExcel2Fill, ImSearch, BiSave } = i_sp_svg;

    const handleResetForm = () => {
        resetSearch();
    }
    const handleSaveForm = (data) => {
        let statusForm = true;
        if (!data.txtNames) {
            setError("txtNames", {
                type: "manual",
                message: "Valor requerido por Usuario Interno"
            });
            statusForm = false;
        }
        if (!data.txtFirstName) {
            setError("txtFirstName", {
                type: "manual",
                message: "Valor requerido por Usuario Interno"
            });
            statusForm = false;
        }
        if (!data.txtLastName) {
            setError("txtLastName", {
                type: "manual",
                message: "Valor requerido por Usuario Interno"
            });
            statusForm = false;
        }
        if (!statusForm) {
            return;
        }

        const params = {
            id: data.txtUser.toUpperCase(),
            user: data.txtUser.toUpperCase(),
            password: data.txtPassword,
            name: data.txtNames,
            patherName: data.txtFirstName,
            motherName: data.txtLastName,
            socialReason: null,
            typeUser: dataTypeUser,
            state: !!data.txtState ? data.txtState.value : null,
            roleId: !!data.txtProfile ? data.txtProfile.value : null,
        }
        let apiAction = () => new Promise((resolve) => resolve(null));
        if (dataModeForm == 'INSERT') {
            apiAction = apiSaveUser;
        } else {
            apiAction = apiUpdateUser;
        }

        setLoadData(true);
        apiAction(params.id, params)
            .then((rpta) => {
                setLoadData(false);
                if (rpta.status == 'Success') {
                    handleResetForm();
                    setErrorCode(false);
                    setDisabledForm(true);
                    setDisabledSearch(false);
                    setDataModeForm('INSERT');
                    setToastSuccess(rpta.Resp.message);

                    /* Guardamos cada registro de la lista de tiendas actualizadas */
                    for (let dataRow of listTemporalSucur) {
                        let flag_pricipal = 0;
                        if (checkedPrincipal === dataRow.COD_LOCAL) {
                            flag_pricipal = 1;
                        }
                        const det = {
                            usuario: dataRow.DNI.toString(),
                            cod_local: dataRow.COD_LOCAL.toString(),
                            estado: 1,// 1:  activo 0: Inactivo 
                            flag_principal: flag_pricipal,// 0: Si no es tienda secundaria 1: si es tienda principal
                            usu_creacion: $store.auth.userData.code
                        }
                        apiSaveUserStore(det).then(rpta => { /* console.log("Tiendas por usuarios Guardadas correctamente ", rpta) */ }).catch((sal) => {
                            setLoadData(false);
                            setToastWarning('Error al Registrar Locales por usuario ');
                        });
                    }
                    /* Guardamos cada registro de la lista de tiendas Eliminadas */
                    for (let itemDelete of listTemporalDeleteSucur) {
                        const det1 = {
                            usuario: itemDelete.DNI.toString(),
                            cod_local: itemDelete.COD_LOCAL.toString(),
                            estado: 0,/* 1:  activo 0: Inactivo */
                            flag_principal: 0,// 0: Si no es tienda secundaria 1: si es tienda principal
                            usu_creacion: store.auth.userData.code
                        }
                        apiSaveUserStore(det1).then(res => { /* console.log("Tiendas eliminadas correctamente ", res) */ }).catch((sal) => {
                            setLoadData(false);
                            setToastWarning('Error al Eliminar Locales por usuario ');
                        });
                    }
                    setListTemporalSucur([]);
                    setListTemporalDeleteSucur([]);
                    setCheckedPrincipal('');
                    /* End save List Tiendas */
                } else {
                    setToastWarning(rpta.Resp.message);
                }
            })
            .catch((error) => {
                setLoadData(false);
                setToastWarning('No se pudo guardar los datos');
            })
    }
    const handleErrorForm = (data) => {
        if (!!data.txtProfile) {
            setToastWarning('Seleccione Perfil');
            profileRef.current.focus();
            return;
        }
        if (!!data.txtState) {
            setToastWarning('Seleccione Estado');
            stateRef.current.focus();
            return;
        }
        setToastWarning('Seleccione los campos requeridos');
    }

    const handleSearhUser = () => {
        setListTemporalSucur([]);
        const userCode = getValues('txtUser');
        setErrorCode(false);
        setDataModeForm('INSERT');

        if (!userCode) {
            handleSelectNode('formCodeUser').focus();
            setToastWarning('Ingrese código de Usuario');
            return;
        }
        if (userCode.length < 4) {
            handleSelectNode('formCodeUser').focus();
            setToastWarning('Código mínimo de 4 caracteres');
            setErrorCode(true);
            return;
        }
        if (userCode.length > 20) {
            handleSelectNode('formCodeUser').focus();
            setToastWarning('Código máximo de 20 caracteres');
            setErrorCode(true);
            return;
        }

        setLoadData(true);
        setDisabledForm(true);
        setDisabledSearch(true);
        handleResetForm();
        setTimeout(() => {
            setValue('txtUser', userCode);
        }, 0);

        apiGetUserById({
            id: userCode
        }).then((rpta) => {
            setLoadData(false);
            if (rpta.length === 0) {
                setDataModal({
                    show: true,
                    title: "Mensaje",
                    textBody: "DNI/Código no encontrado. ¿Desea registrar nuevo usuario?",
                    nameBtnOne: "Aceptar",
                    nameBtnTwo: "Cancelar",
                    disabled1: false,
                    disabled2: false,
                    onClose: () => {
                        setDataModal({ show: false })
                        setDisabledSearch(false);
                    },
                    onConfirm: () => {
                        setDataModal({ show: false });
                        setDisabledForm(false);
                        setDisabledSearch(true);
                        setDataModeForm('INSERT');
                    }
                });
            } else {
                setValue('txtNames', rpta[0].NOMBRE || '');
                setValue('txtFirstName', rpta[0].APE_PATERNO || '');
                setValue('txtLastName', rpta[0].APE_MATERNO || '');
                setValue('txtProfile', { label: ' ' + rpta[0].COD_ROL + '-' + rpta[0].ROL, value: rpta[0].COD_ROL } || '');
                setValue('txtState', { label: ' ' + rpta[0].ESTADO, value: rpta[0].COD_ESTADO } || '');
                setDataModeForm('UPDATE');
                setToastInfo('Usuario encontrado');
                setDisabledForm(false);
            }
        }).catch((error) => {
            setLoadData(false);
            setToastWarning('Problemas en buscar usuario, reintente');
        })
    }
    const handleSelectNode = (id) => {
        return document.getElementById(id)
    }
    const keyPressText = (event) => {
        const name = event.target.name || event.target.getAttribute("aria-label");
        if (event.keyCode === 13 || event.keyCode === 9) {
            switch (name) {
                case 'txtUser': {
                    handleSelectNode('btn-search').focus();
                    handleSelectNode('btn-search').click();
                    break;
                }
                case 'txtPassword': handleSelectNode('formNames').focus(); break;
                case 'txtNames': handleSelectNode('formFirstName').focus(); break;
                case 'txtFirstName': handleSelectNode('formLastName').focus(); break;
                case 'txtLastName': {
                    profileRef.current.focus();
                    break;
                }
                case 'txtProfile': {
                    stateRef.current.focus();
                    break;
                }
                case 'txtState': {
                    handleSelectNode('btn-save').focus();
                    handleSelectNode('btn-save').click();
                }
            }
            event.preventDefault();
        }
    }

    const onChangeSucursal = (event) => {
        if (event !== null) {
            setSelectedSucursal(event);
        } else {
            setSelectedSucursal(null);
        }
    };

    const selectRowSucursal = (event, orgLvlNumber) => {
        event.preventDefault();
        const data = listTemporalSucur;
        const exist = _.filter(data, function (o) {
            return o.COD_LOCAL == orgLvlNumber;
        });
        listTemporalDeleteSucur.push(...exist);
        const newArray = _.differenceWith(data, exist, _.isEqual);
        setListTemporalSucur([]);
        setListTemporalSucur(newArray);
    };

    const agregarSucursal = () => {
        if (selectedSucursal != null) {
            const userCode = getValues('txtUser');
            const dataAdd = {
                DNI: userCode,
                COD_LOCAL: selectedSucursal.value,
                DES_LOCAL: selectedSucursal.label,
                FLAG_PRINCIPAL: 0,
                ESTADO: 1
            };
            // console.log("SALIDA DE dataAdd ", dataAdd)
            if (listTemporalSucur && listTemporalSucur.length === 0) {
                listTemporalSucur.push(dataAdd);
            } else {
                let indice = -1;
                listTemporalSucur.forEach((item, index) => {
                    if (item.COD_LOCAL === dataAdd.COD_LOCAL) {
                        if (indice === -1) {
                            listTemporalSucur[index] = dataAdd;
                            indice = index;
                        }
                    }
                });
                if (indice === -1) {
                    listTemporalSucur.push(dataAdd);
                }
            }
            setListTemporalSucur([]);
            setListTemporalSucur(listTemporalSucur);
            setSelectedSucursal(null);
        } else {
            setToastWarning("Seleccione una Sucursal");
        }
    };

    const handleDownloadFile = async () => {
        setLoadData(true);
        const rpta = await downloadExcelFile();
        setLoadData(false);
        if (rpta === false) {
            setToastWarning('No se pudo descargar archivo');
        } else {
            setToastSuccess('Archivo descargado');
        }
    }

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source1 = CancelToken.source();
        const source2 = CancelToken.source();
        const source3 = CancelToken.source();

        const init = () => {
            apiGetAllRoles({ cancelToken: source1.token })
                .then(rpta => setProfileList(prettySelectConfig(rpta, ['ROL_ID', 'DESCRIPCION_ROL'], 'ROL_ID')))
                .catch(() => setToastWarning(alertMessage + ' de Perfiles'))
            apiGetAllStateUser({ cancelToken: source2.token })
                .then(rpta => setStateList(prettySelectConfig(rpta, 'DESCRIPCION', 'COD_STATE')))
                .catch(() => setToastWarning(alertMessage + ' de Estados'))
            apiGetAllTypeUser({ cancelToken: source3.token })
                .then(rpta => setTypeUserList(prettySelectConfig(rpta, 'TIPO_DESCRIPCION', 'TIPO_USUARIO')))
                .catch(() => setToastWarning(alertMessage + ' de Tipo de Usuarios'))
        }

        init();

        return () => {
            source1.cancel();
            source2.cancel();
            source3.cancel();
        }
    }, []);

    return (
        <Protected nav={true} navTo={'/'}>
            <Helmet>
                <title>{`${$store.application.name} - ${nameView.current}`}</title>
            </Helmet>
            <ToastNew ref={toastManagerRef} />
            <div className="jumbotron text-center p-3">
                <h1>{nameView.current}</h1>
            </div>

            <Form.Group as={Row} className="justify-content-center">
                <Col sm="12" lg="10" className="mb-0">
                    <Form.Group as={Row}>
                        <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-1" controlId='formCodeUser'>
                            <Form.Label column sm="5" className="mb-1">
                                DNI/Código :
                            </Form.Label>
                            <Col sm="7" className="p-1">
                                <Controller
                                    name="txtUser"
                                    rules={FORM_RULES.txtUser}
                                    control={control}
                                    render={(props) => (
                                        <Form.Control
                                            {...props}
                                            maxLength={20}
                                            minLength={4}
                                            placeholder="Ingrese Código"
                                            isInvalid={!isEmpty(errors.txtUser) || errorCode}
                                            onKeyDown={keyPressText}
                                            onChange={(e) => {
                                                props.onChange(e.target.value.toUpperCase().trim());
                                                setErrorCode(false);
                                            }}
                                        />
                                    )}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-1">
                            <Col sm="7" className="p-1">
                                {typeUserList.map((row) => (
                                    <Form.Check
                                        custom
                                        inline
                                        name="formTypeUser"
                                        label={row.label}
                                        key={row.value}
                                        checked={dataTypeUser === row.value}
                                        type={'radio'}
                                        id={`formTypeUser-${row.value}`}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setDataTypeUser(row.value);
                                            }
                                        }}
                                    />
                                ))}
                            </Col>
                            <Col sm="5">
                                <Button id="btn-search" className="w-100" variant="info" type="button" onClick={() => handleSearhUser()}>
                                    <ImSearch className="mr-3" style={{ width: 18, height: 18 }} />
                                    <span>Buscar</span>
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form.Group>
                </Col>
                <Col sm="12" lg="10" className="v-bg-gray pb-1" />
            </Form.Group>
            <Form onSubmit={handleSubmit(handleSaveForm, handleErrorForm)}>
                <Form.Group as={Row} className="justify-content-center">
                    <Col sm="12" lg="10" className="mb-4">
                        <Form.Group as={Row}>
                            <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-1" controlId='formPassword'>
                                <Form.Label column sm="5" className="mb-1">
                                    Password :
                                </Form.Label>
                                <Col sm="7" className="p-1">
                                    <Controller
                                        name="txtPassword"
                                        control={control}
                                        rules={FORM_RULES.txtPassword}
                                        render={(props) => (
                                            <Form.Control
                                                {...props}
                                                placeholder="Ingrese Password"
                                                type="password"
                                                onKeyDown={keyPressText}
                                                disabled={disabledForm}
                                                isInvalid={!isEmpty(errors.txtPassword)}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!isEmpty(errors.txtPassword) && errors.txtPassword.message}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-1" controlId='formNames'>
                                <Form.Label column sm="5" className="mb-1">
                                    Nombres :
                                </Form.Label>
                                <Col sm="7" className="p-1">
                                    <Controller
                                        name="txtNames"
                                        control={control}
                                        rules={FORM_RULES.txtNames}
                                        render={(props) => (
                                            <Form.Control
                                                {...props}
                                                placeholder="Ingrese Nombres"
                                                onKeyDown={keyPressText}
                                                disabled={disabledForm}
                                                isInvalid={!isEmpty(errors.txtNames)}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!isEmpty(errors.txtNames) && errors.txtNames.message}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-1" controlId='formFirstName'>
                                <Form.Label column sm="5" className="mb-1">
                                    Apellido Paterno :
                                </Form.Label>
                                <Col sm="7" className="p-1">
                                    <Controller
                                        name="txtFirstName"
                                        control={control}
                                        rules={FORM_RULES.txtFirstName}
                                        render={(props) => (
                                            <Form.Control
                                                {...props}
                                                placeholder="Ingrese Apellido Paterno"
                                                onKeyDown={keyPressText}
                                                disabled={disabledForm}
                                                isInvalid={!isEmpty(errors.txtFirstName)}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!isEmpty(errors.txtFirstName) && errors.txtFirstName.message}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-4" controlId='formLastName'>
                                <Form.Label column sm="5" className="mb-1">
                                    Apellido Materno :
                                </Form.Label>
                                <Col sm="7" className="p-1">
                                    <Controller
                                        name="txtLastName"
                                        control={control}
                                        rules={FORM_RULES.txtLastName}
                                        render={(props) => (
                                            <Form.Control
                                                {...props}
                                                placeholder="Ingrese Apellido Materno"
                                                onKeyDown={keyPressText}
                                                disabled={disabledForm}
                                                isInvalid={!isEmpty(errors.txtLastName)}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!isEmpty(errors.txtLastName) && errors.txtLastName.message}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-2" controlId="formProfile">
                                <Form.Label column sm="5" className="mb-1">
                                    Perfil :
                                </Form.Label>
                                <Col sm="7" className="p-1">
                                    <Controller
                                        as={
                                            React.forwardRef((props, ref) => {
                                                return <Select ref={profileRef} {...props} defaultValue={null} />
                                            })
                                        }
                                        aria-label="txtProfile"
                                        name="txtProfile"
                                        onKeyDown={keyPressText}
                                        options={profileList}
                                        rules={FORM_RULES.txtProfile}
                                        control={control}
                                        isClearable={true}
                                        isDisabled={disabledForm}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!isEmpty(errors.txtProfile) && errors.txtProfile.message}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-4" controlId="formState">
                                <Form.Label column sm="5" className="mb-1">
                                    Estado :
                                </Form.Label>
                                <Col sm="7" className="p-1">
                                    <Controller
                                        as={
                                            React.forwardRef((props, ref) => {
                                                return <Select ref={stateRef} {...props} defaultValue={null} />
                                            })
                                        }
                                        aria-label="txtState"
                                        name="txtState"
                                        onKeyDown={keyPressText}
                                        options={stateList}
                                        rules={FORM_RULES.txtState}
                                        control={control}
                                        isClearable={true}
                                        isDisabled={disabledForm}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!isEmpty(errors.txtState) && errors.txtState.message}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            {/* Fin change */}
                            <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-1">
                                <Col sm="6">
                                    <Button className="w-100 mr-0 mr-sm-3 mb-2" variant="success" onClick={() => handleDownloadFile()}>
                                        <RiFileExcel2Fill className="mr-2" style={{ width: 20, height: 20 }} />
                                        <span>Excel</span>
                                    </Button>
                                </Col>
                                <Col sm="6">
                                    <Button id="btn-save" type="submit" className="w-100 mr-0 mr-sm-3 mb-2" variant="info" disabled={disabledForm}>
                                        <BiSave className="mr-2" style={{ width: 20, height: 20 }} />
                                        <span>Guardar</span>
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form.Group>
                    </Col>
                </Form.Group>
                {dataModal.show && (
                    <ModalCentered
                        size="sm"
                        show={dataModal.show}
                        title={dataModal.title}
                        textBody={dataModal.textBody}
                        nameBtnOne={dataModal.nameBtnOne}
                        nameBtnTwo={dataModal.nameBtnTwo}
                        onClose={dataModal.onClose}
                        onConfirm={dataModal.onConfirm}
                        disabled1={dataModal.disabled1}
                        disabled2={dataModal.disabled2}
                    ></ModalCentered>
                )}
                {loadData && <Loading />}
            </Form>
        </Protected>
    )
}


const mapStateToProps = (state) => ({
    $store: {
        auth: state.auth,
        application: state.application
    }
})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUserView);