
import { EconomyState } from '../../models/economy.model';

export const INFINITE_WALLET: EconomyState = {
  sakuraCoins: 999999999, // Infinite Coins
  gems: 999999,           // Infinite Gems
  totalSpent: 0,
  totalEarned: 999999999
};

export function getMasterWallet(current: EconomyState): EconomyState {
  return {
    ...current,
    ...INFINITE_WALLET
  };
}
