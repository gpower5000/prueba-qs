import React, { useState, useEffect, useRef } from 'react';
import lodash from "lodash";
import { i_sp_svg } from '../../../providers/modules/images';
import { CustomizedTreeView } from '../TreeView/TreeView.component';
import { uniqByKeepFirst } from '../../../toolbox/helpers/array.helper';

import './PanelcompareList.css';

export const PanelCompare = (props) => {

    const PANEL_ONE = 'PANEL_ONE';
    const PANEL_TWO = 'PANEL_TWO';

    const [ dataOne, setDataOne ] = useState([]);
    const [ dataTwo, setDataTwo ] = useState([]);
    const [ treeOne, setTreeOne ] = useState([]);
    const [ treeTwo, setTreeTwo ] = useState([]);
    const [ expandedOne, setExpandedOne] = useState(props.defaultExpanded);
    const [ expandedTwo, setExpandedTwo] = useState(props.defaultExpanded);

    const [ dItemParentChild, setDItemParentChild ] = useState(true);
    const [ dAllParentChild, setDAllParentChild ] = useState(true);
    const [ dItemChildParent, setDItemChildParent ] = useState(true);
    const [ dAllChildParent, setDAllChildParent ] = useState(true);

    const { AiOutlineRight, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineDoubleLeft } = i_sp_svg;

    const currentSelect = useRef({
        panel: PANEL_ONE,
        selectNode: null,
    })

    const onMoveItemParentChild = () => {
        changeTreeData(
            false, PANEL_ONE, dataOne, dataTwo, 
            setDataOne, setDataTwo, setTreeOne, setTreeTwo
        );
        props.onModeSelect(false);
    }
    const onMoveAllParentChild = () => {
        changeTreeData(
            true, PANEL_ONE, dataOne, dataTwo, 
            setDataOne, setDataTwo, setTreeOne, setTreeTwo
        );
        props.onModeSelect(false);
    }
    const onMoveItemChildParent = () => {
        changeTreeData(
            false, PANEL_TWO, dataTwo, dataOne, 
            setDataTwo, setDataOne, setTreeTwo, setTreeOne
        );
        props.onModeSelect(false);
    }
    const onMoveAllChildParent = () => {
        changeTreeData(
            true, PANEL_TWO, dataTwo, dataOne, 
            setDataTwo, setDataOne, setTreeTwo, setTreeOne
        );
        props.onModeSelect(false);
    }

    const changeTreeData = (
        isAll = false, panel = PANEL_ONE,dataOne ,dataTwo,
        callbackOne, callbackTwo, fnTreeOne, fnTreeTwo
    ) => {
        const { selectNode } = currentSelect.current;
        const { treeParent, lastChildrenTree, treeFormat,
                treeConcat, onSelectMenu } = props;

        const newArray = dataOne.filter( (item) => {
            let status = false;
            let chunckId = '';
            if (isAll) { return true }
            if (!!treeParent) {
                if ((selectNode || '').includes(treeParent.id)) { return true }
            }
            lastChildrenTree.map( (id,i) => {
                if (i === 0) { chunckId = item[id]+'' }
                else { chunckId = chunckId+treeConcat+item[id] }
                if ((selectNode || '').includes(chunckId || null)) {
                    status = true; }
            });
            return status;
        });
        const chunckArrayA = uniqByKeepFirst(dataOne, 
            it => eval(readKeys('it',lastChildrenTree,treeConcat),it)
        );
        const chunckArrayB = uniqByKeepFirst(newArray, 
            it => eval(readKeys('it',lastChildrenTree,treeConcat),it)
        );
        const exits = function(other,current){
            const ko = eval(readKeys('other', lastChildrenTree,treeConcat), other);
            const kc = eval(readKeys('current', lastChildrenTree,treeConcat), current);
            return ko === kc;
        };
        const newArrayA = chunckArrayA.filter(comparer(chunckArrayB, exits));
        const newArrayB = lodash.sortBy(dataTwo.concat(chunckArrayB), lastChildrenTree);

        if (panel === PANEL_ONE) {
            onSelectMenu(newArrayB);
        } else {
            onSelectMenu(newArrayA);
        }

        callbackOne(newArrayA);
        callbackTwo(newArrayB);
        fnTreeOne(createTreeData(newArrayA, treeFormat, treeConcat));
        fnTreeTwo(createTreeData(newArrayB, treeFormat, treeConcat));
    }
    const createTreeData = (data, format, treeConcat) => {
        if (!!format && !!data) {
            const chunckMenu = uniqByKeepFirst(data, it => eval("it['"+format.id+"']",it));
            return chunckMenu.map( menu => {
                const uuid = format.uuid.map( id => (menu[id])).join(treeConcat)
                return {
                    id: uuid,
                    name: menu[format.name],
                    children: createTreeData(data.filter( a => a[format.id] === menu[format.id]), format.children, treeConcat)
                }
            });
        } return [];
    }
    const comparer = (otherArray, cb) => {
        return function(current){
            return otherArray.filter(function(other){
                return cb(other,current)
            }).length == 0;
        }
    }
    const readKeys = (pk,keyData, treeConcat) => {
        return keyData.map(key => `${pk}['${key}']`).join(`+'${treeConcat}'+`)
    }

    useEffect(() => {
        const { lastChildrenTree, treeConcat } = props;
        const exits = function(other,current){
            const ko = eval(readKeys('other', lastChildrenTree,treeConcat), other);
            const kc = eval(readKeys('current', lastChildrenTree,treeConcat), current);
            return ko === kc;
        };
        const newArrayA = props.dataOne.filter(comparer(props.dataTwo, exits));

        setDItemParentChild(true);
        setDItemChildParent(true);
        if (props.loading) {
            setDAllParentChild(false);
            setDAllChildParent(false);
        } else {
            setDAllParentChild(true);
            setDAllChildParent(true);
        }
        setDataOne(newArrayA);
        setDataTwo(props.dataTwo);
        setTreeOne(createTreeData(newArrayA, props.treeFormat, props.treeConcat))
        setTreeTwo(createTreeData(props.dataTwo, props.treeFormat, props.treeConcat))
    },[JSON.stringify(props.dataOne), JSON.stringify(props.dataTwo), props.loading]);

    return (
        <React.Fragment>
            <div className={'c-panel-compare-list__parent'}>
                <div className={'c-panel-compare-list__content-tree'} disabled={!props.loading}>
                    <div className={'c-panel-compare-list__tree'}>
                        <CustomizedTreeView
                            treeData     = {treeOne}
                            onNodeSelect = {(e,data) => {
                                currentSelect.current = {
                                    panel: PANEL_ONE,
                                    selectNode: data
                                }
                                setDItemChildParent(true);
                                setDItemParentChild(false);
                                props.onModeSelect(false);
                            }}
                            onNodeToggle = {(e, expandedId) => {
                                const expanded = expandedId;
                                if (!!props.treeParent) {
                                    if (!(expandedId || '').includes(props.treeParent.id)) {
                                        expandedId.push(props.treeParent.id);
                                        setExpandedOne(expanded); return;
                                    }
                                }
                                setExpandedOne(expandedId);
                            }}
                            treeParent   = {props.treeParent}
                            multiSelect  = {props.multiSelect}
                            expanded     = {expandedOne}
                        />
                    </div>
                </div>
                <div className={'c-panel-compare-list__action'}>
                    <button disabled={dItemParentChild} onClick={()=> onMoveItemParentChild() }>
                        <i><AiOutlineRight style={{ width: 20, height: 20 }} /></i>
                    </button>
                    <button disabled={dAllParentChild} onClick={()=> onMoveAllParentChild() }>
                        <i><AiOutlineDoubleRight style={{ width: 20, height: 20 }} /></i>
                    </button>
                    <button disabled={dItemChildParent} onClick={()=> onMoveItemChildParent() }>
                        <i><AiOutlineLeft style={{ width: 20, height: 20 }} /></i>
                    </button>
                    <button disabled={dAllChildParent} onClick={()=> onMoveAllChildParent() }>
                        <i><AiOutlineDoubleLeft style={{ width: 20, height: 20 }} /></i>
                    </button>
                </div>
                <div className={'c-panel-compare-list__content-tree'} disabled={!props.loading}>
                    <div className={'c-panel-compare-list__tree'}>
                        <CustomizedTreeView
                            treeData     = {treeTwo}
                            onNodeSelect = {(e,data) => {
                                currentSelect.current = {
                                    panel: PANEL_TWO,
                                    selectNode: data
                                }
                                setDItemParentChild(true);
                                setDItemChildParent(false);
                                if (data.length === 1) {
                                    if(data.toString().includes(props.treeConcat)) {
                                        props.onModeSelect(data);
                                    } else {
                                        props.onModeSelect(false);
                                    }
                                } else {
                                    props.onModeSelect(false);
                                }
                            }}
                            onNodeToggle = {(e, expandedId) => {
                                const expanded = expandedId;
                                if (!!props.treeParent) {
                                    if (!(expandedId || '').includes(props.treeParent.id)) {
                                        expandedId.push(props.treeParent.id);
                                        setExpandedTwo(expanded); return;
                                    }
                                }
                                setExpandedTwo(expandedId);
                            }}
                            treeParent   = {props.treeParent}
                            multiSelect  = {props.multiSelect}
                            expanded     = {expandedTwo}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};
PanelCompare.defaultProps = {
    dataOne: [],
    dataTwo: [],
    loading: false,
    treeConcat : '-',
    treeFormat : null,
    treeParent : null,
    multiSelect: true,
    defaultExpanded: [],
    lastChildrenTree: [],
    onSelectMenu: () => {},
    onModeSelect: () => {}
};
