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
export interface FundingPoolVote extends BaseTransaction {
  TransactionType: 'FundingPoolVote'
  Owner: Account
  OfferSequence: number | string
  Vote: number
  StageIndex: number
}

export function validateFundingPoolVote(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)
  if (
    !(
      (typeof tx.TransactionType === 'string' &&
        tx.TransactionType === 'FundingPoolVote') ||
      (typeof tx.TransactionType === 'number' && tx.TransactionType === 155)
    )
  ) {
    throw new ValidationError('FundingPoolVote: TransactionType inválido')
  }
  // ...resto de validaciones...
  validateRequiredField(tx, 'Owner', isAccount)
  if (
    (typeof tx.OfferSequence !== 'number' &&
      typeof tx.OfferSequence !== 'string') ||
    Number.isNaN(Number(tx.OfferSequence))
  ) {
    throw new ValidationError('FundingPoolVote: OfferSequence must be a number')
  }
  validateRequiredField(tx, 'Vote', isNumber)
  validateRequiredField(tx, 'StageIndex', isNumber)
}