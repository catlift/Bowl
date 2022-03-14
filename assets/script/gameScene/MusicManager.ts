import { MusicResUrl } from "./enum/Enum"
import { Util } from "./util/Util"

export class MusicManager {
    private static instance: MusicManager

    private constructor() {}

    static getInstance(): MusicManager {
        /** 如果获取的音频不在， new 一个 */
        if(!this.instance) {
            this.instance = new MusicManager()
        }
        /** 存在，获取那一个 */
        return this.instance
    }

    async playBGM() {
        const audio = await Util.loadMusic(MusicResUrl.bgm)
        audio && cc.audioEngine.playMusic(audio, true)
    }

    async playClickEffect() {
        const audio = await Util.loadMusic(MusicResUrl.click)
        audio && cc.audioEngine.playEffect(audio, false)
    }

    async playLoseEffect() {
        const audio = await Util.loadMusic(MusicResUrl.lose)
        audio && cc.audioEngine.playEffect(audio, false)
    }

    async playWinEffect() {
        const audio = await Util.loadMusic(MusicResUrl.win)
        audio && cc.audioEngine.playEffect(audio, false)
    }
}