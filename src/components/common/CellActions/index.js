import React from 'react';
import PropTypes from 'prop-types';
import { i_sp_svg }  from '../../../providers/modules/images';
import './CellActions.css';

export const CellActions = ({
    onEditRow, onDeleteRow, onDownloadRow,
    editTitle, deleteTitle, downloadTitle,
    copyStyle, deleteStyle,
    defaultEditTitle,
    defaultDeleteTitle,
    defaultDownloadTitle,
    disabledEdit,
    disabledDelete,
    disabledDownload,
}) => {

    const ddTitle = downloadTitle || defaultDownloadTitle;
    const cTitle  = editTitle || defaultEditTitle;
    const dTitle  = deleteTitle || defaultDeleteTitle;
    const { AiOutlineEdit, CgTrash, BiDownload } = i_sp_svg;

    return (
        <div className="c-cell-actions__content">
            {!disabledEdit && (
                <button
                    className="c-cell-actions__button --copy"
                    type="button"
                    title={cTitle}
                    onClick={onEditRow}
                    style={copyStyle}
                >
                    <AiOutlineEdit />
                </button>
            )}
            {!disabledDownload && (
                <button
                    className="c-cell-actions__button --copy"
                    type="button"
                    title={ddTitle}
                    onClick={onDownloadRow}
                    style={copyStyle}
                >
                    <BiDownload />
                </button>
            )}
            {!disabledDelete && (
                <button
                    className="c-cell-actions__button --delete"
                    type="button"
                    title={dTitle}
                    onClick={onDeleteRow}
                    style={deleteStyle}
                >
                    <CgTrash />
                </button>
            )}
        </div>
    );
};

CellActions.propTypes = {
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onDownloadRow: PropTypes.func,
    editTitle: PropTypes.string,
    deleteTitle: PropTypes.string,
    downloadTitle: PropTypes.string,
    copyStyle: PropTypes.any,
    deleteStyle: PropTypes.any,
    disabledEdit: PropTypes.bool,
    disabledDownload: PropTypes.bool,
};

CellActions.defaultProps = {
    defaultEditTitle: 'Editar',
    defaultDownloadTitle: 'Descargar',
    defaultDeleteTitle: 'Eliminar',
    onEditRow: () => { },
    onDeleteRow: () => { },
    onDownloadRow: () => { },
    disabledEdit: false,
    disabledDelete: false,
    disabledDownload: true,
}