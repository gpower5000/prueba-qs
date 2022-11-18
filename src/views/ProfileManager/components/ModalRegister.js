import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Row, Col, Button } from 'react-bootstrap';
import ModalCentered from '../../../components/common/Modal/ModalCentered';
import { isEmpty, isNumber } from '../../../toolbox/helpers/validator.helper';

export const FORM_RULES = {
    perfil  : {
        required: { value: true, message: 'Valor requerido' }
    }
};

export default (props) => {
    const [dataModal] = useState({
        show: props.show,
        title: props.title,
        buttons: props.buttons,
        onClose: props.onClose
    });
    const { errors, handleSubmit, control } = useForm({
        defaultValues: {
            perfil: props.data.DESCRIPCION_ROL || '',
        }
    });
    const sendData = (data) => {
        props.onConfirm({
            ROL_ID: props.data.ROL_ID || '',
            DESCRIPCION_ROL: data.perfil.toUpperCase().trim(),
        });
    }
    const handleSelectNode = (id) => {
        return document.getElementById(id);
    }
    const keyPressText = (event) => {
        const name = event.target.name;
        if (event.keyCode === 13 || event.keyCode === 9) {
            switch (name) {
                case 'perfil': {
                    handleSelectNode('btn-acept').focus();
                    handleSelectNode('btn-acept').click();
                    break;
                }
            }
            event.preventDefault();
        }
    }

    const classLabel = `col-3 col-sm-4 pl-0 pr-0 pr-sm-2
                        pl-sm-2 pr-lg-0 col-form-label mt-2`;
    const classInput = 'col-9 col-sm-8 mt-2 pr-1 pr-sm-3';

    return (
        <ModalCentered
            size="md"
            show={dataModal.show}
            title={dataModal.title}
            bodyContent={(
                <Form onSubmit={handleSubmit(sendData)} className="col-12">
                    <Form.Group as={Row} className="justify-content-center pl-1">
                        <Form.Group as={Row} className="p-0 m-0 row col-12" controlId='perfil'>
                            <Form.Label className={classLabel}>PERFIL</Form.Label>
                            <Col className={classInput}>
                                <Controller
                                    name="perfil"
                                    control={control}
                                    rules={FORM_RULES.perfil}
                                    render={(props) => (
                                        <Form.Control
                                            {...props}
                                            placeholder="Ingrese Perfil"
                                            onKeyDown={keyPressText}
                                            isInvalid={!isEmpty(errors.perfil)}
                                            maxLength={100}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {!isEmpty(errors.perfil) && errors.perfil.message}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </Form.Group>
                    <div className={"d-flex justify-content-around w-100 m-0 mt-4 " + (props.classFooter)}>
                        {props.buttons && (
                            props.buttons.map(({ label, action, variant, className, type = "button", id = "" }, i) => {
                                return (
                                    <Button
                                        key={i}
                                        className={"col ml-2 mr-2 " + (className)}
                                        onClick={() => { action && action() }}
                                        variant={!!variant ? variant : 'info'}
                                        type={type}
                                        id={id}
                                    >
                                        { !!label ? label : 'Aceptar'}
                                    </Button>
                                )
                            })
                        )}
                    </div>
                </Form>
            )}
            showFooter={false}
            classFooter="justify-content-sm-end"
            classBody="-"
            onClose={dataModal.onClose}
        />
    )
}