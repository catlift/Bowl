const {ccclass, property} = cc._decorator

import UIManager from "../UIManager"
import { DataStroge } from "../util/DataStroge"
import { Util } from "../util/Util"
import UIBase from "./UIBase"

@ccclass
export default class LevelSelect extends UIBase {

    @property(cc.Node) levelSelectRoot: cc.Node | undefined = undefined

    @property(cc.Node) backStartMenuBtn: cc.Node | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad()
    }

    show(): void {
        super.show()

        /** 关卡 是否已经解锁 */
        this.levelSelectRoot.children.forEach((node, index) => {
            const unLockLevel = DataStroge.getUnLockLevel()
            /** 解锁 文本 的设置*/
            const clockLabel = node.children[1]
            const clockComp = clockLabel.getComponent(cc.Label)
            const level = index + 1
            /** 已经解锁 */
            clockComp.string = level <= unLockLevel ? "已解锁" : "未解锁"
            
        })
    }

    // update (dt) {}

    init(uiManager: UIManager) {
        /** 触摸事件监听 */
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = cc.Node.EventType

        /** 返回开始菜单 按钮 */
        Util.onTouch(this.backStartMenuBtn, () => {
            uiManager.backStartMenu()
        })

        /** 关卡选择按钮 添加事件监听 */
        this.levelSelectRoot.children.forEach((node, index) => {
            const button = node.children[0]
            /** 选择关卡后，实例化 控制面板（controlPanel） */
            Util.onTouch(button, () => {
                const level: number = index + 1
                const unLockLevel = DataStroge.getUnLockLevel()
                if(level <= unLockLevel) {
                    uiManager.startGame(level)
                }
            })
        })
    }
}
