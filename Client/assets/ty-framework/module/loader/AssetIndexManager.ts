import { resources} from "cc";
import {AssetIndexData, AssetInfo, AssetSearchResult, AssetTable, BundlePriority} from "./AssetIndexInfo";

/**
 * 资产索引管理器
 */
export class AssetIndexManager {
    private _assets: Map<string, AssetInfo> = new Map(); // 使用 Map 提高查找性能
    private _bundleToAssets: Map<string, Set<string>> = new Map(); // bundle -> assetNames 索引
    private _typeToAssets: Map<string, Set<string>> = new Map(); // type -> assetNames 索引
    private _pathToAsset: Map<string, string> = new Map(); // path -> assetName 索引
    private _marks: Map<string, Set<string>> = new Map(); // 标记 -> assetNames 索引
    private _assetToMarks: Map<string, Set<string>> = new Map(); // assetName -> marks 索引
    private _directories: Map<string, string[]> = new Map(); // bundle -> 目录数组 索引
    private _bundlePriority: BundlePriority | null = null; // Bundle优先级配置

    // 私有构造函数，强制使用单例
    private constructor() {
    }

    // 单例实例
    private static _instance: AssetIndexManager | null = null;

    /**
     * 获取单例实例
     */
    public static get instance(): AssetIndexManager {
        if (!this._instance) {
            this._instance = new AssetIndexManager();
        }
        return this._instance;
    }

    // 核心数据结构
    private _bundles: string[] = [];

    /**
     * 获取所有 bundle 列表
     */
    public get bundles(): string[] {
        return [...this._bundles]; // 返回副本
    }

    /**
     * 获取核心 Bundle 列表（登录必需）
     * 如果没有配置 bundlePriority，返回所有 bundle
     */
    public get coreBundles(): string[] {
        if (this._bundlePriority && this._bundlePriority.core) {
            return [...this._bundlePriority.core];
        }
        return [...this._bundles];
    }

    /**
     * 获取游戏 Bundle 列表（进入游戏后加载）
     */
    public get gameBundles(): string[] {
        if (this._bundlePriority && this._bundlePriority.game) {
            return [...this._bundlePriority.game];
        }
        return [];
    }

    /**
     * 是否配置了 Bundle 分级
     */
    public get hasBundlePriority(): boolean {
        return this._bundlePriority !== null;
    }

    /**
     * 获取资产总数
     */
    public get assetCount(): number {
        return this._assets.size;
    }

    /**
     * 销毁实例
     */
    public static destroy(): void {
        if (this._instance) {
            this._instance.clear();
            this._instance = null;
        }
    }

    /**
     * 初始化加载资产索引
     * @param indexData 索引数据（支持新旧格式）
     */
    public init(indexData: AssetIndexData): void {
        if (!indexData) {
            console.log('AssetIndexManager: indexData is required');
            return;
        }

        // 清空现有数据
        this.clear();

        // 设置 bundles
        this._bundles = indexData.bundles || [];

        // 设置 Bundle 优先级配置
        this._bundlePriority = indexData.bundlePriority || null;

        // 构建所有索引
        if (indexData.assets) {
            this.buildIndexes(indexData.assets);
        }

        // 构建目录索引
        if (indexData.directories) {
            this.buildDirectoryIndex(indexData.directories);
        }

        // 构建标记索引
        if (indexData.marks) {
            this.buildMarksIndex(indexData.marks);
        }

        if (this._bundlePriority) {
            console.log(`AssetIndexManager: Loaded ${this._assets.size} assets, core bundles: [${this._bundlePriority.core}], game bundles: [${this._bundlePriority.game}]`);
        } else {
            console.log(`AssetIndexManager: Loaded ${this._assets.size} assets, ${this._bundles.length} bundles`);
        }
    }


    /**
     * 从 URL 异步加载索引（支持 JSON 和二进制）
     * @param url 索引文件 URL（自动检测格式）
     * @param preferBinary 是否优先使用二进制格式
     */
    public async initFromURL(url: string): Promise<void> {
        // 加载 JSON 版本
        await this.loadForApp(url);
    }

    /**
     * 获取资产信息
     * @param assetName 资产名称
     */
    public getAssetInfo(assetName: string): AssetInfo | undefined {
        return this._assets.get(assetName);
    }

    /**
     * 根据路径获取资产信息
     * @param path 资产路径
     */
    public getAssetByPath(path: string): AssetInfo | undefined {
        const assetName = this._pathToAsset.get(path);
        return assetName ? this._assets.get(assetName) : undefined;
    }

    /**
     * 获取 bundle 下的所有资产名称
     * @param bundleName bundle 名称
     */
    public getAssetsInBundle(bundleName: string): string[] {
        const assetSet = this._bundleToAssets.get(bundleName);
        return assetSet ? Array.from(assetSet) : [];
    }

    /**
     * 获取特定类型的资产
     * @param type 资产类型
     */
    public getAssetsByType(type: string): string[] {
        const assetSet = this._typeToAssets.get(type);
        return assetSet ? Array.from(assetSet) : [];
    }

    /**
     * 获取具有特定标记的资产
     * @param markName 标记名称
     */
    public getAssetsByMark(markName: string): string[] {
        const assetSet = this._marks.get(markName);
        return assetSet ? Array.from(assetSet) : [];
    }

    /**
     * 获取资产的所有标记
     * @param assetName 资产名称
     */
    public getAssetMarks(assetName: string): string[] {
        const marksSet = this._assetToMarks.get(assetName);
        return marksSet ? Array.from(marksSet) : [];
    }

    /**
     * 获取 bundle 的目录结构
     * @param bundleName bundle 名称
     */
    public getBundleDirectories(bundleName: string): string[] {
        return this._directories.get(bundleName) || [];
    }

    /**
     * 检查资产是否有特定标记
     * @param assetName 资产名称
     * @param markName 标记名称
     */
    public hasMark(assetName: string, markName: string): boolean {
        const marksSet = this._assetToMarks.get(assetName);
        return marksSet ? marksSet.has(markName) : false;
    }

    /**
     * 检查资产是否存在
     * @param assetName 资产名称
     */
    public hasAsset(assetName: string): boolean {
        return this._assets.has(assetName);
    }

    /**
     * 检查 bundle 是否存在
     * @param bundleName bundle 名称
     */
    public hasBundle(bundleName: string): boolean {
        return this._bundles.includes(bundleName);
    }

    /**
     * 搜索资产（支持模糊搜索）
     * @param keyword 关键词
     */
    public searchAssets(keyword: string): AssetSearchResult[] {
        const results: AssetSearchResult[] = [];
        const lowerKeyword = keyword.toLowerCase();

        for (const [assetName, assetInfo] of this._assets.entries()) {
            // 搜索资产名称
            if (assetName.toLowerCase().includes(lowerKeyword)) {
                results.push({
                    assetName,
                    assetInfo,
                    matchType: 'name'
                });
                continue;
            }

            // 搜索路径
            if (assetInfo.path && assetInfo.path.toLowerCase().includes(lowerKeyword)) {
                results.push({
                    assetName,
                    assetInfo,
                    matchType: 'path'
                });
                continue;
            }

            // 搜索 bundle
            if (assetInfo.bundle && assetInfo.bundle.toLowerCase().includes(lowerKeyword)) {
                results.push({
                    assetName,
                    assetInfo,
                    matchType: 'bundle'
                });
            }
        }

        return results;
    }

    /**
     * 获取所有资产名称
     */
    public getAllAssetNames(): string[] {
        return Array.from(this._assets.keys());
    }

    /**
     * 获取所有标记名称
     */
    public getAllMarkNames(): string[] {
        return Array.from(this._marks.keys());
    }

    /**
     * 清空所有数据
     */
    public clear(): void {
        this._bundles = [];
        this._bundlePriority = null;
        this._assets.clear();
        this._bundleToAssets.clear();
        this._typeToAssets.clear();
        this._pathToAsset.clear();
        this._marks.clear();
        this._assetToMarks.clear();
        this._directories.clear();
    }

    /**
     * 检查是否为小游戏环境
     */
    private isMiniGameEnv(): boolean {
        /*        // 微信小游戏
                if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
                    return true;
                }
                // 字节跳动小游戏
                if (typeof tt !== 'undefined' && tt.getSystemInfoSync) {
                    return true;
                }*/
        // 其他小游戏平台
        return false;
    }

    /**
     * 为 APP 环境加载 JSON
     */
    private async loadForApp(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load(url, (error: any, asset: any) => {
                if (error) {
                    reject(error);
                } else {
                      this.init(asset.json as AssetIndexData);
                    resolve();
                }
            });
        });
    }


    /**
     * 构建所有索引
     */
    private buildIndexes(assets: AssetInfo[] | AssetTable): void {
        if (Array.isArray(assets)) {
            // 新格式：数组
            for (const assetInfo of assets) {
                // 确保有 name 字段
                if (!assetInfo.name) {
                    console.log('AssetIndexManager: Asset in array format missing name field');
                    continue;
                }

                const assetName = assetInfo.name;
                this.addAssetToIndexes(assetName, assetInfo);
            }


        } else {
            // 旧格式：对象
            for (const [assetName, assetInfo] of Object.entries(assets)) {
                // 为兼容性，添加 name 字段
                const enrichedAssetInfo = {...assetInfo, name: assetName};
                this.addAssetToIndexes(assetName, enrichedAssetInfo);
            }
        }
    }

    /**
     * 添加资产到所有索引
     */
    private addAssetToIndexes(assetName: string, assetInfo: AssetInfo): void {
        // 存储基础信息
        this._assets.set(assetName, assetInfo);
        //console.log("addAssetToIndexes",assetName,assetInfo);
        // 构建 bundle 索引
        if (assetInfo.bundle) {
            if (!this._bundleToAssets.has(assetInfo.bundle)) {
                this._bundleToAssets.set(assetInfo.bundle, new Set());
            }
            this._bundleToAssets.get(assetInfo.bundle)!.add(assetName);
        }

        // 构建 type 索引
        if (assetInfo.type) {
            if (!this._typeToAssets.has(assetInfo.type)) {
                this._typeToAssets.set(assetInfo.type, new Set());
            }
            this._typeToAssets.get(assetInfo.type)!.add(assetName);
        }

        // 构建 path 索引
        if (assetInfo.path) {
            this._pathToAsset.set(assetInfo.path, assetName);
        }

        // 构建 asset->marks 索引
        if (assetInfo.marks && assetInfo.marks.length > 0) {
            this._assetToMarks.set(assetName, new Set(assetInfo.marks));
        }
    }

    /**
     * 构建目录索引
     */
    private buildDirectoryIndex(directories: { [bundleName: string]: string[] }): void {
        for (const [bundleName, dirs] of Object.entries(directories)) {
            this._directories.set(bundleName, dirs);
        }
    }

    /**
     * 构建标记索引
     */
    private buildMarksIndex(marks: { [markName: string]: string[] }): void {
        for (const [markName, assetNames] of Object.entries(marks)) {
            if (!this._marks.has(markName)) {
                this._marks.set(markName, new Set());
            }

            const markSet = this._marks.get(markName)!;

            // 添加资产到标记集合
            for (const assetName of assetNames) {
                markSet.add(assetName);

                // 同时更新 asset->marks 索引
                if (!this._assetToMarks.has(assetName)) {
                    this._assetToMarks.set(assetName, new Set());
                }
                this._assetToMarks.get(assetName)!.add(markName);
            }
        }
    }
}