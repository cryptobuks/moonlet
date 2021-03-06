import { connect } from 'preact-redux';
import { IState } from '../../data';
import { ReceivePage } from './receive.component';

const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;

    let account;
    if (state.wallet.data.accounts[blockchain]) {
        account = state.wallet.data.accounts[blockchain].filter(acc => acc.address === address)[0];
    }

    return {
        account
    };
};

export default connect(mapStateToProps)(ReceivePage);
