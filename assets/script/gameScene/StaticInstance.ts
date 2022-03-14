import GameManager from "./GameManager"
import UIManager from "./UIManager"

export default class StaticInstance {
    /** gameManager 和 uiManager 脚本 的静态单例 */
    static gameManager: GameManager | undefined = undefined
    static uiManager: UIManager | undefined = undefined

    /** 需要将脚本挂载在场景树，并且 在 onLoad() 中调用：StaticInstance.setXXXX(this) */
    static setGameManager(value: GameManager) {
        this.gameManager = value
    }

    static setUIManager(value: UIManager) {
        this.uiManager = value
    }
}