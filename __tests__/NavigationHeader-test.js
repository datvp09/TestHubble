import 'react-native';
import React from 'react';
import {NavigationHeader} from '../src/components';
import renderer from 'react-test-renderer';

describe('NavigationHeader', () => {
  describe('Rendering', () => {
    it('should match to snapshot', () => {
      const component = renderer
        .create(
          <NavigationHeader style={{height: 60}} title={'Repository Issues'} />,
        )
        .toJSON();
      expect(component).toMatchSnapshot();
    });
  });
});
