const {ccclass, property} = cc._decorator

import UIBase from "./UIBase"
import UIManager from "../UIManager"
import { Util } from "../util/Util"

@ccclass
export default class StartMenu extends UIBase {

    @property({
        tooltip: "start button",
        type: cc.Node
    })
    startBtn: cc.Node | undefined = undefined

    @property({
        tooltip: "level select button",
        type: cc.Node
    })
    levelSelectBtn: cc.Node | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /** super 调用父类方法, super 作为对象，在普通方法中，指向父类的原型对象，在静态方法中，指向父类 */
        super.onLoad()
    }

    show() {
        /** 将该节点显示 */
        super.show()

        // 获取 startBtn 的子元素，就是那个 饼
        const node = this.startBtn.children[0]
        /** 防止 tween 重复调用 */
        node.stopAllActions()
        node.angle = 0
        /** tween 动画 */
        cc.tween(node).repeatForever(
            cc.tween()
                .to(1, { angle: 20 })
                .to(1, { angle: 0})
        ).start()
    }

    init(uiManager: UIManager) {
        /** 事件监听 */
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = cc.Node.EventType

        /** 开始游戏按钮 --> 实例化 控制面板（controlPanel） */
        Util.onTouch(this.startBtn, () => {
            /** 默认第一关 */
            uiManager.startGame(1)
        })

        /** 关卡选择按钮 --> 实例化关卡选择 */
        Util.onTouch(this.levelSelectBtn, () => {
            uiManager.toLevelSelect()
        })
    }
}
