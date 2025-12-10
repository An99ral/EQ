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

export interface FundingPoolSetJudges extends BaseTransaction {
  TransactionType: 'FundingPoolSetJudges'
  Owner: Account
  OfferSequence: number | string
  SignerQuorum: number
  AuthAccounts?: Array<{
    AuthAccount: {
      Account: Account
    }
  }>
}

export function validateFundingPoolSetJudges(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)
  if (
    !(
      (typeof tx.TransactionType === 'string' && tx.TransactionType === 'FundingPoolSetJudges') ||
      (typeof tx.TransactionType === 'number' && tx.TransactionType === 156)
    )
  ) {
    throw new ValidationError('FundingPoolSetJudges: TransactionType inválido')
  }
  // ...resto de validaciones...

  validateRequiredField(tx, 'Owner', isAccount)
  validateRequiredField(tx, 'SignerQuorum', isNumber)

     if (
      (typeof tx.OfferSequence !== 'number' &&
         typeof tx.OfferSequence !== 'string') ||
      Number.isNaN(Number(tx.OfferSequence))
   ) {
      throw new ValidationError('FundingPoolSetJudges: OfferSequence must be a number')
   }

  if (tx.AuthAccounts !== undefined) {
    if (!Array.isArray(tx.AuthAccounts)) {
      throw new ValidationError('FundingPoolSetJudges: AuthAccounts must be an array')
    }
    tx.AuthAccounts.forEach((authAccount, index) => {
      if (
        authAccount?.AuthAccount === undefined ||
        !isAccount(authAccount.AuthAccount.Account)
      ) {
        throw new ValidationError(
          `FundingPoolSetJudges: AuthAccounts[${index}] must contain AuthAccount.Account (Account)`
        )
      }
    })
  }
}