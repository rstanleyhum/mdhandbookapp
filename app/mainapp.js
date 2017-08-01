'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { addNavigationHelpers } from 'react-navigation';

import { AppNavigator } from './appnav';


const MainApp = ({ dispatch, nav, settings }) => (
    <AppNavigator screenProps={settings} navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

MainApp.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    nav: state.nav,
    settings: state.pagesapp,
});

export default connect(mapStateToProps)(MainApp);