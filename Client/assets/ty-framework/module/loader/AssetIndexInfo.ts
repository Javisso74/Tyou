// 类型定义
export interface AssetInfo {
    name: string; // 新增：逻辑名称（数组格式时有）
    path: string;
    type: string;
    bundle: string;
    marks?: string[]; // 新增：特殊标记
}

/** Bundle优先级配置 */
export interface BundlePriority {
    /** 核心Bundle - 登录必需，优先加载 */
    core: string[];
    /** 游戏Bundle - 进入游戏后加载 */
    game: string[];
}

export interface AssetIndexData {
    bundles: string[];
    bundlePriority?: BundlePriority; // 新增：Bundle分级配置
    assets: AssetInfo[] | AssetTable; // 支持数组和对象两种格式
    directories?: { [bundleName: string]: string[] }; // 新增：目录结构
    marks?: { [markName: string]: string[] }; // 新增：特殊标记集合
}

export interface AssetTable {
    [assetName: string]: AssetInfo;
}

export interface AssetSearchResult {
    assetName: string;
    assetInfo: AssetInfo;
    matchType: 'name' | 'path' | 'bundle';
}
