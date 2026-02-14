
import { Connection, Transaction, Keypair, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import BN from 'bn.js';
import bs58 from 'bs58';

export const getKeypairFromStr = (secretKeyStr: string): Keypair => {
  if (!secretKeyStr) throw new Error('Secret key string is empty');
  try {
    const decoded = bs58.decode(secretKeyStr.trim());
    return Keypair.fromSecretKey(decoded);
  } catch (e) {
    throw new Error('Invalid Secret Key format.');
  }
};

/**
 * 確保輸入是有效的 Solana PublicKey
 * 支援 String, PublicKey 物件, 或帶有 publicKey 屬性的 Provider
 */
export const ensurePublicKey = (input: any): PublicKey => {
  if (!input) throw new Error('Public key input is required');
  
  try {
    if (input instanceof PublicKey) return input;
    
    // 支援 Phantom/OKX 的 provider 物件
    if (input.publicKey && input.publicKey instanceof PublicKey) {
      return input.publicKey;
    }
    
    if (input.publicKey) {
      return new PublicKey(input.publicKey.toString());
    }

    if (typeof input.toBase58 === 'function') {
      return new PublicKey(input.toBase58());
    }

    return new PublicKey(input.toString().trim());
  } catch (e: any) {
    throw new Error(`Failed to parse Public Key: ${e.message}`);
  }
};

export const bufferFromString = (str: string) => {
  const buffer = Buffer.alloc(4 + str.length);
  buffer.writeUInt32LE(str.length, 0);
  buffer.write(str, 4);
  return buffer;
};

// Fix: Update type signature to include BN to fix 'Argument of type BN is not assignable to parameter of type string | number'
export const bufferFromUInt64 = (val: string | number | BN) => {
  return new BN(val).toArrayLike(Buffer, 'le', 8);
};

export const calculateTokenAmountForBuy = (solAmount: BN, reserves: { virtualTokenReserves: BN, virtualSolReserves: BN }, slippage: number) => {
  return solAmount.mul(reserves.virtualTokenReserves).div(reserves.virtualSolReserves.add(solAmount));
};

export const createTransaction = async (connection: Connection, instructions: any[], payer: PublicKey) => {
  const transaction = new Transaction();
  instructions.forEach(ix => transaction.add(ix));
  
  try {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    return { transaction, blockhash, lastValidBlockHeight };
  } catch (err: any) {
    throw new Error(`RPC_ERROR: Failed to fetch blockhash. ${err.message}`);
  }
};
