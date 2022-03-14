const {ccclass, property} = cc._decorator

@ccclass
export default class UIBase extends cc.Component {

    @property({
        tooltip: "初始显示或隐藏设置"
    })
    isShowInit: boolean = false

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isShowInit ? this.show() : this.hidden()
    }

    show() {
        this.node.active = true
    }

    hidden() {
        this.node.active = false
    }

    
}
