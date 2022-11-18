import React from 'react';
import PropTypes from 'prop-types';
import './LinearProgress.css';

export const LinearProgress = (props) => {

    const handleClass = () => {
        let arrayClass = ["c-linear-progress_content"];
        if(props.finish) {
            arrayClass.push("c-linear-progresss__finish");
        }
        switch (props.size) {
            case 'small'  : arrayClass.push("c-linear-progresss__size-small");  break;
            case 'normal' : arrayClass.push("c-linear-progresss__size-normal"); break;
            case 'large'  : arrayClass.push("c-linear-progresss__size-large");  break;
            default: break;
        }
        switch (props.color) {
            case 'primary'   : arrayClass.push("c-linear-progresss__color-primary");   break;
            case 'secondary' : arrayClass.push("c-linear-progresss__color-secondary"); break;
            default: break;

        }
        return arrayClass.join(' ');
    }

    return (
        <div className = {handleClass()}>
            <div className="c-linear-progress_indeterminate-one"></div>
            <div className="c-linear-progress_indeterminate-two"></div>
        </div>
    );
}

const defaultProps = {
    color  : 'primary',
    size   : 'small',
    finish : false
}
LinearProgress.defaultProps =  defaultProps;
LinearProgress.propTypes = {
    color  : PropTypes.oneOf(['primary', 'secondary']),
    size   : PropTypes.oneOf(['small', 'normal','large']),
    finish : PropTypes.bool,
};