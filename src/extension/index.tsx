import createHashHistory from 'history/createHashHistory';
import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { createLoadWallet } from '../app/data/wallet/actions';
import { ExtensionWalletProvider } from './wallet-provider';

import { VERSION } from './version';
import { browser } from 'webextension-polyfill-ts';
import { createSetPreferences } from '../app/data/user-preferences/actions';
import { createUpdateConversionRates } from '../app/data/currency/actions';

const USER_PREFERENCES_STORAGE_KEY = 'userPref';

const store = getStore({
    pageConfig: {
        device: {
            screenSize: getScreenSizeMatchMedia().matches
                ? DeviceScreenSize.SMALL
                : DeviceScreenSize.BIG,
            platform: Platform.EXTENSION
        },
        layout: {}
    },
    wallet: {
        invalidPassword: false,
        loadingInProgress: true,
        loaded: false,
        locked: false,
        selectedBlockchain: Blockchain.ZILLIQA,
        selectedNetwork: 0,
        selectedAccount: 0
    },
    extension: {
        version: VERSION
    },
    userPreferences: undefined
});
const walletProvider = new ExtensionWalletProvider();

(async () => {
    const storage = await browser.storage.local.get();
    let userPreferences = {
        preferredCurrency: 'USD',
        devMode: false,
        testNet: false,
        networks: {}
    };

    if (storage[USER_PREFERENCES_STORAGE_KEY]) {
        userPreferences = { ...userPreferences, ...storage[USER_PREFERENCES_STORAGE_KEY] };
    }
    store.dispatch(createSetPreferences(userPreferences));
    store.dispatch(createLoadWallet(walletProvider) as any);

    store.dispatch(createUpdateConversionRates() as any);
    setInterval(() => store.dispatch(createUpdateConversionRates() as any), 5 * 60 * 1000);
})();

store.subscribe(() => {
    browser.storage.local.set({
        [USER_PREFERENCES_STORAGE_KEY]: store.getState().userPreferences
    });
});

export default props => (
    <Provider store={store}>
        <App {...props} history={createHashHistory()} walletProvider={walletProvider} />
    </Provider>
);

if (document.location.search.indexOf('popup=1') > 0) {
    const body = document.getElementById('document-body');
    body.setAttribute(
        'style',
        'width: 360px; min-width:360px; max-width: 360px; height: 600px; min-height: 600px; max-height: 600px;'
    );
}
