import React, { useMemo, useRef, useImperativeHandle } from 'react';
import SelectFilter from 'react-select';
import AsyncSelect from 'react-select/async';
import _ from "lodash";

import './Select.css';

export const prettySelectConfig = (records,label,value, splitBy = '-') => records.map(
    (item) => {
        let lbl;
        if (Array.isArray(label)) {
            lbl = [];
            label.forEach((l) => lbl.push(item[l]) );
            lbl = lbl.join(splitBy)
        } else {
            lbl = item[label];
        }
        return {
            label: ` ${lbl}`,
            value: `${item[value]}`
        }
    }
)
let memoryData = [];
export const Select = React.forwardRef(({
    className,
    styles,
    options,
    onMenuClose,
    noOptionsMessage,
    modeAsync,
    funcAsyncData,
    memoryDataBy,
    ...baseProps
}, ref) => {

    const selectRef  = useRef(null);

    const loadOptions = (inputValue, callback) => {
        if (inputValue === '' && !!memoryDataBy) {
            callback(memoryData)
        } else {
            funcAsyncData(inputValue, (update) => {
                var merge = [];
                if (!!memoryDataBy) {
                    merge = _.unionBy(update, memoryData, memoryDataBy);
                } else {
                    merge = Object.assign({}, {}, { data : update }).data;
                }
                setTimeout(() => {
                    memoryData = merge;
                    callback(update);
                }, 500);
            });
        }
    };

    useImperativeHandle(ref, () => ({
        focus() {
            selectRef.current && selectRef.current.focus();
        }
    }));

    if (modeAsync) {
        return (
            <AsyncSelect
                cacheOptions
                ref         = {selectRef}
                className   = {className}
                styles      = {styles}
                loadOptions = {loadOptions}
                defaultOptions   = {memoryData}
                noOptionsMessage = {() => noOptionsMessage}
                {...baseProps}      
            />
        )
    } else {
        return (
            <SelectFilter
                ref       = {selectRef}
                className = {className}
                styles    = {styles}
                options   = {options}
                noOptionsMessage = {() => noOptionsMessage}
                {...baseProps}      
            />
        )
    }
})

Select.defaultProps = {
    className: 'c-select',
    noOptionsMessage: 'Sin datos',
    options: [],
    onMenuClose: () => {},

    modeAsync: false,
    funcAsyncData: (i,callback) => callback([]),
    memoryDataBy: null,

    styles: {
        control: base => ({
            ...base,
            height: 34,
            minHeight: 34,
            paddingBottom: 2,
        })
    }
}