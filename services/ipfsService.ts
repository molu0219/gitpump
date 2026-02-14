
/**
 * IPFS 託管服務 - 多節點穩定版
 */
const IPFS_NODES = [
  'https://api.thegraph.com/ipfs/api/v0/add',
  'https://api.ipfs.stoken.io/api/v0/add' // 備援節點
];

export async function uploadToIPFS(payload: any): Promise<string> {
  const jsonStr = JSON.stringify(payload);
  const formData = new FormData();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  formData.append('file', blob);

  let lastError = null;

  for (const node of IPFS_NODES) {
    try {
      console.log(`[IPFS] Attempting upload to: ${node}`);
      const response = await fetch(node, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) continue;

      const data = await response.json();
      const cid = data.Hash || data.cid || data.hash;
      if (cid) {
        console.log("🚀 IPFS_UPLOAD_SUCCESS:", cid);
        return `https://ipfs.io/ipfs/${cid}`;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[IPFS] Node ${node} failed:`, err.message);
    }
  }

  // 如果所有 IPFS 節點都掛了，最後的「絕招」：回退到 Supabase
  console.error("[IPFS] All nodes failed. Falling back to Supabase metadata record...");
  throw new Error(`STORAGE_UNAVAILABLE: ${lastError?.message || 'Check network'}`);
}
