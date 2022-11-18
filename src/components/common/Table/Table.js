import React, { Fragment }  from 'react';
import { Form, Row, Col } from 'react-bootstrap'
//Table Editable
import BootstrapTable from 'react-bootstrap-table-next';
import CellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import './Table.css';

export default function Table(properties){
    const { SearchBar } = Search;
    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        style: { background: '#a9a9a9' },
        onSelect: (row, isSelect, rowIndex, e) => {
            if(isSelect){
                properties.onSelect(row);
            }else{
                properties.onSelect(null);
            }
        },
        onSelectAll: (isSelect, rows, e) => {
            if(isSelect){
                properties.onSelect(rows)
            }else{
                properties.onSelect(null);
            }
        }
    };

    const getPaginationProps = () => {
        if (!!properties.paginationOptions) {
            const { page, sizePerPage, totalSize } = properties.paginationOptions;
            return { page, sizePerPage, totalSize };
        } else return {}
    }

    return(
            <Fragment>
                <ToolkitProvider
                    keyField={properties.keyName}
                    data={ properties.data }
                    columns={ properties.columns }
                    search={ properties.search }
                >
                {
                    props => (
                        <div className="">
                            {
                                properties.search &&
                                <Form.Group as={Row} controlId={properties.search.formId}>
                                    <Form.Label column sm="2" xs="2">{properties.search.text}</Form.Label>
                                    <Col sm={6} xs={10}>
                                        <SearchBar { ...props.searchProps } />
                                    </Col>
                                </Form.Group>
                            }
                            <div >
                            {
                                properties.editable ?
                                    properties.onSelect ?
                                        <BootstrapTable
                                            striped
                                            bordered
                                            hover
                                            bootstrap4={true}
                                            classes={properties.addClasess ? `table table-responsive ${properties.addClasess}` : 'table table-responsive'}
                                            cellEdit={  CellEditFactory(properties.cellEdit) }
                                            noDataIndication={ () => <p>No hay datos</p> }
                                            pagination={ properties.pagination ? paginationFactory(getPaginationProps()) : undefined}
                                            remote={ properties.remote ? properties.remote: false }
                                            onTableChange= { properties.onTableChange ? properties.onTableChange: () => {} }
                                            selectRow={ selectRow }
                                            { ...props.baseProps }
                                        />
                                    :
                                        <BootstrapTable
                                            striped
                                            bordered
                                            hover
                                            bootstrap4={true}
                                            classes={properties.addClasess ? `table table-responsive ${properties.addClasess}` : 'table table-responsive'}
                                            cellEdit={  CellEditFactory(properties.cellEdit) }
                                            noDataIndication={ () => <p>No hay datos</p> }
                                            pagination={ properties.pagination ? paginationFactory(getPaginationProps()) : undefined}
                                            remote={ properties.remote ? properties.remote: false }
                                            onTableChange= { properties.onTableChange ? properties.onTableChange: () => {} }
                                            { ...props.baseProps }
                                        />
                                :
                                    properties.onSelect ?
                                        <BootstrapTable
                                            striped
                                            bordered
                                            hover
                                            bootstrap4={true}
                                            classes={properties.addClasess ? `table table-responsive ${properties.addClasess}` : 'table table-responsive'}
                                            noDataIndication={ () => <p>No hay datos</p> }
                                            { ...props.baseProps }
                                            selectRow={ selectRow }
                                            pagination={ properties.pagination ? paginationFactory(getPaginationProps()): undefined}
                                            remote={ properties.remote ? properties.remote: false }
                                            onTableChange= { properties.onTableChange ? properties.onTableChange: () => {} }
                                        />
                                    :
                                        <BootstrapTable
                                            striped
                                            bordered
                                            hover
                                            bootstrap4={true}
                                            classes={properties.addClasess ? `table-customized table-responsive ${properties.addClasess}` : 'table-customized table-responsive'}
                                            noDataIndication={ () => <p>No hay datos</p> }
                                            pagination={ properties.pagination ? paginationFactory(getPaginationProps()): undefined}
                                            remote={ properties.remote ? properties.remote: false }
                                            onTableChange= { properties.onTableChange ? properties.onTableChange: () => {} }
                                            { ...props.baseProps }
                                        />   
                            }
                            </div>
                        </div>
                    )
                }
                </ToolkitProvider>
            </Fragment>
    )
}