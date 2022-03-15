import UIManager from "../UIManager";
import { Util } from "../util/Util";
import UIBase from "./UIBase";

const {ccclass, property} = cc._decorator

@ccclass
export default class ControlPanel extends UIBase {

    @property(cc.Node) controlBgNode: cc.Node | undefined = undefined
    @property(cc.Node) controlMidNode: cc.Node | undefined = undefined
    @property(cc.Node) clickLeftBtn: cc.Node | undefined = undefined
    @property(cc.Node) clickRightBtn: cc.Node | undefined = undefined
    @property(cc.Node) clickDownBtn: cc.Node | undefined = undefined

    /** uiManager.ts */
    uiManager: UIManager | undefined = undefined

    /** 左移 */
    leftOpen: boolean = false
    /** 右移 */
    rightOpen: boolean = false

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
    }

    init(uiManager: UIManager) {
        this.uiManager = uiManager

        /** 事件监听 */
        const { TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL } = cc.Node.EventType

        /** 轮盘事件 */
        this.controlBgNode.on(TOUCH_START, (event: cc.Event.EventTouch) => {
            /** 转化坐标，将在 controlBgNode 的触摸事件坐标，转化到 controlBgBtn 身上 */
            let pos = this.controlBgNode.convertToNodeSpaceAR(event.getLocation())
            /** 设置 controlMidNode 的位置 */
            this.controlMidNode.setPosition(this.limitControlMidNode(pos))
            /** 
             * 弧度转角度
             * Math.atan2() 计算一个点和原点的连线与x轴正半轴的夹角大小，返回的是一个 弧度
             * cc.misc.radiansToDegress()  cc方法，将弧度转换为角度
             */
            const angle = cc.misc.radiansToDegrees(Math.atan2(pos.x, pos.y))
            /** 传出角度 --》 食物旋转 */
            uiManager.onRotateFood(angle)
        }, this)
        this.controlBgNode.on(TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let pos = this.controlBgNode.convertToNodeSpaceAR(event.getLocation())
            this.controlMidNode.setPosition(this.limitControlMidNode(pos))
            const angle = cc.misc.radiansToDegrees(Math.atan2(pos.x, pos.y))
            /** 传出角度 --》 食物旋转 */
            uiManager.onRotateFood(angle)
        }, this)
        /** 回归原点 */
        this.controlBgNode.on(TOUCH_END, () => {
            this.controlMidNode.setPosition(0, 0)
        }, this)
        this.controlBgNode.on(TOUCH_CANCEL, () => {
            this.controlMidNode.setPosition(0, 0)
        })

        /** 左移按钮 */
        Util.onTouch(this.clickLeftBtn)
        this.clickLeftBtn.on(TOUCH_START, () => {
            this.leftOpen = true
        }, this)
        this.clickLeftBtn.on(TOUCH_END, () => {
            this.leftOpen = false
        }, this)
        this.clickLeftBtn.on(TOUCH_CANCEL, () => {
            this.leftOpen = false
        }, this)

        /** 右移按钮 */
        Util.onTouch(this.clickRightBtn)
        this.clickRightBtn.on(TOUCH_START, () => {
            this.rightOpen = true
        }, this)
        this.clickRightBtn.on(TOUCH_END, () => {
            this.rightOpen = false
        }, this)
        this.clickRightBtn.on(TOUCH_CANCEL, () => {
            this.rightOpen = false
        }, this)

        /** 落下按钮 */
        Util.onTouch(this.clickDownBtn)
        this.clickDownBtn.on(TOUCH_END,() => {
            uiManager.onClickDownFood()
        }, this)
    }

    /** 选择 controlMidNode 的移动范围 */
    limitControlMidNode(pos: cc.Vec2): cc.Vec2 {
        /** 限制的半径范围 */
        const radius = this.controlBgNode.width / 2
        /** mag()，Vec2 的一个方法，返回向量的长度 */
        const len = pos.mag()
        /** 计算 redius 和 len 的关系 */
        const ratio = len > radius ? radius/len : 1
        return cc.v2(pos.x * ratio, pos.y * ratio)
    }

    update(dt: number): void {
        this.leftOpen && this.uiManager && this.uiManager.onClickLeftFood(dt)
        this.rightOpen && this.uiManager && this.uiManager.onClickRightFood(dt)
    }
}
