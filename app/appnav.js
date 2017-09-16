'use strict';

import { StackNavigator } from 'react-navigation';

import Main from './containers/main';

const routeConfiguration = {
    Main: { screen: Main },
}

const stackNavigatorConfiguration = {
    headerMode: 'screen',
}


export const AppNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Main'));

export const navReducer = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    return nextState || state;
}