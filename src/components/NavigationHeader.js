import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {isIpX, isiOS, isSmallScreen, intenseBlue} from '../Constants';
import PropTypes from 'prop-types';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

const APPBAR_HEIGHT = isSmallScreen ? 30 : 35;
const STATUSBAR_HEIGHT = isiOS
  ? isIpX
    ? getStatusBarHeight([true])
    : 20
  : StatusBar.currentHeight;

export const headerHeight = isIpX
  ? STATUSBAR_HEIGHT + 5
  : APPBAR_HEIGHT + STATUSBAR_HEIGHT;

export default class NavigationHeader extends Component {
  renderTitle = () => {
    const {title, titleStyle} = this.props;

    if (!title) {
      return null;
    }

    if (typeof title === 'string') {
      return <Text style={[styles.titleText, titleStyle]}>{title}</Text>;
    }

    return title();
  };

  renderRightView = () => {
    const {rightView} = this.props;

    if (rightView) {
      return rightView();
    }

    return <View style={styles.rightView} />;
  };

  renderStatusBarIOS = () => {
    if (!isiOS) {
      return null;
    }

    if (isIpX) {
      return (
        <View
          style={{
            height: getStatusBarHeight([true]),
            backgroundColor: intenseBlue,
          }}
        />
      );
    }
    return <View style={{height: 20, backgroundColor: intenseBlue}} />;
  };

  render() {
    const {style} = this.props;

    return (
      <View>
        {this.renderStatusBarIOS()}
        <View style={[styles.container, style]}>
          {this.renderTitle()}
          {this.renderRightView()}
        </View>
      </View>
    );
  }
}

NavigationHeader.propTypes = {
  iOSStatusBarColor: PropTypes.string,
};

NavigationHeader.defaultProps = {
  iOSStatusBarColor: intenseBlue,
};

const buttonWrap = {
  width: 60,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 25,
    flexDirection: 'row',
    height: headerHeight,
    alignItems: 'center',
    backgroundColor: intenseBlue,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 17,
    color: 'white',
  },
  rightView: {
    ...buttonWrap,
  },
});
