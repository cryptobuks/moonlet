import { connect } from 'preact-redux';
import { GasFee } from './gas-fee.component';
import { BLOCKCHAIN_INFO } from '../../../../../../utils/blockchain/blockchain-info';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        blockchain: state.wallet.selectedBlockchain,
        blockchainInfo: BLOCKCHAIN_INFO[state.wallet.selectedBlockchain]
    };
};

export default connect(mapStateToProps)(GasFee);
