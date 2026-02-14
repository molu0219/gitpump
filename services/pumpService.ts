
import * as web3 from '@solana/web3.js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { 
  PUMP_FUN_PROGRAM, 
  PUMP_FUN_ACCOUNT, 
  GLOBAL, 
  MINT_AUTHORITY, 
  MPL_TOKEN_METADATA, 
  RENT, 
  SYSTEM_PROGRAM_ID,
  FEE_RECIPIENT
} from './pumpConstants';
import { createTransaction, bufferFromString, ensurePublicKey, getKeypairFromStr, bufferFromUInt64 } from './pumpUtils';
import { Buffer } from 'buffer';
import BN from 'bn.js';

export interface TokenLaunchConfig {
  name: string;
  symbol: string;
  metadataUrl: string;
  priorityFee?: number;
  mintKeypair?: Keypair;
}

export interface LaunchResult {
  success: boolean;
  signature?: string;
  tokenAddress?: string;
  error?: string;
}

const RPC_ENDPOINT = process.env.VITE_RPC_URL || 'https://solana-mainnet.g.alchemy.com/v2/ckjmLje1BsXb3C2Oxnh6gM5NdbvmrQMq';

/**
 * 發射新代幣
 * @param wallet 可以是錢包 provider (Phantom) 或 Keypair (熱錢包)
 */
export async function launchToken(config: TokenLaunchConfig, wallet: any): Promise<LaunchResult> {
    try {
        const connection = new Connection(RPC_ENDPOINT, 'confirmed');
        
        // 判斷錢包類型
        const isKeypair = wallet instanceof Keypair;
        const owner = isKeypair ? (wallet as Keypair).publicKey : ensurePublicKey(wallet);
        
        const mint = config.mintKeypair || Keypair.generate();
        const { name, symbol, metadataUrl, priorityFee = 0.003 } = config;

        const pumpProgramId = ensurePublicKey(PUMP_FUN_PROGRAM);
        const metadataProgramId = ensurePublicKey(MPL_TOKEN_METADATA);
        
        const [bondingCurve] = PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), mint.publicKey.toBuffer()], pumpProgramId);
        const [associatedBondingCurve] = PublicKey.findProgramAddressSync([bondingCurve.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
        const [metadata] = PublicKey.findProgramAddressSync([Buffer.from("metadata"), metadataProgramId.toBuffer(), mint.publicKey.toBuffer()], metadataProgramId);

        const instructions: web3.TransactionInstruction[] = [
            web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }),
            web3.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: BigInt(Math.floor(priorityFee * 1_000_000_000)) }),
            new web3.TransactionInstruction({ 
                keys: [
                    { pubkey: mint.publicKey, isSigner: true, isWritable: true },
                    { pubkey: ensurePublicKey(MINT_AUTHORITY), isSigner: false, isWritable: false },
                    { pubkey: bondingCurve, isSigner: false, isWritable: true },
                    { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
                    { pubkey: ensurePublicKey(GLOBAL), isSigner: false, isWritable: false },
                    { pubkey: metadataProgramId, isSigner: false, isWritable: false },
                    { pubkey: metadata, isSigner: false, isWritable: true },
                    { pubkey: owner, isSigner: true, isWritable: true },
                    { pubkey: ensurePublicKey(SYSTEM_PROGRAM_ID), isSigner: false, isWritable: false },
                    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    { pubkey: ensurePublicKey(RENT), isSigner: false, isWritable: false },
                    { pubkey: ensurePublicKey(PUMP_FUN_ACCOUNT), isSigner: false, isWritable: false },
                    { pubkey: pumpProgramId, isSigner: false, isWritable: false }
                ], 
                programId: pumpProgramId, 
                data: Buffer.concat([
                    Buffer.from("181ec828051c0777", "hex"), 
                    bufferFromString(name), 
                    bufferFromString(symbol), 
                    bufferFromString(metadataUrl), 
                    owner.toBuffer()
                ])
            })
        ];

        const { transaction } = await createTransaction(connection, instructions, owner);
        transaction.partialSign(mint);

        let signature = "";
        if (isKeypair) {
            // 熱錢包簽章
            transaction.partialSign(wallet as Keypair);
            signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true });
        } else {
            // Phantom 簽章
            const signed = await wallet.signTransaction(transaction);
            signature = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
        }
        
        return { success: true, signature, tokenAddress: mint.publicKey.toString() };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * 買入代幣 (Buy)
 */
export async function buyToken(mintStr: string, solAmount: number, wallet: any): Promise<LaunchResult> {
  try {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const isKeypair = wallet instanceof Keypair;
    const owner = isKeypair ? (wallet as Keypair).publicKey : ensurePublicKey(wallet);
    const mint = new PublicKey(mintStr);
    const pumpProgramId = ensurePublicKey(PUMP_FUN_PROGRAM);

    const [bondingCurve] = PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), mint.toBuffer()], pumpProgramId);
    const [associatedBondingCurve] = PublicKey.findProgramAddressSync([bondingCurve.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
    const ata = getAssociatedTokenAddressSync(mint, owner);

    const solInLamports = new BN(solAmount * web3.LAMPORTS_PER_SOL);
    
    const instructions = [
      web3.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
      new web3.TransactionInstruction({
        keys: [
          { pubkey: ensurePublicKey(GLOBAL), isSigner: false, isWritable: false },
          { pubkey: ensurePublicKey(FEE_RECIPIENT), isSigner: false, isWritable: true },
          { pubkey: mint, isSigner: false, isWritable: false },
          { pubkey: bondingCurve, isSigner: false, isWritable: true },
          { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
          { pubkey: ata, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: true },
          { pubkey: ensurePublicKey(SYSTEM_PROGRAM_ID), isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: ensurePublicKey(RENT), isSigner: false, isWritable: false },
          { pubkey: ensurePublicKey(PUMP_FUN_ACCOUNT), isSigner: false, isWritable: false },
          { pubkey: pumpProgramId, isSigner: false, isWritable: false },
        ],
        programId: pumpProgramId,
        data: Buffer.concat([
          Buffer.from("66063d1141a447c1", "hex"), 
          bufferFromUInt64(new BN(0)), 
          bufferFromUInt64(solInLamports), 
        ])
      })
    ];

    const { transaction } = await createTransaction(connection, instructions, owner);
    
    let signature = "";
    if (isKeypair) {
        transaction.partialSign(wallet as Keypair);
        signature = await connection.sendRawTransaction(transaction.serialize());
    } else {
        const signed = await wallet.signTransaction(transaction);
        signature = await connection.sendRawTransaction(signed.serialize());
    }
    return { success: true, signature };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 賣出代幣 (Sell)
 */
export async function sellToken(mintStr: string, tokenAmount: number, wallet: any): Promise<LaunchResult> {
  try {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const isKeypair = wallet instanceof Keypair;
    const owner = isKeypair ? (wallet as Keypair).publicKey : ensurePublicKey(wallet);
    const mint = new PublicKey(mintStr);
    const pumpProgramId = ensurePublicKey(PUMP_FUN_PROGRAM);

    const [bondingCurve] = PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), mint.toBuffer()], pumpProgramId);
    const [associatedBondingCurve] = PublicKey.findProgramAddressSync([bondingCurve.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
    const ata = getAssociatedTokenAddressSync(mint, owner);

    const amountInSmallestUnit = new BN(tokenAmount * 1_000_000);
    
    const instructions = [
      web3.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
      new web3.TransactionInstruction({
        keys: [
          { pubkey: ensurePublicKey(GLOBAL), isSigner: false, isWritable: false },
          { pubkey: ensurePublicKey(FEE_RECIPIENT), isSigner: false, isWritable: true },
          { pubkey: mint, isSigner: false, isWritable: false },
          { pubkey: bondingCurve, isSigner: false, isWritable: true },
          { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
          { pubkey: ata, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: true },
          { pubkey: ensurePublicKey(SYSTEM_PROGRAM_ID), isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: ensurePublicKey(RENT), isSigner: false, isWritable: false },
          { pubkey: ensurePublicKey(PUMP_FUN_ACCOUNT), isSigner: false, isWritable: false },
          { pubkey: pumpProgramId, isSigner: false, isWritable: false },
        ],
        programId: pumpProgramId,
        data: Buffer.concat([
          Buffer.from("33e685a4017f83ad", "hex"), 
          bufferFromUInt64(amountInSmallestUnit),
          bufferFromUInt64(new BN(0)), 
        ])
      })
    ];

    const { transaction } = await createTransaction(connection, instructions, owner);
    
    let signature = "";
    if (isKeypair) {
        transaction.partialSign(wallet as Keypair);
        signature = await connection.sendRawTransaction(transaction.serialize());
    } else {
        const signed = await wallet.signTransaction(transaction);
        signature = await connection.sendRawTransaction(signed.serialize());
    }
    return { success: true, signature };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
