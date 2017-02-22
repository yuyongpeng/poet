import { takeEvery } from 'redux-saga'
import { put, select, take, call } from 'redux-saga/effects'

import { Actions } from '../actions/index'
import { currentPublicKey } from '../selectors/session'
import config from '../config'
import {race} from "redux-saga/effects";

async function submitLicense(reference: string, txId: string, outputIndex: number, publicKey: string, referenceOffering: string) {
  return await fetch(config.api.user + '/licenses', {
    method: 'POST',
    body: JSON.stringify({
      txId,
      outputIndex: '' + outputIndex,
      owner: publicKey,
      reference,
      referenceOffering
    })
  }).then((res: any) => res.text())
}

function* purchaseLicense(action: any) {
  const offering = action.payload;
  const reference = offering.reference;

  yield put({ type: Actions.Modals.PurchaseLicense.Show });

  const { purchaseLicenseModalAccept, purchaseLicenseModalCancel } = yield race({
    purchaseLicenseModalAccept: take(Actions.Modals.PurchaseLicense.Accept),
    purchaseLicenseModalCancel: take(Actions.Modals.PurchaseLicense.Cancel)
  });

  if (!purchaseLicenseModalAccept)
    return;

  yield put({
    type: Actions.Transactions.SignSubmitRequested,
    payload: {
      paymentAddress: offering.paymentAddress,
      amountInSatoshis: parseFloat(offering.pricingPriceAmount) * (offering.pricingPriceCurrency === "BTC" ? 1e8 : 1),
      conceptOf: 'License',
      resultAction: Actions.Licenses.Paid,
      resultPayload: offering
    }
  });

  while (true) {
    const result = yield race([
      take(Actions.Licenses.Paid),
      call(function* () {
        yield take(Actions.noBalanceAvailable);
        return false
      })
    ]);
    if (!result[0]) {
      return;
    }
    if (result[0].payload.id !== offering.id) {
      continue;
    }
    const transaction = result[0].transaction;
    const outputIndex = result[0].outputIndex;
    const publicKey = yield select(currentPublicKey);

    const licenseTx = yield call(submitLicense, reference, transaction, outputIndex, publicKey, offering.id);

  }
}

export function purchaseLicenseSaga() {
  return function*() {
    yield takeEvery(Actions.Licenses.PurchaseRequested, purchaseLicense)
  }
}