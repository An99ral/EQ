import { ValidationError } from '../../errors'
import { Amount, MPTAmount } from '../common'

import {
  Account,
  BaseTransaction,
  isAccount,
  isAmount,
  isNumber,
  validateBaseTransaction,
  validateOptionalField,
  validateRequiredField,
} from './common'

/**
 * Sequester XRP until the escrow process either finishes or is canceled.
 *
 * @category Transaction Models
 */

export interface FundingPoolCreate extends BaseTransaction {
  TransactionType: 'FundingPoolCreate'
  Amount: Amount | MPTAmount
  Destination: Account
  CancelAfter?: number
  FinishAfter?: number
  PoolName?: string
  PoolData?: string
  TargetAmount?: string
  TransferRate?: number
  Stages?: Array<{
    Stage: {
      StageIndex: number
      StageData: string
    }
  }>
}

export function validateFundingPoolCreate(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  validateRequiredField(tx, 'Amount', isAmount)
  validateRequiredField(tx, 'Destination', isAccount)

  validateOptionalField(tx, 'CancelAfter', isNumber)
  validateOptionalField(tx, 'FinishAfter', isNumber)
  validateOptionalField(tx, 'TransferRate', isNumber)

  if (tx.Stages !== undefined) {
    if (!Array.isArray(tx.Stages)) {
      throw new ValidationError('FundingPoolCreate: Stages must be an array')
    }
    tx.Stages.forEach((stage, index) => {
      if (
        stage?.Stage === undefined ||
        typeof stage.Stage.StageIndex !== 'number' ||
        typeof stage.Stage.StageData !== 'string'
      ) {
        throw new ValidationError(
          `FundingPoolCreate: Stage[${index}] must contain numeric StageIndex and string StageData`,
        )
      }
    })
  }
}
