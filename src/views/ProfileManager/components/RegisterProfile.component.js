import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from "react-redux";
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { i_sp_svg } from '../../../providers/modules/images';
import ModalCentered from '../../../components/common/Modal/ModalCentered';
//Table Editable
import EditTable from '../../../components/common/Table/Table';
import { CellActions } from '../../../components/common/CellActions';
import ModalRegister from './ModalRegister';
import { TABLE_ROWS, TABLE_RULES } from './RegisterProfile-data'
import {
    apiGetAllProfile,
    downloadExcelFile,
    apiGetProfileById,
    apiSaveProfile,
    apiUpdateProfile,
    apiDeleteProfile,
} from '../../../services/http/profile.service';

const RegisterProfile = ({
  setToastSuccess,
  setToastWarning,
  setToastInfo,
  setLoadData,
  $store: { application }
}) => {
    const nameView = useRef('Registro de Perfiles');
    const alertMessage = 'Error en cargar los listados';
    const defaultSearch = {
        local: '',
        lengthRows: TABLE_ROWS
    };

    const defaultPagProps = {
        page: 1, sizePerPage: 10, totalSize: 0
    }
    const configSearch = useRef({ ...defaultSearch });
    const [pagProps, setPagProps] = useState({ ...defaultPagProps })
    const [dataProfile, setDataProfile] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [dataModal, setDataModal] = useState({
        show: false,
        size: 'sm',
        title: 'Alerta',
        description: '¿Desea cancelar sus cambios?',
        buttons: []
    });
    const [dataModalReg, setDataModalReg] = useState({
        show: false,
        title: 'Registro de Perfiles',
        buttons: [],
        data: {}
    })

    const { handleSubmit, reset: resetSearch } = useForm({
        defaultValues: defaultSearch
    });
    const { ImSearch, BiEraser } = i_sp_svg;
    const lengthRows = TABLE_ROWS;
    const columnsTable = TABLE_RULES((_, row) => (
        <CellActions
            onEditRow={() => onEditRow(row)}
            onDeleteRow={() => onDeleteRow(row)}
        />
    ));

    const handleResetFilter = () => {
        resetSearch();
        setPagProps({ ...defaultPagProps });
        setDataTable([]);
        setDataProfile([]);
        configSearch.current = { ...defaultSearch };
    }

    const getProfileData = (data, fnBeforeRequest, fnAfterRequest) => {
        fnBeforeRequest && fnBeforeRequest();
        const params = {
            page_number: data.pageNumber,
            page_size: lengthRows
        } 

        apiGetAllProfile(params).then((rpta) => {
            fnAfterRequest && fnAfterRequest(rpta);
        }).catch((err) => {
            setLoadData(false);
            setToastWarning(alertMessage);
        }) 
    }

    const handleSearch = (data, e) => {
        configSearch.current = {
            ...data,
            pageNumber: 1,
            lengthRows: lengthRows
        };
        getProfileData(configSearch.current, () => {
            setLoadData(true);
        }, (rpta) => {
            setLoadData(false);
            if (rpta.length === 0) {
                setPagProps({ ...defaultPagProps });
                setDataTable([]);
                setDataProfile([]);
            } else {
                changeRowData(rpta);
            }
        });
    }

    const handleChangeModal = (newModal = {}, prevModal = dataModal, setModal = setDataModal) => {
        delete prevModal.data;
        setModal({
            data: {},
            ...prevModal,
            ...newModal
        })
    }

    useEffect(() => {
        handleSearch(defaultSearch);
    }, []);

    const addNewRow = () => {
        handleChangeModal({
            show: true,
            title: 'Registrar Perfil',
            buttons: [{
                id: 'btn-acept',
                label: 'Aceptar',
                variant: 'outline-success',
                type: 'submit',
            }, {
                label: 'Cancelar',
                variant: 'outline-secondary',
                action: () => handleChangeModal({ show: false }, dataModalReg, setDataModalReg)
            }],
            onConfirm: (newRow) => {
                setLoadData(true);
                apiSaveProfile({
                    perfilId: newRow.ROL_ID,
                    perfil: newRow.DESCRIPCION_ROL,
                }).then((rpta) => {
                    const status = !!rpta.Resp.data ? rpta.status : false;
                    const message = rpta.Resp.message;
                    if (status) {
                        handleChangeModal({ show: false }, dataModalReg, setDataModalReg)
                        setLoadData(true);
                        setToastSuccess(message);
                        getProfileData(configSearch.current, null, regs => {
                            setLoadData(false);
                            changeRowData(regs);
                        })
                    } else {
                        setLoadData(false);
                        setToastWarning(message);
                    }
                });
            },
            onClose: () => handleChangeModal({ show: false }, dataModalReg, setDataModalReg)
        }, dataModalReg, setDataModalReg)
    }

    const onEditRow = (item) => {
        setLoadData(true);
        apiGetProfileById({
             id: item.ROL_ID
        }).then(rows => {
            if (Array.isArray(rows) && rows.length === 0) {
                setToastWarning('No puede editar un registro eliminado');
                setLoadData(true);
                getProfileData(configSearch.current, null, regs => {
                    setLoadData(false);
                    changeRowData(regs);
                }); return;
            }
            setLoadData(false);
            if (rows === '') {
                setToastWarning('Error en traer registro'); return;
            }
            const [row] = rows;
            handleChangeModal({
                show: true,
                title: 'Editar Perfil',
                buttons: [{
                    id: 'btn-acept',
                    label: 'Aceptar',
                    variant: 'outline-success',
                    type: 'submit',
                }, {
                    label: 'Cancelar',
                    variant: 'outline-secondary',
                    action: () => handleChangeModal({ show: false }, dataModalReg, setDataModalReg)
                }],
                onConfirm: (newRow) => {
                    console.log('>>>> newRow', newRow);
                    setLoadData(true);
                    apiUpdateProfile(item.ROL_ID, {
                        perfilId: newRow.ROL_ID,
                        perfil: newRow.DESCRIPCION_ROL
                    }).then((rpta) => {
                        const status = !!rpta.Resp.data ? rpta.status : false;
                        const message = rpta.Resp.message;
                        if (status) {
                            setToastSuccess(message);
                            handleChangeModal({ show: false }, dataModalReg, setDataModalReg)
                            getProfileData(configSearch.current, null, regs => {
                                changeRowData(regs);
                            });
                        } else {
                            setToastWarning(message);
                        }
                        setLoadData(false);
                    });
                },
                data: { ...row, mode: 'EDIT_ROW' },
                onClose: () => handleChangeModal({ show: false }, dataModalReg, setDataModalReg)
            }, dataModalReg, setDataModalReg)
        }).catch((aa) => {
            setLoadData(false);
            setToastWarning('Error en traer la data');
        });
    }

    const onDeleteRow = (row) => {

        const action = () => {
            apiDeleteProfile({
                id: row.ROL_ID
            }).then((rpta) => {
                const status = !!rpta.Resp.data ? rpta.status : false;
                const message = rpta.Resp.message;
                if (status) {
                    setToastSuccess('Perfil eliminado');
                    getProfileData(configSearch.current, null, regs => {
                        changeRowData(regs);
                    });
                } else {
                    setToastWarning(message);
                }
            }).catch((err) => {
                setToastWarning('Error al Eliminar los datos');
            });
        }

        handleChangeModal({
            show: true,
            title: 'Alerta',
            size: 'sm',
            description: [
                <span>¿Estás seguro/a de eliminar el Perfil: <span><b>{row.DESCRIPCION_ROL}</b></span> ?</span>,
                <span style={{
                    display: 'inline-block',
                    marginTop: '5px',
                    lineHeight: '16px',
                    fontSize: 14,
                    color: 'red'
                }}>El perfil a eliminar no debe estar asociado a un usuario.</span>
            ],
            classBody: 'text-center',
            buttons: [{
                id: 'btn-acept',
                label: 'Aceptar',
                variant: 'outline-success',
                action: () => {
                    handleChangeModal({ show: false })
                    action()
                }
            }, {
                id: 'btn-cancel',
                label: 'Cancelar',
                variant: 'outline-secondary',
                action: () => handleChangeModal({ show: false })
            }]
        })
    }

    const changeRowData = (data, pagProps = defaultPagProps, loadData = true) => {
        const newData = data.map((item, i) => {
            item.pos = i + 1;
            return item;
        })
        setPagProps({
            ...pagProps, totalSize: data.length
        });
        loadData && setDataProfile(newData);
        const { page, sizePerPage } = pagProps;
        const currentIndex = (page - 1) * sizePerPage;
        setTimeout(() => {
            setDataTable(newData.slice(currentIndex, currentIndex + sizePerPage));
        }, 0);
    }

    const handleError = (data, e) => {
        const val = Object.values(data).map(({ message }) => message);
        if (val.length > 0) {
            setToastWarning(val.join(', '));
        }
    }

    const handleDownloadFile = async (pageNumber = 1) => {
        setLoadData(true);
        const rpta = await downloadExcelFile({
            ...configSearch.current,
            page_number: pageNumber,
            page_size: 500000
        });
        setLoadData(false);
        if (rpta === false) {
            if (pageNumber === 1) {
                setToastWarning('No se pudo descargar archivo');
            } else {
                setToastInfo('No hay más registros a descargar');
            }
        } else {
            setToastSuccess('Archivo descargado');
            setTimeout(() => {
                handleDownloadFile(pageNumber + 1);
            }, 2 * 1000);
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${application.name} - ${nameView.current}`}</title>
            </Helmet>
            <div className="v-bg-gray" style={{
                paddingTop: 10,
                marginTop: -10,
                height: 'calc(100vh - 155px)',
                overflow: 'auto'
            }}>
                <Form
                    onSubmit={handleSubmit(handleSearch, handleError)}
                >
                    <Form.Group as={Row} className="justify-content-center">
                        <Col lg={10}>
                            <Form.Group className="panel-shadown pb-2 pl-1 pl-sm-2 pl-lg-3 row m-0">

                                <Col as={Row} className="col-12 mt-2 pl-lg-0 pl-sm-1">
                                    <Col sm={6} lg={4} className="d-flex justify-content-between p-0 mb-2 mb-sm-0">
                                        <Button className="w-100 mr-2" variant="warning" id="btnNewRegister" onClick={addNewRow}>
                                            <i_sp_svg.RiChatNewLine className="mr-2" style={{ width: 20, height: 20 }} />
                                            <span>Nuevo</span>
                                        </Button>
                                        <Button className="w-100 ml-2 mr-0 mr-sm-3" variant="success" onClick={() => handleDownloadFile(1)}>
                                            <i_sp_svg.RiFileExcel2Fill className="mr-2" style={{ width: 20, height: 20 }} />
                                            <span>Excel</span>
                                        </Button>
                                    </Col>
                                    <Col sm={6} lg={4} className="p-0 d-none d-lg-flex" style={{ opacity: 0 }}>{' .'}</Col>
                                    <Col sm={6} lg={4} className="d-flex justify-content-between p-0">
                                        <Button className="w-50 mr-2 ml-0 ml-sm-3" variant="info" type="submit" id="btnSearch">
                                            <ImSearch className="mr-2" style={{ width: 18, height: 18 }} />
                                            <span>Buscar</span>
                                        </Button>
                                        <Button className="w-50 ml-2" variant="success" onClick={handleResetFilter}>
                                            <BiEraser className="mr-2" style={{ width: 22, height: 22 }} />
                                            <span>Limpiar</span>
                                        </Button>
                                    </Col>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-2">
                        <Col lg={12} className="d-flex justify-content-center">
                            <Col lg={10} className="p-0" style={{ background: 'var(--white-color)' }}>
                                <EditTable
                                    keyName="ROL_ID"
                                    data={dataTable}
                                    editable={false}
                                    columns={columnsTable}
                                    pagination={true}
                                    search={false}
                                    remote={true}
                                    paginationOptions={pagProps}
                                    onTableChange={(type, { page, sizePerPage }) => {
                                        if (dataProfile.length === 0) {
                                            setPagProps({
                                                page, sizePerPage, lengthRows: 0
                                            })
                                            return;
                                        }
                                        if (dataProfile.length % TABLE_ROWS === 0 && page >= dataProfile.length / sizePerPage) {
                                            configSearch.current.pageNumber = configSearch.current.pageNumber + 1;
                                            getProfileData(configSearch.current, null, regs => {
                                                setLoadData(false);
                                                changeRowData(dataProfile.concat(regs), { page, sizePerPage });
                                            })
                                        } else {
                                            changeRowData(dataProfile, { page, sizePerPage }, false);
                                        }
                                    }}
                                />
                            </Col>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
            {dataModal.show &&
                <ModalCentered
                    show={dataModal.show}
                    size={dataModal.size}
                    title={dataModal.title}
                    textBody={dataModal.description}
                    buttons={dataModal.buttons}
                    onClose={() => handleChangeModal({ show: false })}
                />
            }
            {dataModalReg.show &&
                <ModalRegister {...dataModalReg} />
            }
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    $store: {
        application: state.application
    }
})
const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProfile);