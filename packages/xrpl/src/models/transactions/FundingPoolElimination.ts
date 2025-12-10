import { ValidationError } from '../../errors'

import {
  Account,
  BaseTransaction,
  isAccount,
  validateBaseTransaction,
  validateRequiredField,
} from './common'

/**
 * Sequester XRP until the escrow process either finishes or is canceled.
 *
 * @category Transaction Models
 */
export interface FundingPoolElimination extends BaseTransaction {
  TransactionType: 'FundingPoolElimination'
  Owner: Account
  OfferSequence: number | string
}

export function validateFundingPoolElimination(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)
  if (
    !(
      (typeof tx.TransactionType === 'string' &&
        tx.TransactionType === 'FundingPoolElimination') ||
      (typeof tx.TransactionType === 'number' && tx.TransactionType === 154)
    )
  ) {
    throw new ValidationError('FundingPoolElimination: TransactionType inválido')
  }
  // ...resto de validaciones...
  validateRequiredField(tx, 'Owner', isAccount)
  if (
    (typeof tx.OfferSequence !== 'number' &&
      typeof tx.OfferSequence !== 'string') ||
    Number.isNaN(Number(tx.OfferSequence))
  ) {
    throw new ValidationError('FundingPoolElimination: OfferSequence must be a number')
  }
}