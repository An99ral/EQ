import { ValidationError } from '../../errors'


import {
  Account,
  BaseTransaction,
  isAccount,
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
      StageData?: string
    }
  }>
}

export function validateFundingPoolCreate(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)
  if (
    !(
      (typeof tx.TransactionType === 'string' && tx.TransactionType === 'FundingPoolCreate') ||
      (typeof tx.TransactionType === 'number' && tx.TransactionType === 151)
    )
  ) {
    throw new ValidationError('FundingPoolCreate: TransactionType inválido')
  }
  // ...resto de validaciones...

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
        (stage.Stage.StageData !== undefined &&
          typeof stage.Stage.StageData !== 'string')
      ) {
        throw new ValidationError(
          `FundingPoolCreate: Stage[${index}] must contain Stage.StageIndex (number) and Stage.StageData (string|undefined)`
        )
      }
    })
  }
}