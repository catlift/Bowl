export class DataStroge {
    /** 总共多少关 */
    static getMaxLevel(): number {
        let value = cc.sys.localStorage.getItem("maxLevel")
        if(!value) {
            // 默认 6 关
            DataStroge.setMaxLevel(6)
            return 6
        }
        /**  */
        return JSON.parse(value)
    }
    /** 存储最大关 */
    static setMaxLevel(level: number) {
        cc.sys.localStorage.setItem("maxLevel", JSON.stringify(level))
    }

    /** 当前已解锁关卡 */
    static getUnLockLevel(): number {
        let value = cc.sys.localStorage.getItem("unLockLevel")
        if(!value) {
            // 默认解锁第一关
            DataStroge.setUnLockLevel(1)
            return 1
        }
        /**  */
        return JSON.parse(value)
    }
    static setUnLockLevel(level: number) {
        cc.sys.localStorage.setItem("unLockLevel", JSON.stringify(level))
    }
}