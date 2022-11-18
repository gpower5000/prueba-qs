
import React from 'react';
import { LinearProgress } from '../index';
import renderer from 'react-test-renderer';

describe('Component: LinearProgress', () => {
    it('<> Render Correctly </>', () => {
        const tree = renderer.create(<LinearProgress />).toJSON();
        expect(tree).toMatchSnapshot();
    })
    it('<> Render size small </>', () => {
        const tree = renderer.create(<LinearProgress size = 'small' />).toJSON();
        expect(tree).toMatchSnapshot();
    })
    it('<> Render size normal </>', () => {
        const tree = renderer.create(<LinearProgress size = 'normal' />).toJSON();
        expect(tree).toMatchSnapshot();
    })
    it('<> Render size large </>', () => {
        const tree = renderer.create(<LinearProgress size = 'large' />).toJSON();
        expect(tree).toMatchSnapshot();
    })
})
