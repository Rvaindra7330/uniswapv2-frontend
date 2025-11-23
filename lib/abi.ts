export const FACTORY_ABI = [
    "function getPair(address,address) view returns (address)"
] as const;

export const PAIR_ABI = [
    "function tokenA() view returns(address)",
    "function tokenB() view returns(address)",
    "function reserveA() view returns(uint256)",
    "function reserveB() view returns(uint256)",
    "function addLiquidity(uint256 amountA,uint256 amountB)",
    "function swap(address fromToken,uint256 amountIn)"
] as const;
export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
] as const;