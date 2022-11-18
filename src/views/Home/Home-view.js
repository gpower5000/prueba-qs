import React from 'react';
import { Form, Row, Col } from "react-bootstrap";
import Protected from '../../components/layout/Protected';

const HomeView = () => {
    return (
        <Protected nav={true} navTo={'/'} className="v-bg-gray">
            <div>
                <Form.Group as={Row} controlId="formTable" className="justify-content-center mt-4">
                    <Col sm={12} lg={10} />
                </Form.Group>
            </div>
        </Protected>
    );
};

export default HomeView;