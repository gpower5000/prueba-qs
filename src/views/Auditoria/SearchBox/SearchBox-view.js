import React, { Fragment, useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { Form, Row, Col, Button } from "react-bootstrap";
import Protected from '../../../components/layout/Protected';
import { ToastNew } from "../../../components/common/Toast/ToastNew";
import { useAlert } from '../../../toolbox/hooks/alert.hook';
import ModalCentered from '../../../components/common/Modal/ModalCentered';
import Loading from "../../../components/common/Loading/Loading";
import { i_sp_svg } from "../../../providers/modules/images";
import { Helmet } from 'react-helmet';

const SearchBoxView = ({
    $store
}) => {
    const { RiFileExcel2Fill, ImSearch, BiSave, AiOutlineCloseCircle } = i_sp_svg;
    const nameView = useRef('Módulo de Auditoría - Cartones');
    const { toastManagerRef, setToastInfo, setToastWarning, setToastSuccess } = useAlert(null);
    const [loadData, setLoadData] = useState(false);
    const [dataModal, setDataModal] = useState({
        show: false,
        title: "",
        textBody: "",
        nameBtnOne: "",
        nameBtnTwo: "",
        disabled1: true,
        disabled2: true,
    });
    const [inputCarton, setInputCarton] = useState(null);
    const [outRuta, setOutRuta] = useState(null);
    const [outPedido, setOutPedido] = useState(null);
    const [outCliente, setOutCliente] = useState(null);
    const [outDireccion, setOutDireccion] = useState(null);
    const [outCarton, setOutCarton] = useState(null);
    const [inputProducto, setInputProducto] = useState(null);
    const focusCarton = useRef(null);
    const focusProducto = useRef(null);
    const [visibleBtnCancelar, setVisibleBtnCancelar] = useState(true);
    const [disabledPantalla1, setDisabledPantalla1] = useState(false);
    const [visiblePantalla2, setVisiblePantalla2] = useState(false);
    const [visiblePantalla3, setVisiblePantalla3] = useState(false);
    const [visiblePantalla4, setVisiblePantalla4] = useState(false);
    const [visiblePantalla5, setVisiblePantalla5] = useState(false);

    const handleClose = () => {
        setToastInfo("Regresar a pantalla Inicial")
    };
    const handleCloseGoTo2 = () => {
        setVisiblePantalla3(false);
        setVisiblePantalla2(true);
        setDisabledPantalla1(false);
    };

    const handleAuditStart = async () => {
        setLoadData(true);
        setVisiblePantalla3(true);
        setVisiblePantalla2(false);
        setDisabledPantalla1(true);
        setLoadData(false);
    }
    const handleAuditAbstract = async () => {
        if (inputProducto === null || inputProducto === '') {
            setToastWarning("Ingrese código Producto!!!")
        } else {
            console.log("hola producto ", inputProducto)
            if (inputProducto != '001') {
                setToastWarning('No se cuenta con datos auditados');
            } else {
                //mostrar pantalla5
                setToastInfo("Trabajando en pantalla5")
                setVisiblePantalla5(true);
            }

        }
        //no tiene datos auditados muestra mensaje " No se cuenta con datos auditados" 
        //  si cuenta con información dirige a la Pantalla 5
    }
    const handleAuditEnd = async () => {
        setDataModal({
            show: true,
            title: "Mensaje",
            textBody: "¿Desea terminar la auditoría del carton CTF0000000021?",
            nameBtnOne: "SI",
            nameBtnTwo: "NO",
            disabled1: false,
            disabled2: false,
            onClose: () => {
                setDataModal({ show: false })
            },
            onConfirm: () => {
                setDataModal({ show: false });
                clearFields();
                setVisibleBtnCancelar(true);
                setVisiblePantalla2(false);
            }
        });
    }
    const clearFields = () => {
        setInputCarton(null);
        setOutRuta(null);
        setOutPedido(null);
        setOutCliente(null);
        setOutDireccion(null);
    }
    const onKeyPressText = (event) => {
        if (event.keyCode == 13 || event.keyCode == 9) {
            if (event.target.name === "txtCarton") {
                focusCarton.current.focus();
                if (event.target.value === 'CTF0000000021') {
                    setVisiblePantalla2(true);
                    setVisibleBtnCancelar(false);
                    setOutRuta('AQP001');
                    setOutPedido('4033794211');
                    setOutCliente('BOTICA JESSFARMA E.I.R.L');
                    setOutDireccion('AV. DEFENSORES DEL MORRO NRO. 1277 (EX FABRICA LUCHETTI');
                    event.preventDefault();
                } else {
                    setToastWarning(`El producto ${event.target.value} no se encuentra en cartón!`);
                    clearFields();
                    setVisibleBtnCancelar(true);
                    setVisiblePantalla2(false);
                }
            }
            if (event.target.name === "txtProducto") {
                focusProducto.current.focus();
                if (event.target.value != null || event.target.value != '') {
                    //mostrar pantalla5
                    setToastInfo("Trabajando en pantalla5")
                    event.preventDefault();
                } else {
                    setToastWarning("Ingrese código Producto!!!")
                }

            }
        }
    }
    const onChangeListener = (event) => {
        if (event.target.name === "txtCarton") {
            setInputCarton(event.target.value);
        }
        if (event.target.name === "txtProducto") {
            setInputProducto(event.target.value);
        }
    }
    return (
        <Protected nav={true} navTo={'/'}>
            <Fragment>
                <Helmet>
                    <title>{`${$store.application.name} - ${nameView.current}`}</title>
                </Helmet>
                <ToastNew ref={toastManagerRef} />
                <div className="jumbotron text-center p-3">
                    <h2>Facility : 1119</h2>
                    <h1>{nameView.current}</h1>
                </div>
                <Form className='text-right'>
                    {disabledPantalla1 && (<Form.Group as={Row} className="col-sm-12 m-0 p-0 mb-1">
                        <Col sm="10">
                        </Col>
                        <Col sm="2">
                            <Button className="w-100 mr-0 mr-sm-3 mb-2" variant="success" onClick={() => handleCloseGoTo2()}>
                                <AiOutlineCloseCircle style={{ width: 20, height: 20 }} />
                            </Button>
                        </Col>
                    </Form.Group>)}
                    <Form.Group as={Row} >
                        <Form.Label htmlFor="txtCarton" column xs={4} sm="4" >Cartón :</Form.Label>
                        <Col xs={8} sm={8}>
                            <Form.Control
                                id="txtCarton"
                                name="txtCarton"
                                value={inputCarton || ""}
                                onChange={onChangeListener}
                                onKeyDown={onKeyPressText}
                                placeholder="Ingrese Cartón CTF0000000021"
                                type="text"
                                ref={focusCarton}
                                disabled={disabledPantalla1}
                                required
                            />
                        </Col>
                    </Form.Group>
                    {visibleBtnCancelar && (
                        <Form.Group as={Row} className="col-sm-12 m-0 p-0 mb-1">
                            <Col sm="10">
                            </Col>
                            <Col sm="2">
                                <Button className="w-100 mr-0 mr-sm-3 mb-2" variant="success" onClick={() => handleClose()}>
                                    {/* <ImSearch className="mr-2" style={{ width: 20, height: 20 }} /> */}
                                    <span>Cerrar</span>
                                </Button>
                            </Col>
                        </Form.Group>)}
                </Form>
            </Fragment>
            {visiblePantalla2 && (<Fragment >
                <Form className='text-right'>
                    <Form.Group as={Row} >
                        <Form.Label htmlFor="txtRuta" column xs={4} sm="4">Ruta :</Form.Label>
                        <Col xs={8} sm={8}>
                            <Form.Control
                                id="txtRuta"
                                name="txtRuta"
                                value={outRuta || ""}
                                type="text"
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label htmlFor="txtPedido" column xs={4} sm="4">Pedido :</Form.Label>
                        <Col xs={8} sm={8}>
                            <Form.Control
                                id="txtPedido"
                                name="txtPedido"
                                value={outPedido || ""}
                                type="text"
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label htmlFor="txtCliente" column xs={4} sm={4}>Cliente :</Form.Label>
                        <Col xs={8} sm={8}>
                            <Form.Control
                                id="txtCliente"
                                name="txtCliente"
                                as="textarea"
                                rows={2}
                                value={outCliente || ""}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label htmlFor="txtDireccion" column xs={4} sm={4}>Dirección :</Form.Label>
                        <Col xs={8} sm={8}>
                            <Form.Control
                                id="txtDireccion"
                                name="txtDireccion"
                                value={outDireccion || ""}
                                as="textarea"
                                rows={2}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="col-sm-12 col-md-12 m-0 p-0 mb-1">
                        <Col xs="12" sm="4">
                        </Col>
                        <Col xs="6" sm="4">
                            <Button className="w-100 mr-0 " variant="success" onClick={() => handleAuditStart()}>
                                {/* <RiFileExcel2Fill className="mr-2" style={{ width: 20, height: 20 }} /> */}
                                <span>Iniciar Auditoría</span>
                            </Button>
                        </Col>
                        <Col xs="6" sm="4">
                            <Button id="btn-save" className="w-100 mr-0" variant="info" onClick={() => handleAuditEnd()}>
                                {/*      <BiSave className="mr-2" style={{ width: 20, height: 20 }} /> */}
                                <span>Fin Auditoría</span>
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Fragment>)}
            {visiblePantalla3 && (<Fragment >
                <Form className='text-right'>
                    <Form.Group as={Row} >
                        <Form.Label htmlFor="txtProducto" column xs={4} sm="4">Producto :</Form.Label>
                        <Col xs={8} sm={8}>
                            <Form.Control
                                id="txtProducto"
                                name="txtProducto"
                                value={inputProducto || ""}
                                onChange={onChangeListener}
                                onKeyDown={onKeyPressText}
                                placeholder="Ingrese Código Producto 001"
                                type="text"
                                ref={focusProducto}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="col-sm-12 col-md-12 m-0 p-0 mb-1">
                        <Col xs="12" sm="4">
                        </Col>
                        <Col xs="6" sm="4">
                            <Button className="w-100 mr-0 " variant="success" onClick={() => handleAuditAbstract()}>
                                {/* <RiFileExcel2Fill className="mr-2" style={{ width: 20, height: 20 }} /> */}
                                <span>Ver Resúmen Auditoría</span>
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Fragment>)}
            {
                dataModal.show && (
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
                )
            }
            {loadData && <Loading />}
        </Protected >
    );
};
const mapStateToProps = (state) => ({
    $store: {
        auth: state.auth,
        application: state.application
    }
})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SearchBoxView);