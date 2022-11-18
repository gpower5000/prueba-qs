import React from 'react';

import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export const CreatableSingle = ({options, inputRef, ...rest}) => {
    const [selected, setSelected] = React.useState([]);
    const handleChange = (newValue, aa) => {
        rest.onChange(newValue.length === 0 ? selected : newValue);
        setSelected(newValue);
    }
    const handleInputChange = (inputValue) => {
        setSelected([{ value: inputValue, label: inputValue}]);
    }
    const handleBlur = () => {
        rest.onChange(selected);
    }

    return (
        <>
            <Typeahead
                {...rest}
                className="c-select"
                id="basic-example"
                onChange={handleChange}
                onInputChange={handleInputChange}
                onBlur={handleBlur}
                options={options}
                selected={rest.value === "" ? [] : rest.value}
                val
            />
        </>
    )
}