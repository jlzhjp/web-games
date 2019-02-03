'use strict'

import Container from './container.js'

export default class Game extends Container {
    constructor(canvas) {
        super()
        this.__canvas = canvas
        this.__context = this.__canvas.getContext('2d')
        this.__tick = 50
        this.__intervalId = null
        this.__frameId = null
        this.__stopped = false
        this.__onstop = []
        this.__objects = []
        this.__background = 'white'
        this.__score = 0
    }

    get mapHeight() {
        return this.__canvas.height
    }

    get mapWidth() {
        return this.__canvas.width
    }

    get onstop() {
        return this.__onstop
    }

    get score() {
        return this.__score
    }

    set score(value) {
        this.__score = value
    }

    start() {
        if (this.__stopped) {
            throw new Error('This game has stopped.')
        }

        this.__intervalId = setInterval(() => {
            for (let obj of super._objects) {
                obj.update({ game: this })
            }
        }, this.__tick)

        const loop = () => {
            this.__context.fillStyle = this.__background
            this.__context.fillRect(0, 0, this.mapWidth, this.mapHeight)

            for (let obj of super._objects) {
                obj.draw(this.__context)
            }
            this.__frameId = requestAnimationFrame(loop)
        }

        this.__frameId = requestAnimationFrame(loop)
    }

    pause() {
        if (this.__intervalId) {
            clearInterval(this.__intervalId)
        }
        if (this.__frameId) {
            cancelAnimationFrame(this.__frameId)
        }
    }

    stop() {
        this.pause()
        this.__stopped = true
        this.__onstop.forEach(listener => listener())
    }
}