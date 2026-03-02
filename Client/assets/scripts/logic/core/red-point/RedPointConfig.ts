/**
 * 应用红点组件的枚举
 *形如
    static A = 'Root|A';
    static A_1 = 'Root|A|A_1';
    static A_2 = 'Root|A|A_2';
 * 按照层级结构命名
 */


export class RedPointConfig {
    //#region 宝箱
    static box = 'box';
    static box_lv1 = 'box|box_lv1';
    static box_lv2 = 'box|box_lv2';
    static box_lv3 = 'box|box_lv3';
    static box_lv4 = 'box|box_lv4';
    static box_lv5 = 'box|box_lv5';
    static box_reward = 'box|box_reward';
    //#endregion

    //#region 菜单栏
    static menu = 'menu';

    //#region 招募
    static zhaomu = 'menu|zhaomu';
    static zhaomu_mianfei = 'menu|zhaomu|zhaomu_mianfei';
    //#endregion

    //#region 邮件
    static mail = 'menu|mail';
    static mail_xitong = 'menu|mail|mail_xitong';
    static mail_richang = 'menu|mail|mail_richang';
    static mail_gonggao = 'menu|mail|mail_gonggao';
    //#endregion

    //#region 任务
    static task = 'menu|task';
    //每日任务
    static dailyTask = 'menu|task|dailyTask';
    //每日任务item
    static dailyTask1 = 'menu|task|dailyTask|dailyTask1';
    static dailyTask2 = 'menu|task|dailyTask|dailyTask2';
    static dailyTask3 = 'menu|task|dailyTask|dailyTask3';
    static dailyTask4 = 'menu|task|dailyTask|dailyTask4';
    static dailyTask5 = 'menu|task|dailyTask|dailyTask5';
    static dailyTask6 = 'menu|task|dailyTask|dailyTask6';
    static dailyTask7 = 'menu|task|dailyTask|dailyTask7';
    static dailyTask8 = 'menu|task|dailyTask|dailyTask8';
    static dailyTask9 = 'menu|task|dailyTask|dailyTask9';
    static dailyTask10 = 'menu|task|dailyTask|dailyTask10';
    //日活跃
    static rihuoyue = 'tmenu|ask|dailyTask|rihuoyu';
    //周活跃
    static zhouhuoyue = 'menu|task|dailyTask|zhouhuoyu';
    //成就
    static chengjiu = 'menu|task|chengjiu';
    //成就item
    static chengjiu1 = 'menu|task|chengjiu|chengjiu1';
    static chengjiu2 = 'menu|task|chengjiu|chengjiu2';
    static chengjiu3 = 'menu|task|chengjiu|chengjiu3';
    static chengjiu4 = 'menu|task|chengjiu|chengjiu4';
    static chengjiu5 = 'menu|task|chengjiu|chengjiu5';
    static chengjiu6 = 'menu|task|chengjiu|chengjiu6';
    static chengjiu7 = 'menu|task|chengjiu|chengjiu7';
    static chengjiu8 = 'menu|task|chengjiu|chengjiu8';
    static chengjiu9 = 'menu|task|chengjiu|chengjiu9';
    static chengjiu10 = 'menu|task|chengjiu|chengjiu10';
    static chengjiu11 = 'menu|task|chengjiu|chengjiu11';
    static chengjiu12 = 'menu|task|chengjiu|chengjiu12';
    static chengjiu13 = 'menu|task|chengjiu|chengjiu13';
    static chengjiu14 = 'menu|task|chengjiu|chengjiu14';
    static chengjiu15 = 'menu|task|chengjiu|chengjiu15';
    //#endregion

    //#region 奖励(左侧菜单栏)
    static jiangli = 'menu|jiangli';
    //每日签到
    static jiangli_1 = 'menu|jiangli|jiangli_1';
    //每日特惠
    static jiangli_2 = 'menu|jiangli|jiangli_2';
    static jiangli_2_free = 'menu|jiangli|jiangli_2|jiangli_2_free';
    static jiangli_2_oneClick = 'menu|jiangli|jiangli_2|jiangli_2_oneClick';
    //积天好礼
    static jiangli_3 = 'menu|jiangli|jiangli_3';
    //基金商城
    static jiangli_4 = 'menu|jiangli|jiangli_4';
    //尊享特权
    static jiangli_5 = 'menu|jiangli|jiangli_5';
    static jiangli_5_4003 = 'menu|jiangli|jiangli_5|jiangli_5_4003';
    static jiangli_5_4002 = 'menu|jiangli|jiangli_5|jiangli_5_4002';
    static jiangli_5_4001 = 'menu|jiangli|jiangli_5|jiangli_5_4001';
    static jiangli_5_1 = 'menu|jiangli|jiangli_5|jiangli_5_1';
    //限购商城
    static jiangli_6 = 'menu|jiangli|jiangli_6';
    //#endregion

    //#region 好友
    static friend = 'menu|friend';
    //游戏好友
    static game_friend = 'menu|friend|game_friend';
    //游戏好友一件领取和赠送
    static friend_give = 'menu|friend|game_friend|friend_give';
    //好友申请
    static friend_apply = 'menu|friend|friend_apply';

    //#endregion

    //#endregion

    //#region 武将
    static role = 'role';
    //主公
    static leader = 'role|leader'
    //武将
    static role1 = 'role|role1'
    static role2 = 'role|role2'
    static role3 = 'role|role3'
    static role4 = 'role|role4'
    static role5 = 'role|role5'
    //#region 武将库
    static bank = "role|bank"
    //武将库item
    static bank_starUp_101 = 'role|bank|bank_starUp_101'
    static bank_starUp_102 = 'role|bank|bank_starUp_102'
    static bank_starUp_103 = 'role|bank|bank_starUp_103'
    static bank_starUp_104 = 'role|bank|bank_starUp_104'
    static bank_starUp_105 = 'role|bank|bank_starUp_105'
    static bank_starUp_106 = 'role|bank|bank_starUp_106'
    static bank_starUp_107 = 'role|bank|bank_starUp_107'
    static bank_starUp_108 = 'role|bank|bank_starUp_108'
    static bank_starUp_109 = 'role|bank|bank_starUp_109'
    static bank_starUp_110 = 'role|bank|bank_starUp_110'
    static bank_starUp_111 = 'role|bank|bank_starUp_111'
    static bank_starUp_112 = 'role|bank|bank_starUp_112'
    static bank_starUp_113 = 'role|bank|bank_starUp_113'
    static bank_starUp_114 = 'role|bank|bank_starUp_114'
    static bank_starUp_115 = 'role|bank|bank_starUp_115'
    static bank_starUp_116 = 'role|bank|bank_starUp_116'
    static bank_starUp_202 = 'role|bank|bank_starUp_202'
    static bank_starUp_203 = 'role|bank|bank_starUp_203'
    static bank_starUp_207 = 'role|bank|bank_starUp_207'
    static bank_starUp_208 = 'role|bank|bank_starUp_208'
    static bank_starUp_209 = 'role|bank|bank_starUp_209'
    static bank_starUp_210 = 'role|bank|bank_starUp_210'
    static bank_starUp_211 = 'role|bank|bank_starUp_211'
    static bank_starUp_212 = 'role|bank|bank_starUp_212'
    static bank_starUp_215 = 'role|bank|bank_starUp_215'
    static bank_starUp_220 = 'role|bank|bank_starUp_220'
    static bank_starUp_223 = 'role|bank|bank_starUp_223'
    static bank_starUp_227 = 'role|bank|bank_starUp_227'
    static bank_starUp_228 = 'role|bank|bank_starUp_228'
    static bank_starUp_301 = 'role|bank|bank_starUp_301'
    static bank_starUp_302 = 'role|bank|bank_starUp_302'
    static bank_starUp_303 = 'role|bank|bank_starUp_303'
    static bank_starUp_304 = 'role|bank|bank_starUp_304'
    static bank_starUp_305 = 'role|bank|bank_starUp_305'
    static bank_starUp_306 = 'role|bank|bank_starUp_306'
    static bank_starUp_307 = 'role|bank|bank_starUp_307'
    static bank_starUp_308 = 'role|bank|bank_starUp_308'
    static bank_starUp_312 = 'role|bank|bank_starUp_312'
    static bank_starUp_313 = 'role|bank|bank_starUp_313'
    static bank_starUp_314 = 'role|bank|bank_starUp_314'
    //#endregion

    //武将详情升星
    static role_details_starUp = 'role_details_starUp';

    //上阵
    static shangzhen = 'role|shangzhen'
    //#region 图鉴
    static book = 'role|book'
    //图鉴奖励
    static book_reward = 'role|book|book_reward'
    //所属国家
    static club1 = 'role|book|club1'
    static club2 = 'role|book|club2'
    static club3 = 'role|book|club3'
    static club4 = 'role|book|club4'
    //神器
    static club5 = 'role|book|club5'

    //#region 图鉴武将item
    static book_101 = 'role|book|club1|book_101'
    static book_102 = 'role|book|club1|book_102'
    static book_103 = 'role|book|club2|book_103'
    static book_104 = 'role|book|club2|book_104'
    static book_105 = 'role|book|club3|book_105'
    static book_106 = 'role|book|club3|book_106'
    static book_107 = 'role|book|club4|book_107'
    static book_108 = 'role|book|club4|book_108'
    static book_109 = 'role|book|club1|book_109'
    static book_110 = 'role|book|club2|book_110'
    static book_111 = 'role|book|club3|book_111'
    static book_112 = 'role|book|club4|book_112'
    static book_113 = 'role|book|club1|book_113'
    static book_114 = 'role|book|club2|book_114'
    static book_115 = 'role|book|club3|book_115'
    static book_116 = 'role|book|club4|book_116'
    static book_202 = 'role|book|club1|book_202'
    static book_203 = 'role|book|club1|book_203'
    static book_207 = 'role|book|club3|book_207'
    static book_208 = 'role|book|club3|book_208'
    static book_209 = 'role|book|club3|book_209'
    static book_210 = 'role|book|club4|book_210'
    static book_211 = 'role|book|club4|book_211'
    static book_212 = 'role|book|club4|book_212'
    static book_215 = 'role|book|club1|book_215'
    static book_220 = 'role|book|club2|book_220'
    static book_223 = 'role|book|club1|book_223'
    static book_227 = 'role|book|club4|book_227'
    static book_228 = 'role|book|club4|book_228'
    static book_301 = 'role|book|club3|book_301'
    static book_302 = 'role|book|club1|book_302'
    static book_303 = 'role|book|club1|book_303'
    static book_304 = 'role|book|club2|book_304'
    static book_305 = 'role|book|club2|book_305'
    static book_306 = 'role|book|club2|book_306'
    static book_307 = 'role|book|club3|book_307'
    static book_308 = 'role|book|club3|book_308'
    static book_312 = 'role|book|club4|book_312'
    static book_313 = 'role|book|club2|book_313'
    static book_314 = 'role|book|club2|book_314'
    //#endregion

    //#region 图鉴神器item
    static bookQi_1 = 'role|book|club5|bookQi_1'
    static bookQi_2 = 'role|book|club5|bookQi_2'
    static bookQi_3 = 'role|book|club5|bookQi_3'
    static bookQi_4 = 'role|book|club5|bookQi_4'
    static bookQi_5 = 'role|book|club5|bookQi_5'
    static bookQi_6 = 'role|book|club5|bookQi_6'
    static bookQi_7 = 'role|book|club5|bookQi_7'
    static bookQi_8 = 'role|book|club5|bookQi_8'
    static bookQi_9 = 'role|book|club5|bookQi_9'
    static bookQi_10 = 'role|book|club5|bookQi_10'
    static bookQi_11 = 'role|book|club5|bookQi_11'
    static bookQi_12 = 'role|book|club5|bookQi_12'
    static bookQi_13 = 'role|book|club5|bookQi_13'
    static bookQi_14 = 'role|book|club5|bookQi_14'
    static bookQi_15 = 'role|book|club5|bookQi_15'
    static bookQi_16 = 'role|book|club5|bookQi_16'
    static bookQi_17 = 'role|book|club5|bookQi_17'
    static bookQi_18 = 'role|book|club5|bookQi_18'
    static bookQi_19 = 'role|book|club5|bookQi_19'
    static bookQi_20 = 'role|book|club5|bookQi_20'
    static bookQi_21 = 'role|book|club5|bookQi_21'
    static bookQi_22 = 'role|book|club5|bookQi_22'
    static bookQi_23 = 'role|book|club5|bookQi_23'
    static bookQi_24 = 'role|book|club5|bookQi_24'
    static bookQi_25 = 'role|book|club5|bookQi_25'
    static bookQi_26 = 'role|book|club5|bookQi_26'
    static bookQi_27 = 'role|book|club5|bookQi_27'
    static bookQi_28 = 'role|book|club5|bookQi_28'
    static bookQi_29 = 'role|book|club5|bookQi_29'
    static bookQi_30 = 'role|book|club5|bookQi_30'
    static bookQi_31 = 'role|book|club5|bookQi_31'
    static bookQi_32 = 'role|book|club5|bookQi_32'
    static bookQi_33 = 'role|book|club5|bookQi_33'
    static bookQi_34 = 'role|book|club5|bookQi_34'
    static bookQi_35 = 'role|book|club5|bookQi_35'
    static bookQi_36 = 'role|book|club5|bookQi_36'
    static bookQi_37 = 'role|book|club5|bookQi_37'
    static bookQi_38 = 'role|book|club5|bookQi_38'
    static bookQi_39 = 'role|book|club5|bookQi_39'
    static bookQi_40 = 'role|book|club5|bookQi_40'
    //#endregion

    //#endregion

    //仓库
    static cangku = 'role|cangku'

    //#endregion

    //#region 装备
    static equip = 'equip';
    //装备页面五个角色
    static rolePos_1 = 'equip|rolePos_1'
    static rolePos_2 = 'equip|rolePos_2'
    static rolePos_3 = 'equip|rolePos_3'
    static rolePos_4 = 'equip|rolePos_4'
    static rolePos_5 = 'equip|rolePos_5'
    // 每个角色的装备
    static equip_1_1 = 'equip|rolePos_1|equip_1_1'
    static equip_1_2 = 'equip|rolePos_1|equip_1_2'
    static equip_1_3 = 'equip|rolePos_1|equip_1_3'
    static equip_1_4 = 'equip|rolePos_1|equip_1_4'
    static equip_1_5 = 'equip|rolePos_1|equip_1_5'

    static equip_2_1 = 'equip|rolePos_2|equip_2_1'
    static equip_2_2 = 'equip|rolePos_2|equip_2_2'
    static equip_2_3 = 'equip|rolePos_2|equip_2_3'
    static equip_2_4 = 'equip|rolePos_2|equip_2_4'
    static equip_2_5 = 'equip|rolePos_2|equip_2_5'

    static equip_3_1 = 'equip|rolePos_3|equip_3_1'
    static equip_3_2 = 'equip|rolePos_3|equip_3_2'
    static equip_3_3 = 'equip|rolePos_3|equip_3_3'
    static equip_3_4 = 'equip|rolePos_3|equip_3_4'
    static equip_3_5 = 'equip|rolePos_3|equip_3_5'

    static equip_4_1 = 'equip|rolePos_4|equip_4_1'
    static equip_4_2 = 'equip|rolePos_4|equip_4_2'
    static equip_4_3 = 'equip|rolePos_4|equip_4_3'
    static equip_4_4 = 'equip|rolePos_4|equip_4_4'
    static equip_4_5 = 'equip|rolePos_4|equip_4_5'

    static equip_5_1 = 'equip|rolePos_5|equip_5_1'
    static equip_5_2 = 'equip|rolePos_5|equip_5_2'
    static equip_5_3 = 'equip|rolePos_5|equip_5_3'
    static equip_5_4 = 'equip|rolePos_5|equip_5_4'
    static equip_5_5 = 'equip|rolePos_5|equip_5_5'

    //#endregion

    //#region 副本
    static fuben = 'fuben';
    // 神兽考验
    static boss = 'fuben|boss'

    //#endregion

    //#region 挂机
    static guaji = 'guaji';
    //离线奖励已满
    static guaji_max = 'guaji|guaji_max';
    //有知识币未使用
    static zhishibi = "guaji|zhishibi"
    //有挂机等级奖励未领取
    static level_reward = 'guaji|level_reward'
    //等级奖励
    static level_reward_1 = 'guaji|level_reward|level_reward_1'
    static level_reward_2 = 'guaji|level_reward|level_reward_2'
    static level_reward_3 = 'guaji|level_reward|level_reward_3'
    static level_reward_4 = 'guaji|level_reward|level_reward_4'
    static level_reward_5 = 'guaji|level_reward|level_reward_5'
    static level_reward_6 = 'guaji|level_reward|level_reward_6'
    static level_reward_7 = 'guaji|level_reward|level_reward_7'
    static level_reward_8 = 'guaji|level_reward|level_reward_8'
    static level_reward_9 = 'guaji|level_reward|level_reward_9'
    static level_reward_10 = 'guaji|level_reward|level_reward_10'
    //#endregion

    //#region 点金
    static dianjin = 'dianjin';
    static dianjin_free = 'dianjin|dianjin_free';

    //#endregion

    //#region 七日签到
    static seven_sign = 'seven_sign'
    //#endregion

    //#region 客厅
    static livingroom = 'livingroom'

    //#region 钓鱼
    static fishing = 'livingroom|fishing'
    static free_fishing = 'livingroom|fishing|free_fishing'
    //#endregion

    //#region 鱼缸
    static fish_tank = 'livingroom|fish_tank'

    //鱼灵
    static fish_1001 = 'livingroom|fish_tank|fish_1001'
    static fish_1002 = 'livingroom|fish_tank|fish_1002'
    static fish_1003 = 'livingroom|fish_tank|fish_1003'
    static fish_1004 = 'livingroom|fish_tank|fish_1004'

    static fish_2001 = 'livingroom|fish_tank|fish_2001'
    static fish_2002 = 'livingroom|fish_tank|fish_2002'
    static fish_2003 = 'livingroom|fish_tank|fish_2003'
    static fish_2004 = 'livingroom|fish_tank|fish_2004'

    static fish_3001 = 'livingroom|fish_tank|fish_3001'
    static fish_3002 = 'livingroom|fish_tank|fish_3002'
    static fish_3003 = 'livingroom|fish_tank|fish_3003'
    static fish_3004 = 'livingroom|fish_tank|fish_3004'

    static fish_4001 = 'livingroom|fish_tank|fish_4001'
    static fish_4002 = 'livingroom|fish_tank|fish_4002'
    static fish_4003 = 'livingroom|fish_tank|fish_4003'
    static fish_4004 = 'livingroom|fish_tank|fish_4004'

    static fish_5001 = 'livingroom|fish_tank|fish_5001'
    static fish_5002 = 'livingroom|fish_tank|fish_5002'
    static fish_5003 = 'livingroom|fish_tank|fish_5003'
    static fish_5004 = 'livingroom|fish_tank|fish_5004'

    static fish_6001 = 'livingroom|fish_tank|fish_6001'
    static fish_6002 = 'livingroom|fish_tank|fish_6002'
    static fish_6003 = 'livingroom|fish_tank|fish_6003'
    static fish_6004 = 'livingroom|fish_tank|fish_6004'

    static fish_7001 = 'livingroom|fish_tank|fish_7001'
    static fish_7002 = 'livingroom|fish_tank|fish_7002'
    static fish_7003 = 'livingroom|fish_tank|fish_7003'
    static fish_7004 = 'livingroom|fish_tank|fish_7004'

    static fish_8001 = 'livingroom|fish_tank|fish_8001'
    static fish_8002 = 'livingroom|fish_tank|fish_8002'
    static fish_8003 = 'livingroom|fish_tank|fish_8003'
    static fish_8004 = 'livingroom|fish_tank|fish_8004'

    static fish_9001 = 'livingroom|fish_tank|fish_9001'
    static fish_9002 = 'livingroom|fish_tank|fish_9002'
    static fish_9003 = 'livingroom|fish_tank|fish_9003'
    static fish_9004 = 'livingroom|fish_tank|fish_9004'

    static fish_10001 = 'livingroom|fish_tank|fish_10001'
    static fish_10002 = 'livingroom|fish_tank|fish_10002'
    static fish_10003 = 'livingroom|fish_tank|fish_10003'
    static fish_10004 = 'livingroom|fish_tank|fish_10004'

    static fish_11001 = 'livingroom|fish_tank|fish_11001'
    static fish_11002 = 'livingroom|fish_tank|fish_11002'
    static fish_11003 = 'livingroom|fish_tank|fish_11003'
    static fish_11004 = 'livingroom|fish_tank|fish_11004'

    static fish_12001 = 'livingroom|fish_tank|fish_12001'
    static fish_12002 = 'livingroom|fish_tank|fish_12002'
    static fish_12003 = 'livingroom|fish_tank|fish_12003'
    static fish_12004 = 'livingroom|fish_tank|fish_12004'

    static fish_13001 = 'livingroom|fish_tank|fish_13001'
    static fish_13002 = 'livingroom|fish_tank|fish_13002'
    static fish_13003 = 'livingroom|fish_tank|fish_13003'
    static fish_13004 = 'livingroom|fish_tank|fish_13004'


    static fish_14001 = 'livingroom|fish_tank|fish_14001'
    static fish_14002 = 'livingroom|fish_tank|fish_14002'
    static fish_14003 = 'livingroom|fish_tank|fish_14003'
    static fish_14004 = 'livingroom|fish_tank|fish_14004'

    static fish_15001 = 'livingroom|fish_tank|fish_15001'
    static fish_15002 = 'livingroom|fish_tank|fish_15002'
    static fish_15003 = 'livingroom|fish_tank|fish_15003'
    static fish_15004 = 'livingroom|fish_tank|fish_15004'

    static fish_16001 = 'livingroom|fish_tank|fish_16001'
    static fish_16002 = 'livingroom|fish_tank|fish_16002'
    static fish_16003 = 'livingroom|fish_tank|fish_16003'
    static fish_16004 = 'livingroom|fish_tank|fish_16004'

    static fish_17001 = 'livingroom|fish_tank|fish_17001'
    static fish_17002 = 'livingroom|fish_tank|fish_17002'
    static fish_17003 = 'livingroom|fish_tank|fish_17003'
    static fish_17004 = 'livingroom|fish_tank|fish_17004'

    static fish_18001 = 'livingroom|fish_tank|fish_18001'
    static fish_18002 = 'livingroom|fish_tank|fish_18002'
    static fish_18003 = 'livingroom|fish_tank|fish_18003'
    static fish_18004 = 'livingroom|fish_tank|fish_18004'

    static fish_19001 = 'livingroom|fish_tank|fish_19001'
    static fish_19002 = 'livingroom|fish_tank|fish_19002'
    static fish_19003 = 'livingroom|fish_tank|fish_19003'
    static fish_19004 = 'livingroom|fish_tank|fish_19004'

    static fish_20001 = 'livingroom|fish_tank|fish_20001'
    static fish_20002 = 'livingroom|fish_tank|fish_20002'
    static fish_20003 = 'livingroom|fish_tank|fish_20003'
    static fish_20004 = 'livingroom|fish_tank|fish_20004'

    static fish_21001 = 'livingroom|fish_tank|fish_21001'
    static fish_21002 = 'livingroom|fish_tank|fish_21002'
    static fish_21003 = 'livingroom|fish_tank|fish_21003'
    static fish_21004 = 'livingroom|fish_tank|fish_21004'

    static fish_22001 = 'livingroom|fish_tank|fish_22001'
    static fish_22002 = 'livingroom|fish_tank|fish_22002'
    static fish_22003 = 'livingroom|fish_tank|fish_22003'
    static fish_22004 = 'livingroom|fish_tank|fish_22004'

    static fish_23001 = 'livingroom|fish_tank|fish_23001'
    static fish_23002 = 'livingroom|fish_tank|fish_23002'
    static fish_23003 = 'livingroom|fish_tank|fish_23003'
    static fish_23004 = 'livingroom|fish_tank|fish_23004'


    static fish_24001 = 'livingroom|fish_tank|fish_24001'
    static fish_24002 = 'livingroom|fish_tank|fish_24002'
    static fish_24003 = 'livingroom|fish_tank|fish_24003'
    static fish_24004 = 'livingroom|fish_tank|fish_24004'

    static fish_25001 = 'livingroom|fish_tank|fish_25001'
    static fish_25002 = 'livingroom|fish_tank|fish_25002'
    static fish_25003 = 'livingroom|fish_tank|fish_25003'
    static fish_25004 = 'livingroom|fish_tank|fish_25004'

    static fish_26001 = 'livingroom|fish_tank|fish_26001'
    static fish_26002 = 'livingroom|fish_tank|fish_26002'
    static fish_26003 = 'livingroom|fish_tank|fish_26003'
    static fish_26004 = 'livingroom|fish_tank|fish_26004'

    static fish_27001 = 'livingroom|fish_tank|fish_27001'
    static fish_27002 = 'livingroom|fish_tank|fish_27002'
    static fish_27003 = 'livingroom|fish_tank|fish_27003'
    static fish_27004 = 'livingroom|fish_tank|fish_27004'

    static fish_28001 = 'livingroom|fish_tank|fish_28001'
    static fish_28002 = 'livingroom|fish_tank|fish_28002'
    static fish_28003 = 'livingroom|fish_tank|fish_28003'
    static fish_28004 = 'livingroom|fish_tank|fish_28004'

    static fish_29001 = 'livingroom|fish_tank|fish_29001'
    static fish_29002 = 'livingroom|fish_tank|fish_29002'
    static fish_29003 = 'livingroom|fish_tank|fish_29003'
    static fish_29004 = 'livingroom|fish_tank|fish_29004'

    static fish_30001 = 'livingroom|fish_tank|fish_30001'
    static fish_30002 = 'livingroom|fish_tank|fish_30002'
    static fish_30003 = 'livingroom|fish_tank|fish_30003'
    static fish_30004 = 'livingroom|fish_tank|fish_30004'

    static fish_31001 = 'livingroom|fish_tank|fish_31001'
    static fish_31002 = 'livingroom|fish_tank|fish_31002'
    static fish_31003 = 'livingroom|fish_tank|fish_31003'
    static fish_31004 = 'livingroom|fish_tank|fish_31004'

    static fish_32001 = 'livingroom|fish_tank|fish_32001'
    static fish_32002 = 'livingroom|fish_tank|fish_32002'
    static fish_32003 = 'livingroom|fish_tank|fish_32003'
    static fish_32004 = 'livingroom|fish_tank|fish_32004'

    static fish_33001 = 'livingroom|fish_tank|fish_33001'
    static fish_33002 = 'livingroom|fish_tank|fish_33002'
    static fish_33003 = 'livingroom|fish_tank|fish_33003'
    static fish_33004 = 'livingroom|fish_tank|fish_33004'

    static fish_34001 = 'livingroom|fish_tank|fish_34001'
    static fish_34002 = 'livingroom|fish_tank|fish_34002'
    static fish_34003 = 'livingroom|fish_tank|fish_34003'
    static fish_34004 = 'livingroom|fish_tank|fish_34004'

    static fish_35001 = 'livingroom|fish_tank|fish_35001'
    static fish_35002 = 'livingroom|fish_tank|fish_35002'
    static fish_35003 = 'livingroom|fish_tank|fish_35003'
    static fish_35004 = 'livingroom|fish_tank|fish_35004'

    static fish_36001 = 'livingroom|fish_tank|fish_36001'
    static fish_36002 = 'livingroom|fish_tank|fish_36002'
    static fish_36003 = 'livingroom|fish_tank|fish_36003'
    static fish_36004 = 'livingroom|fish_tank|fish_36004'

    static fish_37001 = 'livingroom|fish_tank|fish_37001'
    static fish_37002 = 'livingroom|fish_tank|fish_37002'
    static fish_37003 = 'livingroom|fish_tank|fish_37003'
    static fish_37004 = 'livingroom|fish_tank|fish_37004'

    static fish_38001 = 'livingroom|fish_tank|fish_38001'
    static fish_38002 = 'livingroom|fish_tank|fish_38002'
    static fish_38003 = 'livingroom|fish_tank|fish_38003'
    static fish_38004 = 'livingroom|fish_tank|fish_38004'

    static fish_39001 = 'livingroom|fish_tank|fish_39001'
    static fish_39002 = 'livingroom|fish_tank|fish_39002'
    static fish_39003 = 'livingroom|fish_tank|fish_39003'
    static fish_39004 = 'livingroom|fish_tank|fish_39004'

    static fish_40001 = 'livingroom|fish_tank|fish_40001'
    static fish_40002 = 'livingroom|fish_tank|fish_40002'
    static fish_40003 = 'livingroom|fish_tank|fish_40003'
    static fish_40004 = 'livingroom|fish_tank|fish_40004'
    //#endregion

    //#endregion 
}