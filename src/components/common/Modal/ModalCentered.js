import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { i_sp_svg } from '../../../providers/modules/images';
import './ModalCentered.css';

export default function ModalCentered(props) {
  const [show, setShow] = useState(false);
  const [maximize, setMaximize] = useState(false);

  const handleMinimize = () => setMaximize(false);
  const handleMaximize = () => setMaximize(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { CgMaximizeAlt, CgMinimizeAlt } = i_sp_svg;

  useEffect(() => {
    handleShow()
  })

  const OnConfirm = () => {
    handleClose();
    props.onConfirm && props.onConfirm();
  }

  const OnCLose = () => {
    handleClose();
    props.onClose && props.onClose();
  }

  return (
    <Modal
      onHide={OnCLose}
      size={!!props.size ? props.size : "md"}
      show={props.show}
      contentClassName="c-modal-centered__rounded w-100"
      dialogClassName={maximize ? "modal-90w" : props.dialogClassName}
      aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-sm" className={props.titleCenter ? "w-100 d-flex justify-content-center row pl-3" : ""}>
          {props.title}
        </Modal.Title>
        {props.showMaximizeButton && (
          <button type="button" className="close c-modal-centered__header-button" onClick={() => setMaximize(!maximize)}>
            {maximize ? (
              <CgMinimizeAlt className="c-modal-centered__header-action" />
            ) : (
              <CgMaximizeAlt className="c-modal-centered__header-action" />
            )}
          </button>
        )}
        {props.showCloseButton && (
          <button type="button" className="close c-modal-centered__action" onClick={() => OnCLose()}>
            <span aria-hidden="true">×</span>
          </button>
        )}
      </Modal.Header>
      <Modal.Body>
        <div className={"row justify-content-center " + props.classBody}>
          {(() => {
            if (props.textBody) {
              if (Array.isArray(props.textBody)) {
                return React.Children.map(props.textBody, (child, key) => <span key={key}>{child}</span>)
              } else { return props.textBody }
            } else {
              return props.bodyContent
            }
          })()}
        </div>
      </Modal.Body>
      {props.showFooter &&
        <Modal.Footer>
          <div className={"d-flex justify-content-around w-100 m-0 " + (props.classFooter)}>
            {props.buttons ? (
              props.buttons.map(({ label, action, variant, className, id = "" }, i) => {
                return (
                  <Button
                    key={i}
                    className={"col ml-2 mr-2 " + (className)}
                    onClick={() => { action && action() }}
                    variant={!!variant ? variant : 'info'}
                    id={id}
                  >
                    {!!label ? label : 'Aceptar'}
                  </Button>
                )
              })
            ) : (
              <React.Fragment>
                {props.disabled1 === false &&
                  props.onClose != null &&
                  <Button className={"col ml-2 mr-2" + (props.classButton)} variant="outline-success" onClick={OnConfirm} >{props.nameBtnOne}</Button>
                }
                {
                  props.disabled2 === false &&
                  <Button className={"col ml-2 mr-2" + (props.classButton)} variant="outline-info" onClick={OnCLose}  >{props.nameBtnTwo}</Button>
                }
              </React.Fragment>
            )}
          </div>
        </Modal.Footer>
      }
    </Modal>
  );
}

ModalCentered.defaultProps = {
  onConfirm: () => { },
  onClose: () => { },
  titleCenter: true,
  classBody: "mb-3",
  classFooter: "",
  classButton: "",
  showFooter: true,
  showCloseButton: true,
  showMaximizeButton: false,
};
