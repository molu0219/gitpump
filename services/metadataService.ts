
import { supabase } from './supabaseClient';
import { Buffer } from 'buffer';

export interface MetadataPayload {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url: string;
  attributes?: any[];
}

/**
 * 將 Metadata 上傳至 Supabase Storage
 * 這能確保獲得一個長度短、穩定且符合 Metaplex 標準的 HTTPS URL
 */
export async function uploadMetadata(mintAddress: string, payload: MetadataPayload): Promise<string> {
  try {
    const fileName = `${mintAddress}.json`;
    const jsonStr = JSON.stringify({
      ...payload,
      showName: true, // 某些錢包需要的額外欄位
      createdOn: "https://gitpump.fun"
    });

    // 將 JSON 字串轉為 Blob
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // 上傳至名為 'metadata' 的存儲桶
    // 注意：請確保在 Supabase 控制台建立一個名為 'metadata' 的 Public 存儲桶
    const { data, error } = await supabase.storage
      .from('metadata')
      .upload(fileName, blob, {
        upsert: true,
        contentType: 'application/json'
      });

    if (error) {
      // 如果存儲桶不存在或權限不足，這裡會報錯，我們改用快取或報錯提醒
      throw new Error(`Supabase Storage Error: ${error.message}. Please ensure a public bucket named 'metadata' exists.`);
    }

    // 取得公開存取連結
    const { data: { publicUrl } } = supabase.storage
      .from('metadata')
      .getPublicUrl(fileName);

    console.log("🚀 Metadata Host Success:", publicUrl);
    return publicUrl;
  } catch (err: any) {
    console.error("Metadata upload failed:", err);
    throw err;
  }
}
