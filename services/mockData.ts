
import { Project, ProjectStatus } from '../types';

export const MOCK_PROJECTS: Project[] = [
  // --- 20 VOTING REPOS ---
  {
    id: 'm1', githubUrl: 'https://github.com/solana-labs/solana-program-library', repoName: 'Solana-Anchor-Templates', owner: 'BlockForge',
    description: 'A collection of optimized Anchor templates for DeFi protocols.', summary: 'Standardized Anchor templates for lightning-fast protocol deployment on Solana.',
    tags: ['Solana', 'Rust', 'Anchor'], likes: 12, stars: 1240, forks: 450, status: ProjectStatus.VOTING, authorWallet: 'W1', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm2', githubUrl: 'https://github.com/coral-xyz/anchor', repoName: 'Rust-VRF-Light', owner: 'NeonLabs',
    description: 'On-chain verifiable randomness for gaming.', summary: 'Cheap and efficient VRF implementation for Solana games.',
    tags: ['Gaming', 'VRF', 'Rust'], likes: 8, stars: 890, forks: 120, status: ProjectStatus.VOTING, authorWallet: 'W2', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm3', githubUrl: 'https://github.com/jito-foundation/jito-solana', repoName: 'Jito-MEV-Analyzer', owner: 'AlphaSeeks',
    description: 'Real-time MEV opportunity scanner for searchers.', summary: 'The definitive analyzer for Jito-Solana MEV bundles.',
    tags: ['MEV', 'Infra', 'Jito'], likes: 15, stars: 3200, forks: 890, status: ProjectStatus.VOTING, authorWallet: 'W3', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm4', githubUrl: 'https://github.com/metaplex-foundation/metaplex', repoName: 'Royalty-Guard-v2', owner: 'NFTLabs',
    description: 'Enforcing creator royalties at the program level.', summary: 'Hardened royalty enforcement for SPL-Token-2022 assets.',
    tags: ['NFT', 'Royalties', 'Metaplex'], likes: 4, stars: 2100, forks: 340, status: ProjectStatus.VOTING, authorWallet: 'W4', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm5', githubUrl: 'https://github.com/solana-labs/solana', repoName: 'Account-Compressor', owner: 'DataGuru',
    description: 'Utility for simplifying state compression workflows.', summary: 'Make Solana state compression as easy as standard accounts.',
    tags: ['Infra', 'Compression', 'Scaling'], likes: 19, stars: 4500, forks: 1200, status: ProjectStatus.VOTING, authorWallet: 'W5', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm6', githubUrl: 'https://github.com/pyth-network/pyth-sdk-rs', repoName: 'Price-Feeds-Oracle', owner: 'OracleTeam',
    description: 'Low-latency price feeds for synthetic assets.', summary: 'Pyth-powered price feeds with advanced aggregation.',
    tags: ['DeFi', 'Oracle', 'Pyth'], likes: 7, stars: 560, forks: 89, status: ProjectStatus.VOTING, authorWallet: 'W6', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm7', githubUrl: 'https://github.com/serum-foundation/serum-dex', repoName: 'DEX-Aggregator-Core', owner: 'SwapMaster',
    description: 'Next-gen routing engine for Solana DEXs.', summary: 'Ultra-low slippage routing across all major Solana liquidity pools.',
    tags: ['DeFi', 'DEX', 'Trading'], likes: 22, stars: 6700, forks: 1500, status: ProjectStatus.VOTING, authorWallet: 'W7', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm8', githubUrl: 'https://github.com/raydium-io/raydium-sdk', repoName: 'Liquidity-Manager', owner: 'PoolWhale',
    description: 'Automated vault strategies for Raydium pools.', summary: 'Smart vault management for concentrated liquidity provisioning.',
    tags: ['DeFi', 'Yield', 'Raydium'], likes: 3, stars: 340, forks: 45, status: ProjectStatus.VOTING, authorWallet: 'W8', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm9', githubUrl: 'https://github.com/project-serum/anchor', repoName: 'Solana-Auth-Nextjs', owner: 'FullStackDev',
    description: 'Ready-to-use Auth kit for Solana apps.', summary: 'SIWS (Sign In With Solana) implementation for Next.js 14.',
    tags: ['Web3', 'Auth', 'Next.js'], likes: 11, stars: 980, forks: 230, status: ProjectStatus.VOTING, authorWallet: 'W9', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm10', githubUrl: 'https://github.com/solana-mobile/dapp-store-lib', repoName: 'Saga-App-Toolkit', owner: 'MobileFirst',
    description: 'Libraries for the Solana Mobile dApp store.', summary: 'Streamline mobile dApp submission and interaction.',
    tags: ['Mobile', 'Saga', 'UX'], likes: 6, stars: 1100, forks: 140, status: ProjectStatus.VOTING, authorWallet: 'W10', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm11', githubUrl: 'https://github.com/solana-labs/wallet-adapter', repoName: 'Multi-Wallet-Adapter', owner: 'UXLabs',
    description: 'Seamlessly switch between 20+ Solana wallets.', summary: 'Improved UI/UX for Solana wallet connection and switching.',
    tags: ['UX', 'Wallet', 'Tools'], likes: 5, stars: 4300, forks: 900, status: ProjectStatus.VOTING, authorWallet: 'W11', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm12', githubUrl: 'https://github.com/helius-labs/helius-sdk', repoName: 'Helius-RPC-Proxy', owner: 'InfraNode',
    description: 'Secure proxy for RPC requests with rate limiting.', summary: 'Enterprise-grade RPC proxying for high-traffic apps.',
    tags: ['Infra', 'RPC', 'Helius'], likes: 14, stars: 870, forks: 110, status: ProjectStatus.VOTING, authorWallet: 'W12', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm13', githubUrl: 'https://github.com/orca-so/whirlpools', repoName: 'Orca-SDK-v3', owner: 'WhirlpoolDev',
    description: 'Interact with concentrated liquidity on Orca.', summary: 'Simplified SDK for Whirlpool swaps and LP management.',
    tags: ['DeFi', 'Orca', 'SDK'], likes: 9, stars: 1500, forks: 300, status: ProjectStatus.VOTING, authorWallet: 'W13', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm14', githubUrl: 'https://github.com/bonk-dao/bonk-sdk', repoName: 'Bonk-Reward-Engine', owner: 'BonkContributor',
    description: 'Distribute Bonk rewards to your community.', summary: 'Automated Bonk airdrops and staking reward calculation.',
    tags: ['Meme', 'Community', 'Bonk'], likes: 31, stars: 12000, forks: 4500, status: ProjectStatus.VOTING, authorWallet: 'W14', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm15', githubUrl: 'https://github.com/solana-foundation/solana-governance', repoName: 'DAO-Voting-Module', owner: 'GovTech',
    description: 'Advanced voting logic for Solana DAOs.', summary: 'Quadratic and weighted voting modules for SPL-Governance.',
    tags: ['DAO', 'Governance', 'Solana'], likes: 2, stars: 650, forks: 90, status: ProjectStatus.VOTING, authorWallet: 'W15', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm16', githubUrl: 'https://github.com/jup-ag/jupiter-core', repoName: 'Jup-Limit-Order-API', owner: 'JupFan',
    description: 'Simplified wrapper for Jupiter limit orders.', summary: 'A cleaner API for managing on-chain limit orders on Solana.',
    tags: ['Trading', 'Jupiter', 'API'], likes: 18, stars: 2300, forks: 420, status: ProjectStatus.VOTING, authorWallet: 'W16', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm17', githubUrl: 'https://github.com/drift-labs/drift-v2', repoName: 'Drift-Risk-Engine', owner: 'PerpWhale',
    description: 'Calculates margin requirements for perps.', summary: 'Real-time risk and liquidations monitoring for Drift V2.',
    tags: ['DeFi', 'Perps', 'Risk'], likes: 12, stars: 1800, forks: 350, status: ProjectStatus.VOTING, authorWallet: 'W17', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm18', githubUrl: 'https://github.com/solana-labs/solana-web3.js', repoName: 'Web3-Lite-Provider', owner: 'PerfDev',
    description: 'Ultra-small provider for mobile environments.', summary: 'A stripped-down Solana provider for 50KB mobile apps.',
    tags: ['Mobile', 'Library', 'Web3'], likes: 4, stars: 520, forks: 60, status: ProjectStatus.VOTING, authorWallet: 'W18', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm19', githubUrl: 'https://github.com/dialectlabs/dialect-sdk', repoName: 'Dialect-Messaging-Hub', owner: 'ChatProt',
    description: 'On-chain notifications for Solana users.', summary: 'Direct-to-wallet decentralized messaging protocol.',
    tags: ['Web3', 'Messaging', 'Social'], likes: 10, stars: 900, forks: 130, status: ProjectStatus.VOTING, authorWallet: 'W19', createdAt: Date.now(), votedBy: []
  },
  {
    id: 'm20', githubUrl: 'https://github.com/kamino-finance/kamino-sdk', repoName: 'Kamino-Auto-Rebalancer', owner: 'YieldGuru',
    description: 'Auto-compound and rebalance your LP positions.', summary: 'Smart rebalancing logic for Kamino liquidity vaults.',
    tags: ['DeFi', 'Yield', 'Kamino'], likes: 16, stars: 1400, forks: 210, status: ProjectStatus.VOTING, authorWallet: 'W20', createdAt: Date.now(), votedBy: []
  },

  // --- 20 GRADUATED REPOS ---
  {
    id: 'g1', githubUrl: 'https://github.com/jup-ag/jupiter-core', repoName: 'Jupiter-Core', owner: 'JupLabs',
    description: 'The engine powering the biggest aggregator.', summary: 'Liquidity aggregator core logic used by millions on Solana.',
    tags: ['DeFi', 'Aggregator', 'Jupiter'], likes: 1050, stars: 15200, forks: 4500, status: ProjectStatus.LAUNCHED, authorWallet: 'W21', createdAt: Date.now(), votedBy: [],
    tokenMint: 'JUPyi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'JUP'
  },
  {
    id: 'g2', githubUrl: 'https://github.com/bonk-dao/bonk', repoName: 'Bonk-Core-Protocol', owner: 'BonkTeam',
    description: 'First Solana dog coin infrastructure.', summary: 'The core smart contracts for the Bonk ecosystem.',
    tags: ['Meme', 'Community', 'Bonk'], likes: 5200, stars: 89000, forks: 12000, status: ProjectStatus.LAUNCHED, authorWallet: 'W22', createdAt: Date.now(), votedBy: [],
    tokenMint: 'DezXAZ8z7Pnrn9u7i5Bp5rN-dummy', tokenSymbol: 'BONK'
  },
  {
    id: 'g3', githubUrl: 'https://github.com/helium/helium-program-library', repoName: 'Helium-Solana-Node', owner: 'HeliumFound',
    description: 'DePIN connectivity on the Solana blockchain.', summary: 'Smart contracts for the Helium migration to Solana.',
    tags: ['DePIN', 'IOT', 'Solana'], likes: 890, stars: 4500, forks: 980, status: ProjectStatus.LAUNCHED, authorWallet: 'W23', createdAt: Date.now(), votedBy: [],
    tokenMint: 'hnty86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'HNT'
  },
  {
    id: 'g4', githubUrl: 'https://github.com/tensor-foundation/tensor-core', repoName: 'Tensor-Aggregator', owner: 'TensorLabs',
    description: 'The NFT marketplace for pro traders.', summary: 'Aggregating all NFT liquidity across the Solana ecosystem.',
    tags: ['NFT', 'Trading', 'Tensor'], likes: 740, stars: 3200, forks: 670, status: ProjectStatus.LAUNCHED, authorWallet: 'W24', createdAt: Date.now(), votedBy: [],
    tokenMint: 'TNSRi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'TNSR'
  },
  {
    id: 'g5', githubUrl: 'https://github.com/pyth-network/pyth-crosschain', repoName: 'Pyth-Oracle-Core', owner: 'PythData',
    description: 'World-class financial data on-chain.', summary: 'High-fidelity price feeds delivered across 50+ blockchains.',
    tags: ['Oracle', 'Data', 'Pyth'], likes: 1200, stars: 5600, forks: 1100, status: ProjectStatus.LAUNCHED, authorWallet: 'W25', createdAt: Date.now(), votedBy: [],
    tokenMint: 'PYTHi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'PYTH'
  },
  {
    id: 'g6', githubUrl: 'https://github.com/drift-labs/drift-v2', repoName: 'Drift-DEX', owner: 'DriftProtocol',
    description: 'Cross-margin perpetual futures exchange.', summary: 'The most capital-efficient perp DEX on Solana.',
    tags: ['DeFi', 'Perps', 'Drift'], likes: 980, stars: 4100, forks: 890, status: ProjectStatus.LAUNCHED, authorWallet: 'W26', createdAt: Date.now(), votedBy: [],
    tokenMint: 'DRIFTi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'DRIFT'
  },
  {
    id: 'g7', githubUrl: 'https://github.com/kamino-finance/kamino-lending', repoName: 'Kamino-Lending-v2', owner: 'KaminoFin',
    description: 'The unified lending and yield hub.', summary: 'Automated lending and concentrated liquidity management.',
    tags: ['DeFi', 'Lending', 'Yield'], likes: 1150, stars: 3400, forks: 720, status: ProjectStatus.LAUNCHED, authorWallet: 'W27', createdAt: Date.now(), votedBy: [],
    tokenMint: 'KMNOi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'KMNO'
  },
  {
    id: 'g8', githubUrl: 'https://github.com/marginfi/marginfi-v2', repoName: 'MarginFi-Kernel', owner: 'MarginLabs',
    description: 'Permissionless lending protocol.', summary: 'Robust risk engine and lending contracts for the MRGN ecosystem.',
    tags: ['DeFi', 'Lending', 'Risk'], likes: 880, stars: 2900, forks: 540, status: ProjectStatus.LAUNCHED, authorWallet: 'W28', createdAt: Date.now(), votedBy: [],
    tokenMint: 'MRGNi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'MRGN'
  },
  {
    id: 'g9', githubUrl: 'https://github.com/wormhole-foundation/wormhole', repoName: 'Wormhole-Bridge', owner: 'WormholeTech',
    description: 'Interoperability for 30+ chains.', summary: 'The leading cross-chain messaging and token bridging protocol.',
    tags: ['Bridge', 'Infra', 'Wormhole'], likes: 2100, stars: 12000, forks: 3100, status: ProjectStatus.LAUNCHED, authorWallet: 'W29', createdAt: Date.now(), votedBy: [],
    tokenMint: 'Wi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'W'
  },
  {
    id: 'g10', githubUrl: 'https://github.com/stepn/stepn-core', repoName: 'Stepn-Game-Engine', owner: 'StepnLabs',
    description: 'The Move-to-Earn revolution.', summary: 'Core fitness tracking and NFT sneaker logic on Solana.',
    tags: ['GameFi', 'Stepn', 'Fitness'], likes: 3400, stars: 18000, forks: 5600, status: ProjectStatus.LAUNCHED, authorWallet: 'W30', createdAt: Date.now(), votedBy: [],
    tokenMint: 'GMTi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'GMT'
  },
  {
    id: 'g11', githubUrl: 'https://github.com/raydium-io/raydium-amm', repoName: 'Raydium-AMM-v2', owner: 'RaydiumTeam',
    description: 'The original Solana AMM.', summary: 'Orderbook-based AMM providing liquidity to the Serum ecosystem.',
    tags: ['DeFi', 'AMM', 'Raydium'], likes: 2300, stars: 9400, forks: 2100, status: ProjectStatus.LAUNCHED, authorWallet: 'W31', createdAt: Date.now(), votedBy: [],
    tokenMint: 'RAYi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'RAY'
  },
  {
    id: 'g12', githubUrl: 'https://github.com/solendprotocol/solend', repoName: 'Solend-Market', owner: 'SolendTeam',
    description: 'Algorithmically set interest rates.', summary: 'Decentralized lending and borrowing protocol on Solana.',
    tags: ['DeFi', 'Lending', 'Solend'], likes: 620, stars: 2100, forks: 430, status: ProjectStatus.LAUNCHED, authorWallet: 'W32', createdAt: Date.now(), votedBy: [],
    tokenMint: 'SLNDi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'SLND'
  },
  {
    id: 'g13', githubUrl: 'https://github.com/zeta-markets/zeta-protocol', repoName: 'Zeta-Options', owner: 'ZetaFound',
    description: 'On-chain derivatives exchange.', summary: 'Under-collateralized options and perps trading for Solana.',
    tags: ['DeFi', 'Options', 'Zeta'], likes: 510, stars: 1800, forks: 320, status: ProjectStatus.LAUNCHED, authorWallet: 'W33', createdAt: Date.now(), votedBy: [],
    tokenMint: 'ZET i86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'ZETA'
  },
  {
    id: 'g14', githubUrl: 'https://github.com/staratlas/staratlas-marketplace', repoName: 'Star-Atlas-Engine', owner: 'StarAtlasLabs',
    description: 'AAA space exploration gaming.', summary: 'Powering the next generation of space exploration metaverses.',
    tags: ['Gaming', 'Metaverse', 'StarAtlas'], likes: 1800, stars: 7600, forks: 1200, status: ProjectStatus.LAUNCHED, authorWallet: 'W34', createdAt: Date.now(), votedBy: [],
    tokenMint: 'ATLASi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'ATLAS'
  },
  {
    id: 'g15', githubUrl: 'https://github.com/helium/helium-wallet-app', repoName: 'Helium-Mobile-dApp', owner: 'HeliumMobile',
    description: 'Web3 mobile connectivity for all.', summary: 'Managing decentralized cellular networks through token rewards.',
    tags: ['DePIN', 'Mobile', 'Helium'], likes: 450, stars: 1200, forks: 240, status: ProjectStatus.LAUNCHED, authorWallet: 'W35', createdAt: Date.now(), votedBy: [],
    tokenMint: 'MOBILEi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'MOBILE'
  },
  {
    id: 'g16', githubUrl: 'https://github.com/dialectlabs/dialect-protocol', repoName: 'Dialect-Smart-Msg', owner: 'DialectLabs',
    description: 'Interactive, wallet-to-wallet notifications.', summary: 'Powering the notification layer for 100+ Solana dApps.',
    tags: ['Web3', 'Social', 'Dialect'], likes: 380, stars: 1600, forks: 280, status: ProjectStatus.LAUNCHED, authorWallet: 'W36', createdAt: Date.now(), votedBy: [],
    tokenMint: 'DLCTi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'DLCT'
  },
  {
    id: 'g17', githubUrl: 'https://github.com/switchboard-xyz/switchboard-v3', repoName: 'Switchboard-Core', owner: 'SwitchboardV3',
    description: 'Customizable oracle feeds for builders.', summary: 'Permissionless on-chain data feeds with custom logic.',
    tags: ['Oracle', 'Data', 'Switchboard'], likes: 670, stars: 2200, forks: 450, status: ProjectStatus.LAUNCHED, authorWallet: 'W37', createdAt: Date.now(), votedBy: [],
    tokenMint: 'SBORDi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'SBORD'
  },
  {
    id: 'g18', githubUrl: 'https://github.com/orca-so/orca-whirlpool-sdk', repoName: 'Orca-DEX-Engine', owner: 'OrcaLabs',
    description: 'Concentrated liquidity on Solana.', summary: 'The capital-efficient AMM used for large-scale swaps.',
    tags: ['DeFi', 'DEX', 'Orca'], likes: 1450, stars: 5400, forks: 1100, status: ProjectStatus.LAUNCHED, authorWallet: 'W38', createdAt: Date.now(), votedBy: [],
    tokenMint: 'ORCAi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'ORCA'
  },
  {
    id: 'g19', githubUrl: 'https://github.com/backpack-xyz/backpack', repoName: 'Backpack-Engine', owner: 'BackpackTeam',
    description: 'The executable wallet (xNFT).', summary: 'The next generation of wallet standards on Solana.',
    tags: ['Wallet', 'xNFT', 'Backpack'], likes: 2100, stars: 8700, forks: 1900, status: ProjectStatus.LAUNCHED, authorWallet: 'W39', createdAt: Date.now(), votedBy: [],
    tokenMint: 'BPKi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'BPK'
  },
  {
    id: 'g20', githubUrl: 'https://github.com/mango-markets/mango-v4', repoName: 'Mango-DEX-v4', owner: 'MangoLabs',
    description: 'Decentralized perpetual futures and lending.', summary: 'Full-stack cross-margin perp exchange with low fees.',
    tags: ['DeFi', 'Perps', 'Mango'], likes: 1100, stars: 4500, forks: 1200, status: ProjectStatus.LAUNCHED, authorWallet: 'W40', createdAt: Date.now(), votedBy: [],
    tokenMint: 'MNGOi86yvY81B27hSInp72T9iZE-dummy', tokenSymbol: 'MNGO'
  }
];
