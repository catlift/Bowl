const {ccclass, property} = cc._decorator

import StaticInstance from "./StaticInstance"
import { PhysicsManager } from "./util/PhysicsManager"
import GameConfig from "./config/GameConfig"
import { DataStroge } from "./util/DataStroge"
import { MusicManager } from "./MusicManager"

/** 接口 */
interface MidConfig {
    level: number,
    count: number,
    node: cc.Node
}

@ccclass
export default class GameManager extends cc.Component {

    /** 碗的节点 */
    @property(cc.Node) bowl: cc.Node | undefined = undefined
    /** 碗的 spriteFrame 替换 */
    @property(cc.SpriteFrame) bowlSprite: cc.SpriteFrame[] = []
    /** 食物的根节点 */
    @property(cc.Node) foods: cc.Node | undefined = undefined
    /** 食物预制体 */
    @property([cc.Prefab]) foodsPrefab: cc.Prefab[] = []
    /** 食物下落速度 */
    private speed: number = 100

    /** 记录食物当前数据，例如：当前关卡 level, 第一个食物 count = 0 */
    midConfig: MidConfig =  {
        level: 0,
        count: 0,
        node: null
    }

    /** 物理检测CD */
    private checkTime: number = 0
    private checkCd: number = 0.2

    /** 循环遍历所有食物，检测是否为静态 */
    get allBodyStop(): boolean {
        for(let i = 0; i < this.foods.childrenCount; i++) {
            const node = this.foods.children[i]
            const body = node.getComponent(cc.RigidBody)
            /** fuzzyEquals 近似判断两个点是否相等 */
            if( !body.linearVelocity.fuzzyEquals(cc.v2(0, 0), 0.5) ) {
                return false
            }
        }
        return true
    }

    /** 循环遍历所有食物，检测是否存在未下落食物 */
    get someBodyStatic(): boolean {
        for(let i = 0; i < this.foods.childrenCount; i++) {
            const node = this.foods.children[i]
            const body = node.getComponent(cc.RigidBody)
            /** fuzzyEquals 近似判断两个点是否相等 */
            if( body.type === cc.RigidBodyType.Static ) {
                return true
            }
        }
        return false
    }

    /** 获取 配置好 的食物类型 */
    get nowFoodType(): number {
        return GameConfig[this.midConfig.level][this.midConfig.count]
    }

    /** 
     * 还能不能创建食物
     * 或者说，所有的食物是否都到碗里面，true --> 游戏胜利 
     */
    get canAddFood(): boolean {
        const length = GameConfig[this.midConfig.level].length
        if(this.midConfig.count >= length) {
            return false
        } 
        return true
    }

    /** 游戏是否开始 */
    isPlaying: boolean = false

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /** 传入静态单例脚本 */
        StaticInstance.setGameManager(this)
        /** 使用刚体工具类，开启物理引擎 */
        PhysicsManager.openPhysicsManager()

        /** 隐藏碗 */
        this.hiddenBowl()

        /** 播放音乐 */
        MusicManager.getInstance().playBGM()
    }

    /** 点击 开始游戏 后 */
    startGame(level: number) {
        /** 显示碗,并执行其身上的动画 */
        this.showBowl()

        cc.log(`第${level}关，数据：${GameConfig[level]}`)

        // 第一个食物
        this.midConfig.count = 0
        this.midConfig.level = level
        this.midConfig.node = this.addFood(this.nowFoodType)
        /** 游戏已经开始，开启检测 */
        this.isPlaying = true
    }

    /** 生成食物 */
    addFood(index: number) {
        /** 初始位置 */
        const pos = cc.v2(0, 450)
        /** 生成预制体 */
        const food = cc.instantiate(this.foodsPrefab[index])
        /** 添加到节点树 */
        this.foods.addChild(food)
        /** 设置位置 */
        food.setPosition(pos)
        /** 将刚体设置为静态 */
        PhysicsManager.setRigidBodyStatic(food)
        /** 食物增加 */
        this.midConfig.count += 1
        /** 刷新UI */
        this.updateLevelInfo()
        /** 返回数据 */
        return food
    }

    /** 食物刚体检测 */
    checkAllBody() {
        /** 判断 当 游戏未开始 || 有食物为下落 || 有食物未停止 return */
        if(!this.isPlaying ||  this.someBodyStatic || !this.allBodyStop) { return }
        /** 判断还能不能创建食物 */
        if(!this.canAddFood) {
            /** 游戏停止 */
            this.isPlaying = false
            /** 游戏胜利 */
            this.gameWin()
            return
        }

        /** 所有刚体停下来后就创建新食物 */
        this.midConfig.node = this.addFood(this.nowFoodType)
    }

    gameWin() {
        /** 播放音效 */
        MusicManager.getInstance().playWinEffect()
        /** 游戏胜利界面 */
        StaticInstance.uiManager.showWinPanel()
        /** 最后一关 不显示 下一关 */
        if(this.midConfig.level >= DataStroge.getMaxLevel()) {
            StaticInstance.uiManager.hiddenNextLevelBtn()
            return
        }
        /** 玩已经解锁的关卡不存储数据 */
        if(this.midConfig.level < DataStroge.getUnLockLevel()) {
            return
        }
        /** 解锁下一个关卡 */
        DataStroge.setUnLockLevel(this.midConfig.level + 1)
    }

    /** 食物掉出碗外 */
    checkFall() {
        let hasFaLL: Boolean = false
        /** 遍历 foods，判断是否有食物掉出碗外 */
        for(let i = 0; i < this.foods.childrenCount; i++) {
            const node = this.foods.children[i]
            if(node.y < -800) {
                hasFaLL = true
                break
            }
        }
        /** 如果有，则游戏失败 */
        if(hasFaLL) {
            /** 游戏停止 */
            this.isPlaying = false
            /** 播放音效 */
            MusicManager.getInstance().playLoseEffect()
            /** 游戏失败面板显示 */
            StaticInstance.uiManager.showLosePanel()
        }
    }

    update(dt: number): void {
        if(!this.isPlaying) return

        this.checkTime += dt
        if(this.checkTime > this.checkCd) {
             /** 归零 */
             this.checkTime = 0
            /** 进行食物刚体检测 */
            this.checkAllBody()
            /** 食物掉出碗外 */
            this.checkFall()
        }
    }

    /** 更新当前关卡信息 */
    updateLevelInfo() {
        const level = this.midConfig.level
        const nowFood = this.midConfig.count
        const allFoods = GameConfig[level].length
        StaticInstance.uiManager.updateLevelInfo(level, nowFood, allFoods)
    }

    /** 碗的显示 */
    showBowl() {
        this.bowl.active = true
        /** 防止 tween 重复调用 */
        this.bowl.stopAllActions()
        /** 碗的转眼动画 */
        cc.tween(this.bowl).repeatForever(
            cc.tween()
                .delay(2)
                .call(()=> {
                    this.bowl.getComponent(cc.Sprite).spriteFrame = this.bowlSprite[1]
                })
                .delay(0.3)
                .call(() => {
                    this.bowl.getComponent(cc.Sprite).spriteFrame = this.bowlSprite[0]
                })
        ).start()
    }
    /** 碗的隐藏 */
    hiddenBowl() {
        this.bowl.active = false
    }

    /** 食物旋转 */
    onRotateFood(angle: number) {
        if(!this.midConfig.node) return
        this.midConfig.node.angle = -angle
    }

    /** 向左边移动食物 */
    onClickLeftFood(dt: number) {
        if(!this.midConfig.node) return
        this.midConfig.node.x -= this.speed * dt
    }

    /** 向右边移动食物 */
    onClickRightFood(dt: number) {
        if(!this.midConfig.node) return
        this.midConfig.node.x += this.speed * dt
    }

    /** 点击 下落按钮 */
    onClickDownFood() {
        if(!this.midConfig.node) return
        /** 测试 */
        /** 改变刚体 type */
        const node = this.midConfig.node
        /** 将刚体改成动态 */
        PhysicsManager.setRigidBodyDynamic(node)
        /** 设置线性速度 */
        PhysicsManager.setRigidBodyLinearVelocity(node, cc.v2(0, -5))
        /** 点击下落后，不能再控制食物 */
        this.midConfig.node = null
    }


    /** 进入下一关 */
    onClickNextLevel() {
        /** 清空食物 */
        this.clearAllFoods()
        /** 存储关卡的信息 + 1 */
        this.midConfig.level += 1
        /** 界面加载 */
        StaticInstance.uiManager.startGame(this.midConfig.level)
    }

    /** 重新开始游戏（重新开始当前关卡） */
    onClickPlayAgain() {
        /** 清空食物 */
        this.clearAllFoods()
        /** 界面加载 */
        StaticInstance.uiManager.startGame(this.midConfig.level)
    }

    /** 清空所有食物 */
    clearAllFoods() {
        this.foods.removeAllChildren()
    }
}
