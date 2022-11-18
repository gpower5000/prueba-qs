import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { useForm, Controller } from 'react-hook-form';
import { Form, Col, Row, Button } from "react-bootstrap";
import { i_sp_svg } from "../../../providers/modules/images";
import { Select, prettySelectConfig } from "../../../components/common/Select";
import { PanelCompare } from '../../../components/common/PanelcompareList/PanelcompareList.component';
import ModalCentered from '../../../components/common/Modal/ModalCentered';

import { apiGetModules, apiGetModulesByProfile, apiIUProfile } from '../../../services/http/profile.service';

import {
    apiGetAllRoles
} from '../../../services/http/role.service';

const RegisterUserView = (props) => {
    const alertMessage = 'Error en cargar los datos';
    const [profileList, setProfileList] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [moduleProfile, setModuleProfile] = useState([]);
    const [disabledForm, setDisabledForm] = useState(true);
    const [disabledSearch, setDisabledSearch] = useState(false);
    const [disabledModule, setDisabledModule] = useState(true);
    const [disabledChecks, setDisableChecks]  = useState(true);

    const currentModules                      = useRef({});
    const currentModuleSelected               = useRef([]);
    const currentModuleId                     = useRef('');

    const initialChecks = {
        ACCION_I: false,
        ACCION_U : false,
        ACCION_D : false,
        ACCION_S : false,
    }
    const setToastInfo    = props.setToastInfo;
    const setToastSuccess = props.setToastSuccess;
    const setToastWarning = props.setToastWarning;
    const setLoadData     = props.setLoadData;

    const [stateChecks, setStateChecks] = useState({...initialChecks});
    const [dataModeForm, setDataModeForm] = useState('UPDATE');
    const profileRef = useRef(null);

    const { errors, control, handleSubmit, reset: resetSearch, setError, getValues, setValue } = useForm({
        defaultValues: {
            txtUser: '',
            txtPassword: '',
            txtNames: '',
            txtFirstName: '',
            txtLastName: '',
            txtProfile: '',
            txtState: '',
            txtCompany: ''
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
    const checkboxes = [
        { label: 'Insertar', name: 'ACCION_I' }, 
        { label: 'Actualizar', name: 'ACCION_U' },
        { label: 'Eliminar', name: 'ACCION_D' },
        { label: 'Consultar', name: 'ACCION_S' },
    ]

    const handleClean = () => {
        resetSearch();
        setModuleProfile([]);
        setDisabledModule(true);
        setDisableChecks(true);
        currentModuleId.current = '';
        currentModules.current = {};
        currentModuleSelected.current = [];
        setStateChecks({...initialChecks});
    }
    const handleSaveProfile = (data) => {
        const profile = getValues('txtProfile');
        const modules = currentModuleSelected.current.map( item => {
            if (!!currentModules.current[item.MODULO_ID+'-'+item.VISTA_ID]) {
                return {
                    ...item,
                    ...currentModules.current[item.MODULO_ID+'-'+item.VISTA_ID]
                }
            } else return { ...item };
        }).map(item => (
            {
                ...item,
                // actionInsert: !!item.ACCION_I ? 'X' : null,
                // actionUpdate: !!item.ACCION_U ? 'X' : null,
                // actionDelete: !!item.ACCION_D ? 'X' : null,
                // actionSearch: !!item.ACCION_S ? 'X' : null,
                actionInsert: 'X',
                actionUpdate: 'X',
                actionDelete: 'X',
                actionSearch: 'X',
            }
        ));

        setLoadData(true);
        apiIUProfile({
            rolId: profile === null ? null : profile.value,
            rolDescription: profile === null ? null : (profile.value === '' ? profile.label.split('-')[0].toUpperCase() : profile.label.split('-')[1].toUpperCase() ),
            mode: dataModeForm === 'INSERT' ? 'I' : 'U',
            modules: modules
        }).then( (rpta) => {
            setLoadData(false);
            if (rpta.STATUS_RECORD) {
                handleClean();
                setProfileList([]);
                setToastSuccess(rpta.MESSAGE_RECORD);
                setDisabledSearch(false);
                setDisabledForm(true);
                apiGetAllRoles()
                    .then( data => setProfileList(prettySelectConfig(data, ['ROL_ID','DESCRIPCION_ROL'], 'ROL_ID')) );
            } else { setToastWarning(rpta.MESSAGE_RECORD) }
        }).catch((err) => {
            setLoadData(false);
            setToastWarning('Ocurrió un error al momento de guardar el perfil');
        })
    }
    const handleCancelForm = () => {
        setDataModal({
            show: true,
            title: "ATENCIÓN",
            textBody: "¿Desea cancelar el proceso que está pendiente?. Perderá todo sus avances.",
            nameBtnOne: "Aceptar",
            nameBtnTwo: "Cancelar",
            disabled1: false,
            disabled2: false,
            onClose: () => {
                setDataModal({show: false})
            },
            onConfirm: () => {
                handleClean();
                setDataModal({show: false})
                setDisabledSearch(false);
                setDisabledForm(true);
            }
        });
    }
    const handleSaveForm = (data) => {
        setDataModal({
            show: true,
            title: "MENSAJE",
            textBody: "¿Desea efecturar los cambios realizados?",
            nameBtnOne: "Aceptar",
            nameBtnTwo: "Cancelar",
            disabled1: false,
            disabled2: false,
            onClose: () => {
                setDataModal({show: false});
            },
            onConfirm: () => {
                handleSaveProfile(data);
                setDataModal({show: false});
            }
        });
    }
    const handleSelectProfile = (value) => {
        const profile = value || getValues('txtProfile');
        if (!profile) {
            return setToastWarning('Seleccione Perfil');
        }
        setModuleProfile([]);
        currentModuleId.current = '';
        currentModuleSelected.current = [];
        currentModules.current = {};
        setStateChecks({...initialChecks});
        setDisableChecks(true);
        setDisabledSearch(true);
        setDisabledForm(true);
        setDisabledModule(true);
        setLoadData(true);

        apiGetModulesByProfile({
            rolId: profile === null ? null : profile.value
        }).then(modules => {
            currentModuleSelected.current = modules;
            modules.forEach( module => {
                currentModules.current[module.MODULO_ID+'-'+module.MODULO_DET_ID] = {
                    ACCION_I : module.ACCION_I == 'X',
                    ACCION_U : module.ACCION_U == 'X',
                    ACCION_D : module.ACCION_D == 'X',
                    ACCION_S : module.ACCION_S == 'X',
                };
            })
            setModuleProfile(modules);
            setDisabledSearch(true);
            setDisabledForm(false);
            setDisabledModule(false);
            setLoadData(false);
        }).catch((gaa) => {
            setToastWarning('Problemas al traer las pantallas asignadas');
            setDisabledSearch(false);
            setDisabledForm(true);
            setDisabledModule(true);
            setLoadData(false);
        });
    }
    const onEditChecks = (moduleId) => {
        if (moduleId === false) {
            setDisableChecks(true);
            setStateChecks({ ...initialChecks });
            currentModuleId.current = '';
        } else {
            setDisableChecks(false);
            currentModuleId.current = moduleId;
            const [ module ] = moduleProfile.filter((item) => {
                if(item.MODULO_ID+'-'+item.VISTA_ID === moduleId.toString()) {
                    return true;
                } return false;
            });
            if(!!currentModules.current[moduleId]) {
                setStateChecks({ ...currentModules.current[moduleId] });
            } else {
                if (!!module) {
                    currentModules.current[moduleId] = {
                        ACCION_I : module.ACCION_I == 'X',
                        ACCION_U : module.ACCION_U == 'X',
                        ACCION_D : module.ACCION_D == 'X',
                        ACCION_S : module.ACCION_S == 'X',
                    };
                    setStateChecks({ ...currentModules.current[moduleId] });
                } else {
                    currentModules.current[moduleId] = {...initialChecks}
                    setStateChecks({ ...currentModules.current[moduleId] });
                }
            }
        }
    }
    const handleChange = (event) => {
        const checks = { ...stateChecks, [event.target.name]: event.target.checked };
        currentModules.current[currentModuleId.current] = checks;
        setStateChecks(checks);
    };
    const handleSelectNode = (id) => {
        return document.getElementById(id)
    }
    const keyPressText = (event) => {
        const name = event.target.name;
        if (event.keyCode === 13 || event.keyCode === 9) {
            switch (name) {
                case 'placaVehiculo': handleSelectNode('formRucTransport').focus(); break;
                case 'rucTransportista': handleSelectNode('formRemolque').focus(); break;
                case 'nroRemolque': {
                    handleSelectNode('btn-acept').focus();
                    handleSelectNode('btn-acept').click();
                    break;
                }
            }
            event.preventDefault();
        }
    }

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        console.log("ver]_cancel_token ",CancelToken);
        const source = CancelToken.source();
        console.log("ver source ********* ",source);
        const source2 = CancelToken.source();
        console.log("ver source2 ********* ",source2);
        const init = () => {
            apiGetAllRoles({ cancelToken: source.token })
                .then(rpta => setProfileList(prettySelectConfig(rpta, ['ROL_ID','DESCRIPCION_ROL'], 'ROL_ID')))
                .catch(() => setToastWarning(alertMessage+' de Perfiles'));
            apiGetModules({ cancelToken: source2.token })
                .then(rpta => setModuleList(rpta || []))
                .catch(() => setToastWarning(alertMessage+' de Módulos'));
        }

        init();

        return () => {
            source.cancel();
        }
    }, []);

    return (
        <React.Fragment>
            <Form.Group as={Row} className="justify-content-center">
                <Col sm="12" lg="11" className="mb-0">
                    <Form.Group as={Row}>
                        <Form.Group as={Row} className="col-sm-8 m-0 p-0 mb-0" controlId='formProfile'>
                            <Form.Label column sm="5" className="mb-1">
                                Perfil : 
                            </Form.Label>
                            <Col sm="7" className="p-1">
                                {dataModeForm === 'INSERT' ? (
                                    <Controller
                                        name    = "txtProfile"
                                        control = {control}
                                        render  = {(props) => {
                                            return <Form.Control
                                                {...props}
                                                placeholder = "Ingrese nuevo Perfil"
                                                onKeyDown   = {keyPressText}
                                                // disabled    = {disabledSearch}
                                                value       = {!!props.value ? props.value.label.split('-')[1] : ''}
                                                onChange    = {(e) => {
                                                    props.onChange({
                                                        label: e.target.value,
                                                        value: ''
                                                    })}
                                                }
                                            />
                                        }}
                                    />
                                ) : (
                                    <Controller
                                        as={
                                            React.forwardRef((props, ref) => {
                                                return <Select ref={profileRef} {...props}
                                                            defaultValue={null}
                                                            onChange={(e)=>{
                                                                props.onChange(e)
                                                                handleSelectProfile(e);
                                                            }}
                                                        />
                                            })
                                        }
                                        aria-label="txtProfile"
                                        name="txtProfile"
                                        onKeyDown={keyPressText}
                                        options={profileList}
                                        control={control}
                                        isClearable={true}
                                        // isDisabled={disabledSearch}
                                    />
                                )}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-0">
                            {/* <Col sm="6">
                                {dataModeForm === 'INSERT' ? (
                                    <Button 
                                        className="w-100 mr-0 mr-sm-3 mb-2" variant="outline-secondary"
                                        onClick={() => setDataModeForm('UPDATE')}
                                        disabled={disabledSearch}
                                    >
                                        <ImSearch className="mr-2"  style={{ width: 20, height: 20 }} />
                                        <span>Buscar</span>
                                    </Button>
                                ) : (
                                    <Button 
                                        className="w-100 mr-0 mr-sm-3 mb-2" variant="outline-secondary"
                                        onClick={() => setDataModeForm('INSERT')}
                                        disabled={disabledSearch}
                                    >
                                        <RiChatNewLine className="mr-2" style={{ width: 20, height: 20 }} />
                                        <span>Nuevo</span>
                                    </Button>
                                )}
                            </Col>
                            <Col sm="6">
                                <Button
                                    type="submit"
                                    className="w-100 mr-0 mr-sm-3 mb-2"
                                    variant="success"
                                    onClick={() => handleSelectProfile()}
                                    disabled={disabledSearch}
                                >
                                    <AiOutlineSelect className="mr-2" style={{ width: 20, height: 20 }} />
                                    <span>Seleccionar</span>
                                </Button>
                            </Col> */}
                        </Form.Group>
                    </Form.Group>
                </Col>
                <Col sm="12" lg="11" className="v-bg-gray pb-1" />
            </Form.Group>
            <Form.Group as={Row} className="justify-content-center">
                <Col sm="12" lg="11" className="pl-4 pr-4 mb-1">
                    <h6 className="m-0 p-0 mb-2">Pantallas asignadas</h6>
                </Col>
                <Col sm="12" lg="11" className="pl-4 pr-4 mb-1" style={{height: 'calc(100vh - 330px)'}}>
                    <PanelCompare
                        dataOne={moduleList}
                        dataTwo={moduleProfile}
                        treeFormat = {{
                            id   : 'MODULO_ID',
                            name : 'DESC_MODULO',
                            uuid : ['MODULO_ID'],
                            defaultOpen : true,
                            children : {
                                id   : 'VISTA_ID',
                                name : 'DESC_VISTA',
                                uuid : ['MODULO_ID','VISTA_ID']
                            }
                        }}
                        treeParent = {{
                            id: 'ALL_ROUTERS',
                            name: 'Gestión de Pantallas'
                        }}
                        multiSelect = {true}
                        lastChildrenTree = {['MODULO_ID','VISTA_ID']}
                        defaultExpanded = {['ALL_ROUTERS']}
                        onSelectMenu = { (menuSelected) => {
                            currentModuleSelected.current = menuSelected;
                        }}
                        treeConcat = {'-'}
                        onModeSelect = {onEditChecks}
                        loading = {!disabledModule}
                    />
                </Col>
                <Col sm="12" lg="11" className="mb-3">
                    {/* <h6>Acciones permitidas por vista</h6>
                    {checkboxes.map( item => (
                        <Form.Check
                            custom
                            inline
                            label={item.label}
                            key={item.name}
                            checked = {stateChecks[item.name]}
                            disabled = {disabledChecks}
                            type={'checkbox'}
                            id={item.name}
                            name={item.name}
                            onChange={handleChange}
                        />
                    ))} */}
                </Col>
                <Col sm="12" lg="11" className="mb-0">
                    <Form.Group as={Row} className="justify-content-end">
                        <Form.Group as={Row} className="col-sm-6 m-0 p-0 mb-1 justify-content-end">
                            {/* <Col sm="6">
                                <Button 
                                    className="w-100 mr-0 mr-sm-3 mb-2" variant="outline-secondary"
                                    onClick={() => handleCancelForm()}
                                    disabled={disabledForm}
                                >
                                    <ImCancelCircle className="mr-2" style={{ width: 20, height: 20 }} />
                                    <span>Cancelar</span>
                                </Button>
                            </Col> */}
                            <Col sm="6">
                                <Button
                                    type="submit"
                                    className="w-100 mr-0 mr-sm-3 mb-2"
                                    variant="success"
                                    onClick={() => handleSaveForm()}
                                    disabled={disabledForm}
                                >
                                    <i_sp_svg.BiSave className="mr-2" style={{ width: 20, height: 20 }} />
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
        </React.Fragment>
    )
}


const mapStateToProps = (state) => ({
    $store: {
        application: state.application
    }
})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUserView);