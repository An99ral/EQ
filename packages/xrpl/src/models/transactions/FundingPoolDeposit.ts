// import { isNumber } from 'lodash' // Eliminado: usar validación nativa
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

export interface FundingPoolDeposit extends BaseTransaction {
   TransactionType: 'FundingPoolDeposit'
   Owner: Account
   OfferSequence: number | string
   Amount: string

}
export function validateFundingPoolDeposit(tx: Record<string, unknown>): void {
   validateBaseTransaction(tx)
   if (
      !(
         (typeof tx.TransactionType === 'string' && tx.TransactionType === 'FundingPoolDeposit') ||
         (typeof tx.TransactionType === 'number' && tx.TransactionType === 152)
      )
   ) {
      throw new ValidationError('FundingPoolDeposit: TransactionType inválido')
   }
   // ...resto de validaciones...
   validateRequiredField(tx, 'Owner', isAccount)
   if (
      (typeof tx.OfferSequence !== 'number' &&
         typeof tx.OfferSequence !== 'string') ||
      Number.isNaN(Number(tx.OfferSequence))
   ) {
      throw new ValidationError('FundingPoolDeposit: OfferSequence must be a number')
   }
   // Validación nativa para Amount
   if (
      tx.Amount === undefined ||
      (typeof tx.Amount !== 'string' && typeof tx.Amount !== 'number') ||
      Number.isNaN(Number(tx.Amount))
   ) {
      throw new ValidationError('FundingPoolDeposit: Amount must be a number or numeric string')
   }
}