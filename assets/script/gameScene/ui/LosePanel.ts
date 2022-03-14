const {ccclass, property} = cc._decorator

import UIManager from "../UIManager"
import { Util } from "../util/Util"
import UIBase from "./UIBase"

@ccclass
export default class LosePanel extends UIBase {

    @property(cc.Node) backToStartMenuBtn: cc.Node | undefined = undefined
    @property(cc.Node) playAgainBtn: cc.Node | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad()
    }

    init(uiManager: UIManager) {
        /** 回到首页 */
        Util.onTouch(this.backToStartMenuBtn, () => {
            uiManager.onClickBackToStartMenu()
        })
        /** 重新开始 */
        Util.onTouch(this.playAgainBtn, () => {
            uiManager.onClickPlayAgain()
        })
    }

    
}
