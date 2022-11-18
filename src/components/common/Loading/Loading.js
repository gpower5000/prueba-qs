import React from 'react';
import PropTypes from 'prop-types';
import {Container,Spinner} from 'react-bootstrap';

const Loading = ({
  text
}) => {
    return(
        <div 
            className="loading-component" 
            style={{
                position: 'fixed', 
                width: '100%', 
                height: '100%', 
                top: 0, 
                left: 0, 
                background: 'var(--menu-bg-color)',
                zIndex: 10,
                paddingTop: '200px'
            }}
        >
            <Container>
                <div className="d-flex justify-content-center">
                    <Spinner animation="grow" variant="dark" />
                    <span style={{lineHeight: '35px', marginLeft: '10px', color: 'white'}}>{text||'Cargando...'}</span>
                </div>
            </Container>
        </div>
    );
}

Loading.propTypes = {
  text: PropTypes.string
};

Loading.defaultProps = {
  text: 'Cargando...'
};

export default Loading;