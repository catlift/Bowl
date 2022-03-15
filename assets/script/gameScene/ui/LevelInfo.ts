const {ccclass, property} = cc._decorator

import UIBase from "./UIBase"

@ccclass
export default class LevelInfo extends UIBase {
    /** 当前关卡的label */
    @property(cc.Label) nowLevelLabel: cc.Label | undefined = undefined
    /** 当前食物的Label */
    @property(cc.Label) nowItemsLabel: cc.Label | undefined = undefined

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad()
    }

    setLevelLabel(level: number) {
        const levelToStr = ["零", "一", "二", "三", "四", "五", "六"]
        this.nowLevelLabel.string = `第${levelToStr[level]}关`
    }
    
    setItemsLabel(nowFoodCount: number, allFoodCount: number) {
        this.nowItemsLabel.string = `${nowFoodCount}/${allFoodCount}`
    }
}
