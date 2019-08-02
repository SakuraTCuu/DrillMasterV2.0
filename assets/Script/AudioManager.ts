
export default class AudioManager {

    bgmVolume: number = 0.5;
    sfxVolume: number = 1;
    bgmAudioID: number = 0;

    constructor() {
        const bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm != null) {
            this.bgmVolume = parseFloat(bgm);
        }
        const sfx = cc.sys.localStorage.getItem("sfxVolume");
        if (sfx != null) {
            this.sfxVolume = parseFloat(sfx);
        }
    }

    playBGM(bgm: cc.AudioClip, volume: number = 0) {
        if (volume !== 0) { this.bgmVolume = volume; }
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(bgm, true, this.bgmVolume);
    }

    stopBGM() {
        cc.audioEngine.pause(this.bgmAudioID);
    }

    playSFX(sfx: cc.AudioClip): number {
        if (this.sfxVolume > 0) {
            return cc.audioEngine.play(sfx, false, this.sfxVolume);
        }
    }

    setSFXVolume(v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    }

    setBGMVolume(v) {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
        }
        if (this.bgmVolume != v) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    }
}
