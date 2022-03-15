import { MusicResUrl} from "../enum/Enum"
import { MusicManager } from "../MusicManager"
import UIManager from "../UIManager"

/** 工具类 */
export class Util {
    /** 按下时的 tween 动画 */
    static clickDownTween(node: cc.Node | undefined) {
        if(!node) return
        /** 播放音效 */
        MusicManager.getInstance().playClickEffect()
        /** tween */
        cc.tween(node).to(0.1, {scale: 0.9}).start()
    }

    /** 松开时的 tween 动画 */
    static clickUpTween(node: cc.Node | undefined, callback ?: () => void) {
        if(!node) return
        cc.tween(node).to(0.1, {scale: 1}).call(() => {
            callback && callback()
        }).start()
    }

    /** 触摸事件 */
    static onTouch(node: cc.Node | undefined, callback ?: () => void) {
        if(!node) return
        const { TOUCH_START, TOUCH_END, TOUCH_CANCEL } = cc.Node.EventType
        /** 触摸开始 */
        node.on(TOUCH_START, () => {
            Util.clickDownTween(node)
        })
        /** 触摸结束 */
        node.on(TOUCH_END, () => {
            Util.clickUpTween(node, callback)
        })
        /** 触摸取消 */
        node.on(TOUCH_CANCEL, () => {
            Util.clickUpTween(node)
        })
    }

    static loadMusic(url: MusicResUrl): Promise<cc.AudioClip | undefined> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(url, cc.AudioClip, (err, audioClip) => {
                if(err) resolve(undefined)
                resolve(audioClip)
            })
        })
        
    }
}