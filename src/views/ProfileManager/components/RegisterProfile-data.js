//import { isValidRuc } from '../../toolbox/helpers/validator.helper';
export const TABLE_ROWS = 250;
export const TABLE_RULES = (formatter) => [
    {
        dataField: 'ROL_ID',
        text: 'ID',
        editable: false,
        headerStyle: {
            width: 60
        }
    },
    {
        dataField: 'DESCRIPCION_ROL',
        text: 'PERFIL',
    },
    {
        dataField: 'FEC_CREACION',
        text: 'FEC_CREACION',
    },
    {
        dataField: 'FEC_MODIFICACION',
        text: 'FEC_MODIFICACION',
    },
    {
        dataField: '__OPTIONS',
        text: 'Opción',
        formatter: formatter,
        editable: false,
        headerStyle: {
            width: 100
        },
    }
];