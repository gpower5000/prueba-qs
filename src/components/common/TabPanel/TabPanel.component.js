import React from 'react';
import './TabPanel.css';

export const TabPanel = (props) => {
    const { value, index, children} = props;
    return (
        <React.Fragment key={index}>
            {value === index &&  <div className="c-tab-panel">{children}</div>}
        </React.Fragment>
    )
}

export const Tab = (props) => {
    const { onChange,value, index, label } = props;
    return (
        <React.Fragment>
            <span 
                className = {"c-tab " + (value === index ? "--active": '')} 
                onClick   = {onChange}>
                {label}
            </span>
        </React.Fragment>
    )
}

export const Tabs = (props) => {
    const { children, value, onChange, styleProps = {} } = props;
    return (
        <div className='c-content-tabs' style={styleProps}>
            <div className='c-tabs'>
                {React.Children.map(children, (child,i) => (
                    child && React.cloneElement(child, { onChange: () => onChange(i), value, index: i })
                ))}
            </div>
        </div>
    )
}