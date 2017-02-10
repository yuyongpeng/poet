import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const QR = require('react-qr');

import Modal, { ModalProps } from './Modal'
import Actions from '../actions'
import Loading from '../components/Loading'

import './Modal.scss'
import './Login.scss'

interface SignProps {
  requestId: string;
  visible: boolean;
  noBalance: boolean;
  success: boolean;
}
interface SignActions {
  mockSign: (id: string) => any
}

class SignWorkModal extends Modal<SignProps & SignActions & ModalProps> {
  draw() {
    if (this.props.noBalance) {
      return <div className="modal">
        <h1>Signing requested</h1>
        <div>
          <h2>
            Your wallet has no balance.
          </h2>
          <p>
            Please <Link to="/account/wallet" onClick={() => this.props.cancelAction()}>go here</Link> to manage your wallet
          </p>
        </div>
      </div>
    }

    if (!this.props.success) {
      return (
        <div className="modal">
          <h1>Authorize transaction</h1>
          <div>
            { this.props.requestId
              ? <a href="#" onClick={() => this.props.mockSign(this.props.requestId)}>
                <QR text={this.props.requestId || ''} />
              </a>
              : <Loading />
            }
          </div>
          <div className="mb-2">Scan the QR code to approve</div>
          <div className="onboard mb-2">
            <div className="scan">
              <div className="placeholder-box" />
              <div className="ml-2">
                <div>Buying License</div>
                <div className="text-muted">Login to the app &gt; scan QR code</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (<div className="modal">
      <h1>Bitcoin transaction submitted</h1>
    </div>
    )
  }
}

function mapStateToProps(state: any): SignProps {
  return {
    visible: state.modals.signTx,
    requestId: state.signTx.id,
    success: state.signTx.success,
    noBalance: state.signTx.noBalance
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.signTxModalDismissRequested }),
  mockSign: (id: string) => ({ type: Actions.fakeTxSign, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);