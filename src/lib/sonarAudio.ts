import type { SignalState } from './voyageMath'

class SonarSynthClass {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private humOsc: OscillatorNode | null = null
  private noiseGain: GainNode | null = null
  private alarmGain: GainNode | null = null
  private pingTimeoutId: number | null = null
  private isMuted: boolean = true
  private signalState: SignalState = 'MONITORING'
  public isInitialized: boolean = false

  constructor() {
    // AudioContext will initialize on the first user toggle
  }

  public init() {
    if (this.ctx) return
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = this.isMuted ? 0 : 0.45
    master.connect(ctx.destination)
    this.masterGain = master

    // 1. Deep Ocean / Engine Hum
    try {
      const humOsc = ctx.createOscillator()
      humOsc.type = 'triangle'
      humOsc.frequency.value = 46 // Deep sub bass hum
      const humFilter = ctx.createBiquadFilter()
      humFilter.type = 'lowpass'
      humFilter.frequency.value = 75
      humFilter.Q.value = 1

      const humGain = ctx.createGain()
      humGain.gain.value = 0.35

      humOsc.connect(humGain)
      humGain.connect(humFilter)
      humFilter.connect(master)
      humOsc.start()
      this.humOsc = humOsc
    } catch (e) {
      console.error('Failed to create ocean hum:', e)
    }

    // 2. White Noise Generator (Simulating RF Noise / Jamming static)
    try {
      const bufferSize = 2 * ctx.sampleRate
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer
      noiseSource.loop = true

      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.value = 1100
      noiseFilter.Q.value = 0.45

      const noiseGain = ctx.createGain()
      noiseGain.gain.value = this.signalState === 'CORRUPTED' ? 0.08 : 0.01

      noiseSource.connect(noiseGain)
      noiseGain.connect(noiseFilter)
      noiseFilter.connect(master)
      noiseSource.start()
      this.noiseGain = noiseGain
    } catch (e) {
      console.error('Failed to create white noise:', e)
    }

    // 3. Modulated Warning Siren (Fades in during CORRUPTED)
    try {
      const alarmOsc = ctx.createOscillator()
      alarmOsc.type = 'sine'
      alarmOsc.frequency.value = 210

      const alarmGain = ctx.createGain()
      alarmGain.gain.value = this.signalState === 'CORRUPTED' ? 0.18 : 0

      const alarmLFO = ctx.createOscillator()
      alarmLFO.frequency.value = 1.6 // LFO Hz
      const alarmLFOGain = ctx.createGain()
      alarmLFOGain.gain.value = 35 // Modulate frequency by +/- 35Hz

      alarmLFO.connect(alarmLFOGain)
      alarmLFOGain.connect(alarmOsc.frequency)
      alarmOsc.connect(alarmGain)
      alarmGain.connect(master)

      alarmOsc.start()
      alarmLFO.start()
      this.alarmGain = alarmGain
    } catch (e) {
      console.error('Failed to create siren:', e)
    }

    this.isInitialized = true
    this.startPingScheduler()
  }

  private startPingScheduler() {
    if (this.pingTimeoutId) {
      clearTimeout(this.pingTimeoutId)
    }

    const scheduleNext = () => {
      let interval = 5500
      if (this.signalState === 'CORRUPTED') {
        interval = 2200
      } else if (this.signalState === 'AUTHENTICATED') {
        interval = 6000
      }

      this.pingTimeoutId = window.setTimeout(() => {
        this.triggerPing()
        scheduleNext()
      }, interval)
    }

    scheduleNext()
  }

  private triggerPing() {
    if (!this.ctx || !this.masterGain || this.isMuted) return
    const ctx = this.ctx
    const time = ctx.currentTime

    // Create delays and echo nodes
    const delay = ctx.createDelay()
    delay.delayTime.value = 0.35
    const feedback = ctx.createGain()
    feedback.gain.value = 0.4

    const pingGain = ctx.createGain()
    pingGain.gain.setValueAtTime(0, time)
    pingGain.gain.linearRampToValueAtTime(0.35, time + 0.04)

    const decayTime =
      this.signalState === 'CORRUPTED' ? 1.2 : this.signalState === 'AUTHENTICATED' ? 3.0 : 2.2
    pingGain.gain.exponentialRampToValueAtTime(0.001, time + decayTime)

    const osc = ctx.createOscillator()
    let osc2: OscillatorNode | null = null

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 16

    if (this.signalState === 'CORRUPTED') {
      // glitched siren alarm ping
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(360, time)
      osc.frequency.exponentialRampToValueAtTime(90, time + 0.7)

      filter.frequency.setValueAtTime(360, time)
      filter.frequency.exponentialRampToValueAtTime(90, time + 0.7)
      osc.connect(pingGain)
    } else if (this.signalState === 'AUTHENTICATED') {
      // dual frequency chime
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, time)
      osc.frequency.exponentialRampToValueAtTime(340, time + 2.0)

      osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1100, time)
      osc2.frequency.exponentialRampToValueAtTime(440, time + 1.8)

      filter.frequency.setValueAtTime(990, time)
      filter.frequency.exponentialRampToValueAtTime(390, time + 2.0)

      osc.connect(pingGain)
      osc2.connect(pingGain)
      osc2.start(time)
      osc2.stop(time + 2.2)
    } else {
      // normal blue scan ping
      osc.type = 'sine'
      osc.frequency.setValueAtTime(650, time)
      osc.frequency.exponentialRampToValueAtTime(200, time + 1.8)

      filter.frequency.setValueAtTime(650, time)
      filter.frequency.exponentialRampToValueAtTime(200, time + 1.8)
      osc.connect(pingGain)
    }

    pingGain.connect(filter)
    filter.connect(this.masterGain)

    // Echo feedback network
    filter.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    feedback.connect(this.masterGain)

    osc.start(time)
    osc.stop(time + 3.2)
  }

  public updateState(state: SignalState) {
    this.signalState = state
    if (!this.ctx) return

    const time = this.ctx.currentTime

    if (state === 'CORRUPTED') {
      this.noiseGain?.gain.setTargetAtTime(0.09, time, 0.3)
      this.alarmGain?.gain.setTargetAtTime(0.18, time, 0.4)
      if (this.humOsc) this.humOsc.frequency.setTargetAtTime(34, time, 0.6)
    } else if (state === 'AUTHENTICATED') {
      this.noiseGain?.gain.setTargetAtTime(0.002, time, 0.2)
      this.alarmGain?.gain.setTargetAtTime(0, time, 0.1)
      if (this.humOsc) this.humOsc.frequency.setTargetAtTime(54, time, 0.4)
    } else {
      this.noiseGain?.gain.setTargetAtTime(0.015, time, 0.5)
      this.alarmGain?.gain.setTargetAtTime(0, time, 0.2)
      if (this.humOsc) this.humOsc.frequency.setTargetAtTime(46, time, 0.5)
    }

    this.startPingScheduler()
  }

  public setMute(mute: boolean) {
    this.isMuted = mute
    if (!this.ctx) {
      if (!mute) this.init()
      return
    }

    const time = this.ctx.currentTime
    if (mute) {
      this.masterGain?.gain.setTargetAtTime(0, time, 0.05)
    } else {
      this.ctx.resume().then(() => {
        this.masterGain?.gain.setTargetAtTime(0.45, this.ctx!.currentTime, 0.1)
      })
    }
  }

  public playClickSound(type: 'attack' | 'defend' | 'reset') {
    if (!this.ctx || !this.masterGain || this.isMuted) return
    const ctx = this.ctx
    const time = ctx.currentTime

    if (type === 'attack') {
      // Glitched warning slide buzz
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(320, time)
      osc1.frequency.exponentialRampToValueAtTime(140, time + 0.22)

      osc2.type = 'square'
      osc2.frequency.setValueAtTime(180, time)
      osc2.frequency.exponentialRampToValueAtTime(90, time + 0.22)

      gainNode.gain.setValueAtTime(0, time)
      gainNode.gain.linearRampToValueAtTime(0.3, time + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.22)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(260, time)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(filter)
      filter.connect(this.masterGain)

      osc1.start(time)
      osc1.stop(time + 0.25)
      osc2.start(time)
      osc2.stop(time + 0.25)
    } else if (type === 'defend') {
      // Clean rising digital chime with echo
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const delay = ctx.createDelay()
      const delayGain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(330, time)
      osc.frequency.exponentialRampToValueAtTime(990, time + 0.28)

      gainNode.gain.setValueAtTime(0, time)
      gainNode.gain.linearRampToValueAtTime(0.28, time + 0.03)
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.35)

      delay.delayTime.value = 0.12
      delayGain.gain.value = 0.35

      osc.connect(gainNode)
      gainNode.connect(this.masterGain)

      // Echo routing
      gainNode.connect(delay)
      delay.connect(delayGain)
      delayGain.connect(delay)
      delayGain.connect(this.masterGain)

      osc.start(time)
      osc.stop(time + 0.4)
    } else {
      // Dual frequency reset ping
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode1 = ctx.createGain()
      const gainNode2 = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(880, time)
      gainNode1.gain.setValueAtTime(0, time)
      gainNode1.gain.linearRampToValueAtTime(0.25, time + 0.01)
      gainNode1.gain.exponentialRampToValueAtTime(0.001, time + 0.06)

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1100, time)
      gainNode2.gain.setValueAtTime(0, time)
      gainNode2.gain.setValueAtTime(0, time + 0.07)
      gainNode2.gain.linearRampToValueAtTime(0.25, time + 0.08)
      gainNode2.gain.exponentialRampToValueAtTime(0.001, time + 0.14)

      osc1.connect(gainNode1)
      gainNode1.connect(this.masterGain)

      osc2.connect(gainNode2)
      gainNode2.connect(this.masterGain)

      osc1.start(time)
      osc1.stop(time + 0.08)
      osc2.start(time + 0.07)
      osc2.stop(time + 0.15)
    }
  }

  public getMuted() {
    return this.isMuted
  }
}

export const sonarSynth = new SonarSynthClass()
export default sonarSynth

