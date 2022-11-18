import React from 'react';
import { fade, makeStyles as MmakeStyles, withStyles } from '@material-ui/core/styles';
import MTreeView from '@material-ui/lab/TreeView';
import MTreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs';

const TransitionComponent = (props) => {
    const style = useSpring({
        from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });
    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}
export const TreeItem = withStyles((theme) => ({
    iconContainer: {
        '& .close': {
            opacity: 0.3,
        },
    },
    group: {
        marginLeft: 7,
        paddingLeft: 18,
        borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
}))( (props) => <MTreeItem {...props} TransitionComponent={TransitionComponent} /> );

export const TreeView = MTreeView;
export const makeStyles = MmakeStyles;