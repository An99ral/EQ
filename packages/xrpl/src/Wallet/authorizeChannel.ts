import { encodeForSigningClaim } from 'eq-binary-codec'
import { sign } from 'eq-keypairs'

import { Wallet } from './index'

/**
 * Creates a signature that can be used to redeem a specific amount of XRP from a payment channel.
 *
 * @param wallet - The account that will sign for this payment channel.
 * @param channelId - An id for the payment channel to redeem XRP from.
 * @param amount - The amount in drops to redeem.
 * @returns A signature that can be used to redeem a specific amount of XRP from a payment channel.
 * @category Utilities
 */
export function authorizeChannel(
  wallet: Wallet,
  channelId: string,
  amount: string,
): string {
  const signingData = encodeForSigningClaim({
    channel: channelId,
    amount,
  })
  //console.log('signingData for authorizeChannel:', signingData)
  return sign(signingData, wallet.privateKey)
}
