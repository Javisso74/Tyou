'use strict';

const fs = require('fs');
const path = require('path');

const runGenerator = async function () {
    console.log('[AssetIndexGenerator] Start generating asset index...');

    const projectPath = Editor.Project.path;
    const configPath = path.join(projectPath, 'assets', 'editor', 'asset-index-config.json');

    // Load config
    if (!fs.existsSync(configPath)) {
        Editor.error(`Config file not found: ${configPath}`);
        return;
    }

    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const assetsArray = []; // 改为数组存储资产
        const bundleSet = new Set(); // 收集所有 bundle 名称
        const directoryMap = {}; // 目录映射表 {bundleName: [dir1, dir2, ...]}

        // 存储所有特殊标记的资源
        const specialMarksMap = {};
        const specialMarksConfig = config.specialMarks || {};
        for (const markName in specialMarksConfig) {
            specialMarksMap[markName] = new Set();
        }

        // 定义图片格式
        const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tga', 'tif', 'tiff'];

        // 用于检查重复的逻辑名称
        const logicalNameSet = new Set();

        // Process each scan config
        for (const scanConfig of (config.scanConfigs || [])) {
            // 根据文件夹名自动生成bundle名称
            const dirParts = scanConfig.dir.split('/');
            const bundleName = dirParts[dirParts.length - 1];

            // 判断是否需要遍历文件
            const hasExtensions = scanConfig.extensions && scanConfig.extensions.length > 0;

            console.log(`[AssetIndexGenerator] Scanning: ${scanConfig.dir} (Bundle: ${bundleName})`);

            if (hasExtensions) {
                console.log(`  File types: ${scanConfig.extensions.join(', ')}`);

                await scanDirectory(
                    projectPath,
                    scanConfig.dir,
                    bundleName,
                    scanConfig.extensions,
                    config.resourceTypeMap || {},
                    assetsArray,
                    bundleSet,
                    specialMarksMap,
                    specialMarksConfig,
                    logicalNameSet,
                    imageExtensions
                );
            } else {
                // 没有extensions时：扫描第一层子文件夹，把所有子文件夹名都存进去
                console.log(`  No extensions specified, scanning all first-level subdirectories`);
                await scanDirectories(
                    projectPath,
                    scanConfig.dir,
                    bundleName,
                    directoryMap
                );
                bundleSet.add(bundleName);
            }
        }

        // 创建最终输出的数据结构
        const outputData = {
            bundles: Array.from(bundleSet).sort(), // 按字母顺序排序
            assets: assetsArray // 现在是数组形式
        };

        // 如果有目录映射数据，添加到输出中
        if (Object.keys(directoryMap).length > 0) {
            outputData.directories = directoryMap;
        }

        // 总是添加特殊标记的数据，即使为空
        const marksData = {};
        for (const markName in specialMarksMap) {
            marksData[markName] = Array.from(specialMarksMap[markName]).sort();
        }
        outputData.marks = marksData; // 总是包含marks字段

        // Save index file
        const outputPath = path.join(projectPath, 'assets/', config.outputPath || 'asset-index.json');
        const outputDir = path.dirname(outputPath);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }

        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

/*        // 保存二进制文件
        await saveBinaryFile(outputData, outputPath);

        const processedCount = assetsArray.length;
        console.log(`[AssetIndexGenerator] Completed: ${processedCount} assets processed, ${bundleSet.size} bundles found`);
        console.log(`[AssetIndexGenerator] Output: ${outputPath}`);*/

        // 输出特殊标记的统计信息
        for (const markName in specialMarksMap) {
            const count = specialMarksMap[markName].size;
            console.log(`[AssetIndexGenerator] ${markName}: ${count} assets`);
        }

        // Show success dialog
        let message = `Asset index generated successfully!`;
        for (const markName in specialMarksMap) {
            const count = specialMarksMap[markName].size;
            message += `\n${markName}: ${count}`;
        }
        Editor.Dialog.info(message, {
            title: 'Success'
        });

    } catch (error) {
        Editor.error('[AssetIndexGenerator] Error:', error);
        Editor.Dialog.error(`Error generating asset index:\n${error.message}`, {
            title: 'Error'
        });
    }
};

// 扫描目录结构（只一层，把所有第一层子文件夹都存进去）- 仅在没有extensions时调用
async function scanDirectories(projectPath, relativeDir, bundleName, directoryMap) {
    const fullDirPath = path.join(projectPath, 'assets', relativeDir);

    if (!fs.existsSync(fullDirPath)) {
        console.warn(`Directory not found: ${relativeDir}`);
        return;
    }

    try {
        const items = fs.readdirSync(fullDirPath, {withFileTypes: true});
        const dirs = items
            .filter(item => item.isDirectory())
            .map(item => item.name)
            .sort(); // 按字母顺序排序

        if (dirs.length > 0) {
            directoryMap[bundleName] = dirs;
            console.log(`  Found ${dirs.length} subdirectories in ${relativeDir}: ${dirs.join(', ')}`);
        } else {
            console.log(`  No directories found in ${relativeDir}`);
        }
    } catch (error) {
        console.error(`Error scanning directories in ${fullDirPath}:`, error);
    }
}

// 检查是否符合特殊标记
function checkSpecialMarks(itemName, specialMarksConfig) {
    const marks = [];

    for (const markName in specialMarksConfig) {
        const prefixes = specialMarksConfig[markName];
        if (Array.isArray(prefixes)) {
            for (const prefix of prefixes) {
                // 直接匹配前缀，不进行额外的处理
                if (itemName.startsWith(prefix)) {
                    marks.push(markName);
                    break; // 匹配一个前缀即可
                }
                // 如果前缀本身包含大小写，我们可以尝试大小写不敏感的匹配
                else if (itemName.toLowerCase().startsWith(prefix.toLowerCase())) {
                    marks.push(markName);
                    break;
                }
            }
        }
    }

    return marks;
}

async function scanDirectory(projectPath, relativeDir, bundleName, extensions, typeMap, assetsArray, bundleSet, specialMarksMap, specialMarksConfig, logicalNameSet, imageExtensions) {
    const fullDirPath = path.join(projectPath, 'assets', relativeDir);

    if (!fs.existsSync(fullDirPath)) {
        console.warn(`Directory not found: ${relativeDir}`);
        return;
    }

    // 将 bundle 名称添加到集合中
    bundleSet.add(bundleName);

    // 开始遍历文件
    walkDirectory(
        fullDirPath,
        '',
        bundleName,
        extensions,
        typeMap,
        assetsArray,
        specialMarksMap,
        specialMarksConfig,
        logicalNameSet,
        imageExtensions,
        relativeDir.split('/')
    );
}

// 递归遍历目录的高性能实现
function walkDirectory(currentDir, relativePath, bundleName, extensions, typeMap, assetsArray, specialMarksMap, specialMarksConfig, logicalNameSet, imageExtensions, basePathParts, parentMarks = new Set()) {
    try {
        const items = fs.readdirSync(currentDir, {withFileTypes: true});

        // 收集当前目录的特殊标记
        const currentDirMarks = new Set(parentMarks);
        const dirName = path.basename(currentDir);

        // 检查当前目录名是否符合特殊标记
        const dirMarks = checkSpecialMarks(dirName, specialMarksConfig);
        for (const mark of dirMarks) {
            currentDirMarks.add(mark);
        }

        // 先处理文件
        for (const item of items) {
            if (!item.isDirectory()) {
                processFile(
                    path.join(currentDir, item.name),
                    path.join(relativePath, item.name),
                    bundleName,
                    extensions,
                    typeMap,
                    assetsArray,
                    specialMarksMap,
                    specialMarksConfig,
                    logicalNameSet,
                    imageExtensions,
                    currentDirMarks,
                    basePathParts.concat(relativePath.split('/').filter(Boolean))
                );
            }
        }

        // 然后处理子目录
        for (const item of items) {
            if (item.isDirectory()) {
                const newRelativePath = path.join(relativePath, item.name);
                const itemMarks = checkSpecialMarks(item.name, specialMarksConfig);
                const newParentMarks = new Set([...currentDirMarks, ...itemMarks]);

                walkDirectory(
                    path.join(currentDir, item.name),
                    newRelativePath,
                    bundleName,
                    extensions,
                    typeMap,
                    assetsArray,
                    specialMarksMap,
                    specialMarksConfig,
                    logicalNameSet,
                    imageExtensions,
                    basePathParts,
                    newParentMarks
                );
            }
        }
    } catch (error) {
        console.error(`Error walking directory ${currentDir}:`, error);
    }
}

function processFile(filePath, relativePath, bundleName, extensions, typeMap, assetsArray, specialMarksMap, specialMarksConfig, logicalNameSet, imageExtensions, parentMarks, pathParts) {
    const ext = path.extname(filePath).toLowerCase().slice(1);
    if (!ext) return;

    // 检查是否有对应的类型映射
    if (!typeMap[ext]) {
        return; // 跳过没有类型映射的文件
    }

    // 检查文件扩展名是否在允许的列表中
    if (!extensions.includes(ext)) {
        return; // 跳过不在允许列表中的文件
    }

    const fileName = path.basename(filePath, `.${ext}`);
    const assetPath = relativePath.slice(0, -path.extname(relativePath).length).replace(/\\/g, '/');

    // 新增逻辑：对于图片格式，只有文件名以"l_"开头的才存储
    if (imageExtensions.includes(ext)) {
        if (!/^l_/i.test(fileName)) {
            //console.log(`  Skipping image file (doesn't start with "l_"): ${fileName}.${ext}`);
            return; // 跳过不以"l_"开头的图片文件
        }
    }

    // 创建唯一的逻辑名称
    let logicalName = fileName;
    let counter = 1;
    while (logicalNameSet.has(logicalName)) {
        console.log("[重复名字]",logicalName,fileName)
        logicalName = `${fileName}_${counter}`;
        counter++;
    }

    logicalNameSet.add(logicalName);

    // 收集文件本身可能带有的特殊标记
    const fileMarks = checkSpecialMarks(fileName, specialMarksConfig);

    // 合并所有特殊标记：父目录标记 + 文件本身标记
    const allMarks = new Set([...parentMarks, ...fileMarks]);

    // 添加到资产数组
    const assetInfo = {
        name: logicalName, // 添加name字段
        path: assetPath,
        type: typeMap[ext],
        bundle: bundleName
    };

    // 如果该资产有特殊标记，也在资产信息中记录
    if (allMarks.size > 0) {
        assetInfo.marks = Array.from(allMarks).sort();
    }

    assetsArray.push(assetInfo);

    // 将资源添加到对应的特殊标记集合中
    for (const mark of allMarks) {
        if (specialMarksMap[mark]) {
            specialMarksMap[mark].add(logicalName);
        }
    }
}

module.exports = {
    load() {
        console.log('[AssetIndexGenerator] Loaded successfully');
    },

    unload() {
        // Cleanup
    },

    methods: {
        showLog() {
            console.log('[AssetIndexGenerator] Show Log');
            runGenerator();
        }
    }
};
