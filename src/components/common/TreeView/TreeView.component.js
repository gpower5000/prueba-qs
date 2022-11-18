import React from 'react';
import { TreeView, TreeItem, makeStyles } from  './TreeItem';
import { CloseSquare, MinusSquare, PlusSquare } from './TreeIcon';

const useStyles = makeStyles({
    root: {
        padding: 5,
        background: 'var(--white-color)'
    },
});

const getTreeItemsFromData = (treeItems) => {
    return treeItems.map(treeItemData => {
        let children = undefined;
        if (treeItemData.children && treeItemData.children.length > 0) {
                children = getTreeItemsFromData(treeItemData.children);
        }
        return (
            <TreeItem
                key      = {treeItemData.id}
                nodeId   = {treeItemData.id}
                label    = {treeItemData.name}
                children = {children}
            />
        );
    });
};
const sampleTreeView = () => (
    <React.Fragment>
        <TreeItem nodeId="1" label="Main">
            <TreeItem nodeId="2" label="Hello" />
            <TreeItem nodeId="3" label="Subtree with children">
                <TreeItem nodeId="4" label="Child 1" />
                <TreeItem nodeId="5" label="Child 2" />
                <TreeItem nodeId="6" label="Child 3" />
            </TreeItem>
        </TreeItem>
    </React.Fragment>
);

const CustomizedTreeView = (props) => {

    const classes  = useStyles();

    return (
        <TreeView
            className           = {classes.root}
            defaultExpanded     = {props.defaultExpanded}
            defaultCollapseIcon = {props.defaultCollapseIcon}
            defaultExpandIcon   = {props.defaultExpandIcon}
            defaultEndIcon      = {props.defaultEndIcon}
            onNodeSelect        = {props.onNodeSelect}
            onNodeToggle        = {props.onNodeToggle}
            multiSelect         = {props.multiSelect}
            expanded            = {props.expanded}
        >
            {props.showSample && sampleTreeView()}
            {props.children ? props.children : 
                (props.treeParent ? 
                    getTreeItemsFromData([{
                        ...props.treeParent,
                        children: props.treeData
                    }]) : getTreeItemsFromData(props.treeData)
                )
            }
        </TreeView>
    );
}
CustomizedTreeView.defaultProps = {
    treeData        : [],
    expanded        : undefined,
    treeParent      : null,
    showSample      : false,
    multiSelect     : false,
    onNodeSelect    : () => {},
    onNodeToggle    : () => {},
    defaultExpanded : [],
    lastChildrenTree: [],
    defaultCollapseIcon : <MinusSquare />,
    defaultExpandIcon   : <PlusSquare />,
    defaultEndIcon      : <CloseSquare />,
}

export {
    TreeItem,
    CustomizedTreeView
};