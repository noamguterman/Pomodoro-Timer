import React, { useState, useEffect } from 'react'
import './styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faPlay, faPause, faRefresh } from '@fortawesome/free-solid-svg-icons'
import alarmSound from './alarm.mp3'

export default function App() {
    const [breakLength, setBreakLength] = useState(5)
    const [sessionLength, setSessionLength] = useState(25)
    const [isRunning, setIsRunning] = useState(false)
    const [mode, setMode] = useState("session")
    const [time, setTime] = useState(sessionLength * 60)

    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

    useEffect(() => {
        if (isRunning && time > 0) {
            const interval = setInterval(() => {
                setTime(prevTime => prevTime - 1)
            }, 1000)
            return () => clearInterval(interval)

        } else if (time === 0) {
            const alarm = document.getElementById("beep")
            alarm.play()

            if (mode === "session") {
                setMode("break")
                setTime(breakLength * 60)
            } else {
                setMode("session")
                setTime(sessionLength * 60)
            }
        }
    }, [isRunning, time, mode, breakLength, sessionLength])
    
    function decreaseBreakLength() {
        if (breakLength > 1 && !isRunning) {
            setBreakLength(prevBreakLength => prevBreakLength - 1)
            if (mode === "break") {
                setTime((breakLength - 1) * 60)
            }
        }
    }

    function increaseBreakLength() {
        if (breakLength < 60 && !isRunning) {
            setBreakLength(prevBreakLength => prevBreakLength + 1)
            if (mode === "break") {
                setTime((breakLength + 1) * 60)
            }
        }
    }

    function decreaseSessionLength() {
        if (sessionLength > 1 && !isRunning) {
            setSessionLength(prevSessionLength => prevSessionLength - 1)
            if (mode === "session") {
                setTime((sessionLength - 1) * 60)
            }
        }
    }

    function increaseSessionLength() {
        if (sessionLength < 60 && !isRunning) {
            setSessionLength(prevSessionLength => prevSessionLength + 1)
            if (mode === "session") {
                setTime((sessionLength + 1) * 60)
            }
        }
    }

    function amountClassLogic(isRunning, length, type) {
        if (isRunning) {
            return "hide"
        }
        if (type === 'dec' && length <= 1) {
            return "disabled"
        }
        if (type === 'inc' && length >= 60) {
            return "disabled"
        }
        return ""
    }

    function resumePause() {
        setIsRunning(prevIsRunning => !prevIsRunning)
    }

    function restart() {
        setIsRunning(false)
        setTime(sessionLength * 60)
        setMode("session")
    }

    return (
        <main>
            <h2 className="title">Pomodoro Timer</h2>
            <div className="settings">
                <div>
                    <span id="break-label">Break Length</span>
                    <div className="amount">
                        <span 
                            id="break-decrement"
                            className={`amount--dec ${amountClassLogic(isRunning, breakLength, 'dec')}`} 
                            onClick={decreaseBreakLength}>
                            <FontAwesomeIcon icon={faArrowDown} />
                        </span>
                        <span 
                            id="break-length" 
                            className={isRunning ? "emphasize" : ""}>
                            {breakLength}
                        </span>
                        <span 
                            id="break-increment"
                            className={`amount--inc ${amountClassLogic(isRunning, breakLength, 'inc')}`} 
                            onClick={increaseBreakLength}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </span>
                    </div>
                </div>
                <div>
                    <span id="session-label">Session Length</span>
                    <div className="amount">
                        <span 
                            id="session-decrement"
                            className={`amount--dec ${amountClassLogic(isRunning, sessionLength, 'dec')}`} 
                            onClick={decreaseSessionLength}>
                            <FontAwesomeIcon icon={faArrowDown} />
                        </span>
                        <span 
                            id="session-length" 
                            className={isRunning ? "emphasize" : ""}>
                            {sessionLength}
                        </span>
                        <span 
                            id="session-increment"
                            className={`amount--inc ${amountClassLogic(isRunning, sessionLength, 'inc')}`} 
                            onClick={increaseSessionLength}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </span>
                    </div>
                </div>
            </div>
            <div className="display">
                <h3 
                    id="timer-label" 
                    className="display--mode">{mode === "break" ? "Break" : "Session"}
                </h3>
                <h1 
                    id="time-left"
                    className={`display--time ${isRunning ? mode === "break" ? "onBreak" : "inSession" : ""}`}>
                    {formattedTime}
                </h1>
            </div>
            <div className="controls">
                <span 
                    id="start_stop" 
                    className="controls--resumePause" 
                    onClick={resumePause}>
                    {isRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </span>
                <span 
                    id="reset" 
                    className="controls--restart" 
                    onClick={restart}>
                    <FontAwesomeIcon icon={faRefresh} />
                </span>
            </div>

            <audio id="beep" src={alarmSound}></audio>
        </main>
    )
}