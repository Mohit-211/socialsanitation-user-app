
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

if (!__DEV__) {
    global.console = {
        info: () => {},
        log: () => {},
        assert: () => {},
        warn: () => {},
        debug: () => {},
        error: () => {},
        time: () => {},
        timeEnd: () => {},
    };
}

AppRegistry.registerComponent(appName, () => App);
