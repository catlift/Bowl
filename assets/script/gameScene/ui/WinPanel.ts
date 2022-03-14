const {ccclass, property} = cc._decorator

import UIManager from "../UIManager"
import { Util } from "../util/Util"
import UIBase from "./UIBase"

@ccclass
export default class WinPanel extends UIBase {

    @property(cc.Node) backToStartMenuBtn: cc.Node | undefined = undefined
    @property(cc.Node) nextLevelBtn: cc.Node | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad()
    }

    init(uiManager: UIManager) {
        /** 默认显示 下一关 的按钮选项 */
        this.nextLevelBtn.active = true
        /** 回到首页 */
        Util.onTouch(this.backToStartMenuBtn, () => {
            uiManager.onClickBackToStartMenu()
        })
        /** 下一关 */
        Util.onTouch(this.nextLevelBtn, () => {
            uiManager.onClickNextLevel()
        })
    }

    
}
