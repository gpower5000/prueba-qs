import React from "react";
import { Column, Table, AutoSizer, SortDirection } from "react-virtualized";
import lodash from "lodash";
import PropTypes from 'prop-types';
import Draggable from "react-draggable";
import { i_sp_svg } from '../../providers/modules/images';
import { Popover, OverlayTrigger, Button, Form } from 'react-bootstrap';
import { LinearProgress } from '../LinearProgress';
import { ControlledPagination }  from '../ControlledPagination/ControlledPagination';
import { MSG_SUCCESS_RESULT, CODE_DELETE_RESULT, API_DATE_FORMAT } from '../../../toolbox/config';
import { convertExcelDateToJSDate } from '../../../toolbox/helpers/date.helper';
import { isEmpty } from "../../../toolbox/helpers/validator.helper";

import "react-virtualized/styles.css";
import './ResizeVirtualizedTable.css';

const TOTAL_WIDTH = 200;
const POS_WIDTH   = 0.05;
const POST_ID     = '_';
const SELECT_WIDTH = 0.04;
const SELECT_ID    = '__SELECT__';

const initWidth = (columns,cl,currentCl) => {
    const obj  = { [POST_ID]: POS_WIDTH, [SELECT_ID] : SELECT_WIDTH };
    let length = 0;
    columns.forEach(item => (item.showTable !== false ) && length++ );
    columns.forEach(item => {
        const { id, width, showTable } = item;
        if (showTable !== false) {
            obj[id] = !!width ? width : 1 / length;
            cl.push(item);
            currentCl.push(item);
        }
    });
    return obj;
}

const initStatusWidth = columns => {
    const obj = {};
    columns.forEach(({ id, showTable }) => {
        if (showTable !== false) { obj[id] = true; }
    });
    return obj;
}

export const changePageHelper = (data,lengthRows,page) => {
    return data.slice((page-1 < 0 ? 0 : page-1)*lengthRows,page*lengthRows)
}

const { MdModeEdit, IoMdTrash, IoMdArrowDropup } = i_sp_svg;
const ACTION_SORTING  = 'ACTION_SORTING';
const ACTION_DRAGGING = 'ACTION_DRAGGING';

export class VirtualizedTable extends React.Component {
    componentRef  = React.createRef();
    popoverRef    = React.createRef();
    paginationRef = React.createRef();
    columns       = [];
    currentColumn = [];
    listData      = [];
    tempListData  = [];
    selectedIds   = [];
    selectedRows  = [];
    state = {
        widths: initWidth(this.props.columns,this.columns,this.currentColumn),
        sortBy: '_',
        action: null,
        sortDirection: SortDirection.ASC,
        currentPage: this.props.defaultPage,
        selectedIds: [],
    };
    statusSwitch = initStatusWidth(this.props.columns);

    resetPage() {
        if (!!this.paginationRef) {
            this.selectedRows = [];
            this.paginationRef.current && this.paginationRef.current.resetPage();
            this.setState({ currentPage: this.props.defaultPage, selectedIds: [] });
        }
    }
    resetSelect() {
        this.selectedIds = [];
        this.selectedRows = [];
        this.setState({selectedIds: []});
    }

    isShowPagination(props = this.props) {
        return (props.showPagination && props.pages > 0)
    }

    updateColumns(props) {
        if (JSON.stringify(props) !== JSON.stringify(this.props)) {
            this.columns = [];
            this.currentColumn = [];
            this.statusSwitch  = initStatusWidth(props.columns);
            this.setState({
                widths: initWidth(props.columns,this.columns,this.currentColumn)
            })
        }
    }

    shouldComponentUpdate(props,state) {
        if (!!this.componentRef.current) {
            var dm = this.componentRef.current;
            var s1 = dm.getElementsByClassName("ReactVirtualized__Grid")[0];
            var s4 = dm.getElementsByClassName("c-resize-virtualize")[0];
            var s2 = dm.getElementsByClassName("ReactVirtualized__Table__headerRow")[0];
            var s3 = dm.getElementsByClassName("c-resize-virtualize__parent-loading")[0];
            const classScrooling = " _headerScrolling";
            const classEmptyGrid = " _emptyGridTable";
    
            const select_scroll_1 = () => {
                s2.scrollLeft = s1.scrollLeft;
                if (s1.scrollTop > 0) {
                    s2.className = s2.className.replace(classScrooling, "") + classScrooling;
                    s3.style.height = props.headerHeight+'px';
                } else {
                    s2.className = s2.className.replace(classScrooling, "");
                    s3.style.height = props.headerHeight-1+'px';
                }
            };
            const select_scroll_2 = () => {};
    
            s1.addEventListener("scroll", select_scroll_1, false);
            s2.addEventListener("scroll", select_scroll_2, false);
            
            if (props.list.length === 0) {
                s1.className = s1.className.replace(classEmptyGrid, "") + classEmptyGrid;
            } else {
                s1.className = s1.className.replace(classEmptyGrid, "");
            }
        }

        if (!lodash.isEqual(this.props.list, props.list)) {
            this.listData = this._sortList(this.state, props.list);
            if (this.isShowPagination(props)) {
                this.tempListData = changePageHelper(
                    this.listData, props.lengthRows, state.currentPage
                )
            } else { this.tempListData = this.listData; }
            return true;
        }
        if (JSON.stringify(this.state) !== JSON.stringify(state)) {
            return true;
        }
        const thisProps = {};
        const prevProps = {};
        Object.keys(props).forEach( key => {
            if (key !== 'list') {
                thisProps[key] = this.props[key];
                prevProps[key] = props[key];
            }
        });
        if (JSON.stringify(thisProps) !== JSON.stringify(prevProps)) {
            return true;
        }
        return false;
    }

    render() {
        let { rowHeight, headerHeight } = this.props;
        let list         = this.tempListData.filter( item => !!item );
        const maxRows    = this.listData.filter( item => {
            if (!!item) {
                if (item.__fake__) {
                    return false;
                } return true;
            } return false;
        }).length;
        const listLenght = list.length;
        const { widths } = this.state;
        const paddingTop = (rowHeight - 22) / 2;
        const hPaddingTop = (headerHeight - 22) / 2;
        list = list.length === 0 ? [{ __fake__: true }] : list;

        return (
            <React.Fragment>
                <div style={this.props.styleContent}>
                    <div style={{display:'flex'}}>
                        <OverlayTrigger trigger="click" rootClose placement="right" 
                            overlay={
                                <Popover className={`c-resize-virtualize__popover-right`}>
                                    <Popover.Title as="h3">{`Columnas Tabla`}</Popover.Title>
                                    <Popover.Content>
                                        <Form>
                                            {
                                                this.columns.map((item,index)=>{
                                                    return(
                                                        <Form.Check 
                                                            key={index}
                                                            type="switch"
                                                            id={`swich_${item.id}`}
                                                            checked={this.statusSwitch[item.id]}
                                                            onChange={this._changeColumns}
                                                            label={`${item.label}`}
                                                        />
                                                    )
                                                })
                                            }
                                        </Form>
                                    </Popover.Content>
                                </Popover>
                            }
                        >
                            <Button variant="secondary" className="btn-sm c-resize-virtualized-table__option_button" >...</Button>
                        </OverlayTrigger>
                        <div className="c-resize-virtualize__content-button">
                            <span><b>{listLenght}</b>{maxRows ? <> de <b>{maxRows}</b></> : ''} Filas seleccionadas ...</span>
                        </div>
                    </div>
                    <div ref={this.componentRef} className={"c-resize-virtualize__content"+ (this.isShowPagination() ? ' --with-pagination' : '')} >
                        <div className="c-resize-virtualize__parent-loading"
                            style={{height: headerHeight-1}}>
                            <LinearProgress finish = {!this.props.loadTable} />
                        </div>
                        <AutoSizer style={{ width: "100%", height: "100%" }} disableWidth={true} >
                            {({ height }) => (
                                <Table
                                    className     = {"c-resize-virtualize" + (this.isShowPagination() ? ' --with-pagination': '')}
                                    width         = {TOTAL_WIDTH}
                                    height        = {height}
                                    headerHeight  = {headerHeight}
                                    rowHeight     = {rowHeight}
                                    rowCount      = {list.length}
                                    rowGetter     = {({ index }) => list[index]}
                                    sort          = {this._sort}
                                    onRowMouseOut = {()=>{}}
                                    sortBy        = {this.state.sortBy}
                                    sortDirection = {this.state.sortDirection}
                                >
                                    <Column
                                        headerRenderer  = { ({sortBy,sortDirection}) => this._headerRenderer({dataKey: POST_ID, label: 'Pos', sortBy,sortDirection },hPaddingTop)}
                                        cellRenderer    = {({rowData, rowIndex}) => 
                                            this._cellRenderer({
                                                cellData: rowData.KEY_ID
                                            , dataKey: POST_ID, rowData }, paddingTop, null)
                                        }
                                        dataKey         = {POST_ID}
                                        label           = {''}
                                        key             = {POST_ID}
                                        width           = {widths[POST_ID] * 100}
                                        headerStyle     = {{ width: widths[POST_ID] * 100 + "%" }}
                                        style           = {{
                                            boxSizing  : "border-box",
                                            alignItems : "center",
                                            cursor     : listLenght ? "pointer": "default",
                                            width      : widths[POST_ID] * 100 + "%"
                                        }}
                                    />
                                    {this.props.showSelect && (
                                        <Column
                                            headerRenderer  = { ({sortBy,sortDirection}) => this._headerChecked({dataKey: SELECT_ID, label: '', sortBy,sortDirection },hPaddingTop)}
                                            cellRenderer    = {({rowData, rowIndex}) => 
                                                this._cellChecked({
                                                    cellData: ''
                                                , dataKey: SELECT_ID, rowData, rowIndex }, paddingTop, null)
                                            }
                                            dataKey         = {SELECT_ID}
                                            label           = {''}
                                            key             = {SELECT_ID}
                                            width           = {30}
                                            headerStyle     = {{ width: widths[SELECT_ID] * 100 + "%" }}
                                            style           = {{
                                                boxSizing  : "border-box",
                                                alignItems : "center",
                                                cursor     : listLenght ? "pointer": "default",
                                                width      : widths[SELECT_ID] * 100 + "%"
                                            }}
                                        />
                                    )}
                                    {this.currentColumn.map((item, pos) => (
                                        <Column
                                            headerRenderer  = {arg => this._headerRenderer(arg,hPaddingTop)}
                                            headerClassName = {this._rowHighlight(item.id)}
                                            cellRenderer    = {arg => this._cellRenderer(arg, paddingTop, item.format)}
                                            dataKey         = {item.id}
                                            label           = {item.label}
                                            key             = {item.id + "_" + pos}
                                            width           = {widths[item.id] * 100}
                                            headerStyle     = {{ width: widths[item.id] * 100 + "%" }}
                                            style           = {{
                                                boxSizing  : "border-box",
                                                alignItems : "center",
                                                width      : widths[item.id] * 100 + "%"
                                            }}
                                        />
                                    ))}
                                </Table>
                            )}
                        </AutoSizer>
                    </div>
                    {this.isShowPagination() && (
                        <div className="c-resize-virtualize__pagination">
                            <ControlledPagination
                                ref          = {this.paginationRef}
                                initialPage  = {this.props.defaultPage}
                                pages        = {this.props.pages}
                                onChangePage = {(page) => {
                                    if (this.isShowPagination()) {
                                        this.tempListData = changePageHelper(
                                            this.listData, this.props.lengthRows ,page
                                        )
                                    } else {
                                        this.tempListData = this.listData;
                                    }
                                    this.props.onChangePage && this.props.onChangePage(page)
                                    this.setState({currentPage: page});
                                }}
                            />
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }

    _headerRenderer = ({
        dataKey,
        label,
        sortBy,sortDirection
        // columnData,disableSort,
    }, hPaddingTop ) => {
        return (
            <React.Fragment key={dataKey}>
                <div className="ReactVirtualized__Table__headerTruncatedText" style={{paddingTop: hPaddingTop}}>
                    {label} {dataKey===sortBy ? (
                        sortDirection === SortDirection.ASC ? 
                        <i className="__icon_arrow">
                            <IoMdArrowDropup/>
                            </i> : 
                        <i className="__icon_arrow __descending_arrow">
                            <IoMdArrowDropup/>
                            </i>
                    ) : ''}
                </div>
                {dataKey !== this.props.actions &&
                    <Draggable
                        axis = "x"
                        defaultClassName = "DragHandle"
                        defaultClassNameDragging = "DragHandleActive"
                        onDrag = {(a, { deltaX }) =>  {
                            return this._resizeRow({ dataKey, deltaX })}
                        }
                        onStop = {()=>{
                            setTimeout(() => {
                                this.setState({action: null});
                            },20);
                        }}
                        position = {{ x: 0 }}
                    >
                        <span className="DragHandleIcon">⋮</span>
                    </Draggable>
                }
            </React.Fragment>
        );
    };

    _cellRenderer = ({ cellData, dataKey, rowData }, paddingTop, format) => {
        const fieldsClicked = this.props.columnsClick || [];
        const statusClicked = (fieldsClicked.indexOf(dataKey) !== -1);

        let field = cellData || null;
        if (cellData === 0 || cellData === '0') { field = 0; }
        if(format === API_DATE_FORMAT) {
            field = convertExcelDateToJSDate(field).stringDate;
        }
        if(format === 'hh:mm') {
            field = convertExcelDateToJSDate(field, format).stringDate;
        }
        if ((format||'').includes('fixed')) {
            field = (field||0).toFixed(format.replace('fixed:',''));
        }

        if(!isEmpty(field)) {
            if(field.constructor === Boolean) {
                field = field.toString().toUpperCase();
            }
        }

        if (dataKey === this.props.actions) {
            return (
                <React.Fragment>
                    <div
                        className={"__table__field-actions" + " virtualized_cell"}
                        style={{ display: 'flex' }}
                    >
                        <span className="c-resize-virtualize__button-editable" style={{ position: 'relative' }} onClick={()=>{
                            this.props.onEditRow && this.props.onEditRow(rowData);
                        }}>
                            <MdModeEdit/>
                        </span>
                        <span className="c-resize-virtualize__button-editable" style={{ position: 'relative' }} onClick={()=>{
                            this.props.onEditRow && this.props.onDeleteRow(rowData);
                        }}>
                            <IoMdTrash/>
                        </span>
                    </div>
                </React.Fragment>
            );    
        }
        return (
            <React.Fragment>
                <div
                    className={this._rowGetStatus(rowData, dataKey) + " virtualized_cell"}
                    onClick={(e)=>this._handleClickField(e,0,dataKey,rowData)}
                    style={{ paddingTop }}
                >
                    {(()=>{
                        if (!!this.props.cellRender) {
                            if (this.props.cellRender[dataKey] && rowData.__fake__ !== true) {
                                return this.props.cellRender[dataKey](field, rowData)
                            }
                        }
                        return (
                            <React.Fragment>
                                {field}
                                {statusClicked ? <span className="c-resize-virtualize__button-editable">
                                    <MdModeEdit/>
                                </span> : null}
                            </React.Fragment>
                        )
                    })()}
                </div>
            </React.Fragment>
        );
    };

    _headerChecked = ({
        dataKey,
        label,
        sortBy,sortDirection
        // columnData,disableSort,
    }, hPaddingTop ) => {

        let statusCheck = true;
        if (this.tempListData.length === 0) {
            statusCheck = false;
        } else if (this.state.selectedIds.length === 0) {
            statusCheck = false;
        } else {
            this.tempListData.forEach((item) => {
                let id = item[this.props.checkedId];
                statusCheck = ( !this.props.onReasonCheck(item) ? true : this.state.selectedIds.includes(id) ) && statusCheck
            });
        }

        return (
            <React.Fragment key={dataKey}>
                <div
                    className="ReactVirtualized__Table__headerTruncatedText"
                    style={{paddingTop: hPaddingTop}}
                >
                    {
                        <Form.Check
                            custom   
                            id       = {'custom-check-'+label}
                            type     = {'checkbox'}
                            checked  = {statusCheck}
                            onChange = {(e) => {
                                let selectedIds = [...this.state.selectedIds];
                                let listData    = this.tempListData.map( item => item[this.props.checkedId] );

                                if (e.target.checked) {
                                    this.tempListData.forEach( rowData => {
                                        let id    = rowData[this.props.checkedId];
                                        let posId = selectedIds.indexOf(id);
                                        if (posId === -1) {
                                            if (this.props.onReasonCheck(rowData)) {
                                                selectedIds.push(id);
                                                this.selectedRows.push(rowData);
                                            }
                                        }
                                    });
                                } else {
                                    listData.forEach( id => {
                                        let posId = selectedIds.indexOf(id);
                                        if (posId !== -1) {
                                            selectedIds.splice(posId,1);
                                            this.selectedRows.splice(posId,1);
                                        }
                                    })
                                }
                                this.setState({ selectedIds: selectedIds });
                                this.props.onChangeCheck(this.selectedRows,selectedIds,null, e.target.checked)
                            }}
                        />
                    } {dataKey===sortBy ? (
                        sortDirection === SortDirection.ASC ? 
                        <i className="__icon_arrow">
                            <IoMdArrowDropup/>
                            </i> : 
                        <i className="__icon_arrow __descending_arrow">
                            <IoMdArrowDropup/>
                            </i>
                    ) : ''}
                </div>
                {dataKey !== this.props.actions &&
                    <Draggable
                        axis = "x"
                        defaultClassName = "DragHandle"
                        defaultClassNameDragging = "DragHandleActive"
                        onDrag = {(a, { deltaX }) =>  {
                            return this._resizeRow({ dataKey, deltaX })}
                        }
                        onStop = {()=>{
                            setTimeout(() => {
                                this.setState({action: null});
                            },20);
                        }}
                        position = {{ x: 0 }}
                    >
                        <span className="DragHandleIcon">⋮</span>
                    </Draggable>
                }
            </React.Fragment>
        );
    };

    _cellChecked = ({ cellData, dataKey, rowData, rowIndex }, paddingTop) => {
        return (
            <div
                className={this._rowGetStatus(rowData, dataKey) + " virtualized_cell"}
                style={{ paddingTop, display: 'flex' }}
            >
                {rowData.__fake__ !== true && 
                    <Form.Check
                        custom
                        type={'checkbox'}
                        id={'custom-check-'+rowIndex+'-'+rowData[this.props.checkedId]}
                        checked={this.state.selectedIds.indexOf(rowData[this.props.checkedId]) !== -1}
                        onChange={(e) => {
                            if (this.props.onReasonCheck(rowData)) {
                                let selectedId = rowData[this.props.checkedId];
                                let selectedIds = [...this.state.selectedIds];
                                if (e.target.checked) {
                                    selectedIds.push(selectedId);
                                    this.selectedRows.push(rowData);
                                } else {
                                    let posId = selectedIds.indexOf(selectedId);
                                    if (posId !== -1) {
                                        selectedIds.splice(posId,1);
                                        this.selectedRows.splice(posId,1);
                                    }
                                }
                                this.setState({ selectedIds: selectedIds });
                                this.props.onChangeCheck(this.selectedRows,selectedIds,rowData, e.target.checked)
                            }
                        }}
                        >
                    </Form.Check>
                }
            </div>
        )
    }

    _resizeRow = ({ dataKey, deltaX }) => this.setState(prevState => {
        const prevWidths = prevState.widths;
        const percentDelta = deltaX / this.componentRef.current.offsetWidth;
        const currentDelta = prevWidths[dataKey] + percentDelta;
            return {
                action: ACTION_DRAGGING,
                widths: {
                    ...prevWidths,
                    [dataKey]: currentDelta > 0.01 ? currentDelta : 0.01
                }
            };
    });

    _changeColumns = event => {
        const newId = event.target.id.replace("swich_", "");
        const isActive = event.target.checked;

        const newColumn = [];

        this.statusSwitch[newId] = isActive;
        this.columns.forEach(cl => {
            this.statusSwitch[cl.id] && newColumn.push(cl);
        });
        this.currentColumn = newColumn;
        this.setState({ load: !this.state.load });
    };

    _handleClickField = (e, index,headId,row) => {
        try {
            this.props.activeRowClick && e.target.parentNode.toggleAttribute('active');
            this.props.activeRowClick && e.target.parentNode.parentNode.toggleAttribute('active');
            this.props.activeRowClick && e.target.parentNode.parentNode.parentNode.toggleAttribute('active');
        } catch (e) {}

        const fieldsClicked = this.props.columnsClick || [];
        const filedsNoClick = this.props.columnsNoClick || [];
        if (row.__fake__ === true ) { return; }
        if (fieldsClicked.indexOf(headId) !== -1) {
            this.props.onClickField && this.props.onClickField({
                id    : headId,
                index : index,
                row   : row  
            });
        } else {
            if (filedsNoClick.indexOf(headId) === -1) {
                this.props.onClickRow && this.props.onClickRow({
                    id    : headId,
                    index : index,
                    row   : row  
                });
            }
        }
    }

    _rowHighlight = headId => {
        const colsClicked = this.props.columnsClick || [];
        const colsHight = this.props.columnsHight || [];
        return colsClicked.indexOf(headId) !== -1
            ? "__table__field-editable"
            : colsHight.indexOf(headId) !== -1
            ? "__table__field-hight"
            : "";
    };

    _rowStatusClass = row => {
        let iClass = this.props.onGetClass(row) || "";
        const rowV = row[this.props.validation];
        if (!(rowV === null || rowV === "" || rowV === undefined)) {
            switch (rowV) {
            case MSG_SUCCESS_RESULT:
                iClass = "__table__success";
                break;
            case CODE_DELETE_RESULT:
                iClass = "__table__delete";
                break;
            default:
                iClass = "__table__error";
                break;
            }
        }
        return iClass;
    };

    _rowGetStatus = (row, id) =>
        this._rowStatusClass(row) + " " + this._rowHighlight(id);
    
    _sortList = ({ sortBy, sortDirection }, list = null ) => {
        let prevList = list || this.props.list;
        let tempList = [];
        [...prevList].forEach( (it,i) => {
            tempList[i] = it;
            if (!!it) {
                tempList[i].KEY_ID = i+1;
            } else {
                tempList[i] = { __fake__: true, KEY_ID: i+1 };
            }
        });
        let newList = lodash.sortBy(tempList, [sortBy]);
        if (sortDirection === SortDirection.DESC) {
            newList.reverse();
        }
        return newList;
    };
    
    _sort = ({ sortBy, sortDirection }) => {
        if (sortBy === '__SELECT__') {
            return;
        }
        if (this.state.action !== ACTION_DRAGGING) {
            this.listData = this._sortList({ sortBy, sortDirection });
            if (this.isShowPagination()) {
                this.tempListData = changePageHelper(
                    this.listData, this.props.lengthRows, this.state.currentPage
                )
            } else {
                this.tempListData = this.listData;
            }
            this.setState({ sortBy, sortDirection, action: ACTION_SORTING });
        }
    };
}

VirtualizedTable.defaultProps = {
    list: [],
    sort: "asc",
    sortBy: "", //selectLabel
    validation: "",
    actions: '',
    columns: [],
    cellRender: null,
    loadTable: false,
    columnsHight: [],
    columnsClick: [],
    rowHeight: 26,
    headerHeight: 34,
    loading: false,
    showPagination: false,
    pages: 30,
    defaultPage: 1,
    activeRowClick: true,
    styleContent: {
        width: '100%',
        height: '100%',
    },
    popoverClassName: '',
    onEditRow: () => {},
    onDeleteRow: () => {},
    onClickField: () => {},
    onChangePage: () => {},
    onGetClass: () => {},

    showSelect: false,
    checkedId: '',
    onReasonCheck: () => {},
    onChangeCheck: () => {}

};
VirtualizedTable.propTypes = {
    list       : PropTypes.array.isRequired,
    columns    : PropTypes.array.isRequired,
    sort       : PropTypes.oneOf(['asc', 'desc']),
    validation : PropTypes.string,

    columnsHight   : PropTypes.array,
    columnsClick   : PropTypes.array,
    columnsNoClick : PropTypes.array,
    cellRender     : PropTypes.object,

    rowHeight    : PropTypes.number,
    headerHeight : PropTypes.number,
    defaultPage  : PropTypes.number,
    pages        : PropTypes.number,
    lengthRows   : PropTypes.number,
    loading      : PropTypes.bool,

    showPagination : PropTypes.bool,
    activeRowClick : PropTypes.bool,

    onEditRow    : PropTypes.func,
    onDeleteRow  : PropTypes.func,
    onClickField : PropTypes.func,
    onChangePage : PropTypes.func,
    onGetClass   : PropTypes.func,

    showSelect : PropTypes.bool,
    checkedId  : PropTypes.string,
    onReasonCheck: PropTypes.func,
    onChangeCheck: PropTypes.func,
}