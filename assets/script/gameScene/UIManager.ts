const {ccclass, property} = cc._decorator

import { UIType } from "./enum/Enum"
import StaticInstance from "./StaticInstance"
import LevelInfo from "./ui/LevelInfo"
import UIBase from "./ui/UIBase"
import WinPanel from "./ui/WinPanel"

@ccclass
export default class UIManager extends cc.Component {

    @property({
        type: cc.Prefab,
        tooltip: "开始菜单,预制体"
    })
    startMenuPre: cc.Prefab | undefined = undefined

    @property({
        type: cc.Prefab,
        tooltip: "关卡选择,预制体"
    })
    levelSelectPre: cc.Prefab | undefined = undefined

    @property({
        type: cc.Prefab,
        tooltip: "控制面板,预制体"
    })
    controlPanel: cc.Prefab | undefined = undefined

    @property({
        type: cc.Prefab,
        tooltip: "关卡信息，预制体"
    })
    levelInfo: cc.Prefab | undefined = undefined

    @property({
        type: cc.Prefab,
        tooltip: "胜利面板，预制体"
    })
    winPanel: cc.Prefab | undefined = undefined

    @property({
        type: cc.Prefab,
        tooltip: "失败面板，预制体"
    })
    losePanel: cc.Prefab | undefined = undefined

    /** 
     * Map<key, value>() 对象保存键值对，并且能够记住键的原始插入顺序 
     * @param UIType enum UIType
     * @param UIBase UIBase.ts
     */
    private uiMap = new Map<UIType, UIBase>()

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /** 传入静态单例脚本 */
        StaticInstance.setUIManager(this)
    }

    start () {
        /** 实例化预制体 */
        this.initStartMenu()
        this.initLevelSelect()
        this.initControlPanel()
        this.initLevelInfo()
        this.initWinPanel()
        this.initLosePanel()
    }

    // update (dt) {}

    /** 点击 游戏开始 后执行的函数 --> 游戏进行界面显示 */
    startGame(level: number) {
        this.showUI([UIType.controlPanel, UIType.levelInfo])
        StaticInstance.gameManager.startGame(level)
    }

    /** 点击 关卡选择 后执行的函数 --> 关卡选择界面 */
    toLevelSelect() {
        this.showUI([UIType.levelSelect])
    }

    /** 返回开始菜单 */
    backStartMenu() {
        this.showUI([UIType.startMenu])
    }

    /** 游戏失败界面显示 */
    showLosePanel() {
        /** 面板显示 */
        this.showUI([UIType.losePanel])
    }

    /** 游戏胜利面板显示 */
    showWinPanel() {
        /** 面板显示 */
        this.showUI([UIType.winPanel])
    }

    /** 
     * 传入你想展示的 ui
     * 在 uiMap 遍历，如果有：就展示，如果没有：就全部隐藏
     */
    showUI(showTypes: UIType[]) {
        /** foreach(ui: 脚本, type: 当前元素的索引值) */
        this.uiMap.forEach((ui, type) => {
            showTypes.includes(type) ? ui.show() : ui.hidden()
        })
    }

    /** 更新当前关卡信息 */
    updateLevelInfo(level: number, nowFoodCount: number, allFoodCount: number) {
        /** 从 uiMap 中获取到 LevelInfo 组件，并且断言为 LevelInfo (主要是为了智能提示效果) */
        const levelInfo = this.uiMap.get(UIType.levelInfo) as LevelInfo
        /** 第几关 */
        levelInfo.setLevelLabel(level)
        /** 食物数量 */
        levelInfo.setItemsLabel(nowFoodCount, allFoodCount)
    }


    /** 返回 开始菜单（游戏开始界面） */
    onClickBackToStartMenu() {
        const gameMgr = StaticInstance.gameManager
        /** 清空食物 */
        gameMgr.clearAllFoods()
        /** 隐藏碗 */
        gameMgr.hiddenBowl()
        /** 显示开始菜单 */
        this.backStartMenu()
    }

    /** 进入下一关 */
    onClickNextLevel() {
        StaticInstance.gameManager.onClickNextLevel()
    }

    /** 重新开始游戏（重新开始当前关卡） */
    onClickPlayAgain() {
        StaticInstance.gameManager.onClickPlayAgain()
    }

    /** 隐藏 “下一关” 的按钮 */
    hiddenNextLevelBtn() {
        /** 从 uiMap 中获取到 LevelInfo 组件，并且断言为 LevelInfo (主要是为了智能提示效果) */
        const winPanel = this.uiMap.get(UIType.winPanel) as WinPanel
        winPanel.nextLevelBtn.active = false
    }


    /** 旋转食物 */
    onRotateFood(angle: number) {
        StaticInstance.gameManager.onRotateFood(angle)
    }
    /** 向左边移动食物 */
    onClickLeftFood(dt: number) {
        StaticInstance.gameManager.onClickLeftFood(dt)
    }
    /** 向右边移动食物 */
    onClickRightFood(dt: number) {
        StaticInstance.gameManager.onClickRightFood(dt)
    }
    /** 点击 下落按钮 */
    onClickDownFood() {
        StaticInstance.gameManager.onClickDownFood()
    }


    /** 生成预制体并调用其身上的脚本方法 */
    private initStartMenu() {
        /** 实例化预制体 */
        const node = cc.instantiate(this.startMenuPre)
        /** 加入节点树 */
        this.node.addChild(node)
        /** 设置实例化的预制体的位置 */
        node.setPosition(0, 0)
        /** 获取预制体身上的组件 */
        const comp = node.getComponent("StartMenu")
        /** 调用组件的初始化方法 */
        comp.init(this)
        /** 设置 uiMap 的键值对 */
        this.uiMap.set(UIType.startMenu, comp)
    }

    /** 生成预制体并调用其身上的脚本方法 */
    private initLevelSelect() {
        /** 实例化预制体 */
        const node = cc.instantiate(this.levelSelectPre)
        /** 加入节点树 */
        this.node.addChild(node)
        /** 设置实例化的预制体的位置 */
        node.setPosition(0, 0)
        /** 获取预制体身上的组件 */
        const comp = node.getComponent("LevelSelect")
        /** 调用组件的初始化方法 */
        comp.init(this)
        /** 设置 uiMap 的键值对 */
        this.uiMap.set(UIType.levelSelect, comp)
    }

    /** 生成预制体并调用其身上的脚本方法 */
    private initControlPanel() {
        /** 实例化预制体 */
        const node = cc.instantiate(this.controlPanel)
        /** 加入节点树 */
        this.node.addChild(node)
        /** 设置实例化的预制体的位置 */
        node.setPosition(0, 0)
        /** 获取预制体身上的组件 */
        const comp = node.getComponent("ControlPanel")
        /** 调用组件的初始化方法 */
        comp.init(this)
        /** 设置 uiMap 的键值对 */
        this.uiMap.set(UIType.controlPanel, comp)
    }

    /** 生成预制体并调用其身上的脚本方法 */
    private initLevelInfo() {
        /** 实例化预制体 */
        const node = cc.instantiate(this.levelInfo)
        /** 加入节点树 */
        this.node.addChild(node)
        /** 设置实例化的预制体的位置 */
        node.setPosition(0, 0)
        /** 获取预制体身上的组件 */
        const comp = node.getComponent("LevelInfo")
        /** 设置 uiMap 的键值对 */
        this.uiMap.set(UIType.levelInfo, comp)
    }

    /** 生成预制体并调用其身上的脚本方法 */
    private initWinPanel() {
        /** 实例化预制体 */
        const node = cc.instantiate(this.winPanel)
        /** 加入节点树 */
        this.node.addChild(node)
        /** 设置实例化的预制体的位置 */
        node.setPosition(0, 0)
        /** 获取预制体身上的组件 */
        const comp = node.getComponent("WinPanel")
        /** 调用组件的初始化方法 */
        comp.init(this)
        /** 设置 uiMap 的键值对 */
        this.uiMap.set(UIType.winPanel, comp)
    }

    /** 生成预制体并调用其身上的脚本方法 */
    private initLosePanel() {
        /** 实例化预制体 */
        const node = cc.instantiate(this.losePanel)
        /** 加入节点树 */
        this.node.addChild(node)
        /** 设置实例化的预制体的位置 */
        node.setPosition(0, 0)
        /** 获取预制体身上的组件 */
        const comp = node.getComponent("LosePanel")
        /** 调用组件的初始化方法 */
        comp.init(this)
        /** 设置 uiMap 的键值对 */
        this.uiMap.set(UIType.losePanel, comp)
    }
}
