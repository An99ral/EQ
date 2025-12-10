import { ValidationError } from '../../errors'

import {
  Account,
  BaseTransaction,
  isAccount,
  isNumber,
  validateBaseTransaction,
  validateRequiredField,
} from './common'

/**
 * Sequester XRP until the escrow process either finishes or is canceled.
 *
 * @category Transaction Models
 */
export interface FundingPoolClose extends BaseTransaction {
  TransactionType: 'FundingPoolClose'
  Owner: Account
  OfferSequence: number | string
  StageIndex: number
}

export function validateFundingPoolClose(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)
  if (
    !(
      (typeof tx.TransactionType === 'string' &&
        tx.TransactionType === 'FundingPoolClose') ||
      (typeof tx.TransactionType === 'number' && tx.TransactionType === 154)
    )
  ) {
    throw new ValidationError('FundingPoolClose: TransactionType inválido')
  }
  // ...resto de validaciones...
  validateRequiredField(tx, 'Owner', isAccount)
  if (
    (typeof tx.OfferSequence !== 'number' &&
      typeof tx.OfferSequence !== 'string') ||
    Number.isNaN(Number(tx.OfferSequence))
  ) {
    throw new ValidationError('FundingPoolClose: OfferSequence must be a number')
  }
  validateRequiredField(tx, 'StageIndex', isNumber)
}