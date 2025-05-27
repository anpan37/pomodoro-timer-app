"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Home,
  BarChart3,
  Timer,
  Volume2,
  Instagram,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Mail,
  VolumeX,
  Music,
  Youtube,
  ExternalLink,
} from "lucide-react"

export default function PomodoroApp() {
  const [currentView, setCurrentView] = useState("main")
  const [showIntro, setShowIntro] = useState(true)

  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [currentSession, setCurrentSession] = useState(1)

  // Settings states
  const [focusDuration, setFocusDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [introSoundEnabled, setIntroSoundEnabled] = useState(true)

  // Music states
  const [musicUrl, setMusicUrl] = useState("")
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.3)

  // Statistics states
  const [completedSessions, setCompletedSessions] = useState(15)
  const [totalFocusTime, setTotalFocusTime] = useState(5)
  const [tasksCompleted, setTasksCompleted] = useState(23)
  const [currentStreak, setCurrentStreak] = useState(7)

  // Motivational quotes
  const [currentQuote, setCurrentQuote] = useState("")
  const motivationalQuotes = [
    "You are capable of amazing things",
    "Every small step leads to big achievements",
    "Focus is your superpower",
    "You're doing great, keep going",
    "Productivity is progress, not perfection",
    "Your future self will thank you",
    "Stay focused, stay fabulous",
    "You've got this, champion",
    "Dream big, work focused",
    "Success starts with a single focused moment",
    "You are unstoppable when you focus",
    "Make today amazing with focused work",
    "Your dedication is inspiring",
    "Focus today, celebrate tomorrow",
    "You're building something beautiful",
  ]

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Intro sequence
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false)
      }, 4000) // 4 second intro
      return () => clearTimeout(timer)
    }
  }, [showIntro])

  // Generate new motivational quote
  useEffect(() => {
    const generateQuote = () => {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
      setCurrentQuote(randomQuote)
    }

    generateQuote()
    const quoteInterval = setInterval(generateQuote, 30000)
    return () => clearInterval(quoteInterval)
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      if (soundEnabled) {
        playNotificationSound()
      }

      if (!isBreak) {
        setCompletedSessions((prev) => prev + 1)
        setTotalFocusTime((prev) => prev + focusDuration / 60)
        setIsBreak(true)
        setTimeLeft(breakDuration * 60)
        alert("Great work! Time for a break!")
      } else {
        setIsBreak(false)
        setTimeLeft(focusDuration * 60)
        setCurrentSession((prev) => prev + 1)
        alert("Break's over! Ready for another focus session?")
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, isBreak, focusDuration, breakDuration, soundEnabled])

  const playNotificationSound = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      )
      audio.play().catch(() => {})
    } catch (error) {
      console.log("Audio notification not available")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    setIsRunning(true)
    if (currentView !== "timer") {
      setCurrentView("timer")
    }
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(focusDuration * 60)
    setCurrentSession(1)
  }

  const updateFocusDuration = (minutes: number) => {
    setFocusDuration(minutes)
    if (!isBreak && !isRunning) {
      setTimeLeft(minutes * 60)
    }
  }

  const updateBreakDuration = (minutes: number) => {
    setBreakDuration(minutes)
    if (isBreak && !isRunning) {
      setTimeLeft(minutes * 60)
    }
  }

  const handleMusicPlay = () => {
    if (musicUrl) {
      if (audioRef.current) {
        audioRef.current.pause()
      }

      audioRef.current = new Audio(musicUrl)
      audioRef.current.volume = musicVolume
      audioRef.current.loop = true
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true)
        })
        .catch(() => {
          alert("Could not play this audio. Please check the URL or try a different source.")
        })
    }
  }

  const handleMusicPause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlayingMusic(false)
    }
  }

  const handleVolumeChange = (volume: number) => {
    setMusicVolume(volume)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }

  // Intro Screen
  if (showIntro) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        {/* Flowing River Video Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute w-full h-32 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent top-1/4 transform -skew-y-1"></div>
            <div className="absolute w-full h-24 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent top-1/2 transform skew-y-1"></div>
            <div className="absolute w-full h-40 bg-gradient-to-r from-transparent via-pink-300/30 to-transparent top-3/4 transform -skew-y-1"></div>
          </div>
        </div>

        {/* Intro Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-8 backdrop-blur-sm bg-white/30 rounded-3xl p-12 shadow-2xl">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=face"
                  alt="Cute anime timer"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=50&h=50&fit=crop"
                  alt="Sparkle"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                Go Little Rockstar!
              </h1>
              <p className="text-xl text-gray-700 animate-pulse">Welcome to your productivity journey</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIntroSoundEnabled(!introSoundEnabled)}
                  className="backdrop-blur-sm bg-white/50"
                >
                  {introSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => setShowIntro(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg"
                >
                  Skip Intro
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Intro Sound */}
        {introSoundEnabled && (
          <audio autoPlay loop className="hidden">
            <source
              src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
              type="audio/wav"
            />
          </audio>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Flowing River Effect - Static */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute w-full h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/4"></div>
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent top-1/2"></div>
          <div className="absolute w-full h-3 bg-gradient-to-r from-transparent via-pink-400 to-transparent top-3/4"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex gap-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2 shadow-2xl backdrop-blur-sm">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full text-white hover:text-purple-600 hover:bg-white transition-all ${
                currentView === "main" ? "bg-white text-purple-600" : ""
              }`}
              onClick={() => setCurrentView("main")}
            >
              <Home className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full text-white hover:text-purple-600 hover:bg-white transition-all ${
                currentView === "timer" ? "bg-white text-purple-600" : ""
              }`}
              onClick={() => setCurrentView("timer")}
            >
              <Timer className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full text-white hover:text-purple-600 hover:bg-white transition-all ${
                currentView === "stats" ? "bg-white text-purple-600" : ""
              }`}
              onClick={() => setCurrentView("stats")}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full text-white hover:text-purple-600 hover:bg-white transition-all ${
                currentView === "music" ? "bg-white text-purple-600" : ""
              }`}
              onClick={() => setCurrentView("music")}
            >
              <Music className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6 space-y-12 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between backdrop-blur-sm bg-white/30 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pomodoro Timer
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <button
                onClick={() => setCurrentView("main")}
                className={`hover:text-purple-600 transition-colors ${currentView === "main" ? "text-purple-600 font-semibold" : ""}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView("timer")}
                className={`hover:text-purple-600 transition-colors ${currentView === "timer" ? "text-purple-600 font-semibold" : ""}`}
              >
                Timer
              </button>
              <button
                onClick={() => setCurrentView("stats")}
                className={`hover:text-purple-600 transition-colors ${currentView === "stats" ? "text-purple-600 font-semibold" : ""}`}
              >
                Statistics
              </button>
              <button
                onClick={() => setCurrentView("music")}
                className={`hover:text-purple-600 transition-colors ${currentView === "music" ? "text-purple-600 font-semibold" : ""}`}
              >
                Music
              </button>
            </div>
          </div>

          {/* Cute Anime Motivational Section */}
          <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-8 shadow-lg border border-white/50">
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=face"
                  alt="Cute anime girl reading"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop"
                  alt="Cute anime boy with coffee"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop&crop=face"
                  alt="Cute anime cat sleeping"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=face"
                  alt="Cute anime girl with target"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Stay Focused, Stay Cute!</h2>
              <p className="text-gray-600">Let's make productivity fun and adorable together!</p>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800">{currentQuote}</p>
                <p className="text-xs text-gray-500 mt-2">New inspiration every 30 seconds</p>
              </div>
            </div>
          </div>

          {currentView === "main" && (
            <>
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop&crop=face"
                        alt="Cute anime tomato"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=50&h=50&fit=crop"
                        alt="Cute sparkle"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Maximize Your Focus
                </h1>
                <p className="text-gray-600 text-lg">Enhance your productivity with the Pomodoro Technique</p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 backdrop-blur-sm"
                    onClick={() => setCurrentView("timer")}
                  >
                    View Tutorial
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    onClick={startTimer}
                  >
                    Start Timer
                  </Button>
                </div>
              </div>

              {/* Cute Anime Characters */}
              <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-8 shadow-lg border border-white/50">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Productivity Companions</h2>
                  <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                    <div className="text-center space-y-2">
                      <img
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop&crop=face"
                        alt="Cute anime girl studying"
                        className="w-20 h-20 rounded-full mx-auto shadow-lg object-cover"
                      />
                      <p className="text-sm text-gray-600">Study Buddy</p>
                    </div>
                    <div className="text-center space-y-2">
                      <img
                        src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=120&h=120&fit=crop&crop=face"
                        alt="Cute anime cat with timer"
                        className="w-20 h-20 rounded-full mx-auto shadow-lg object-cover"
                      />
                      <p className="text-sm text-gray-600">Timer Cat</p>
                    </div>
                    <div className="text-center space-y-2">
                      <img
                        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=120&h=120&fit=crop"
                        alt="Cute anime mascot cheering"
                        className="w-20 h-20 rounded-full mx-auto shadow-lg object-cover"
                      />
                      <p className="text-sm text-gray-600">Cheer Leader</p>
                    </div>
                  </div>
                  <p className="text-gray-600">Let's make productivity fun and adorable together!</p>
                </div>
              </div>

              {/* Current Status */}
              {(isRunning || timeLeft !== focusDuration * 60) && (
                <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 shadow-lg border border-white/50 text-center">
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      {isBreak ? (
                        <img
                          src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=60&h=60&fit=crop&crop=face"
                          alt="Cute anime flower"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=60&h=60&fit=crop"
                          alt="Cute anime fire"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{isBreak ? "Break Time!" : "Focus Time!"}</h3>
                    <div className="text-3xl font-mono font-bold text-purple-600">{formatTime(timeLeft)}</div>
                    <p className="text-sm text-gray-600">
                      Session {currentSession} • {isRunning ? "Running" : "Paused"}
                    </p>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Features of Pomodoro App
                </h2>
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card
                    className="p-6 border-purple-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm cursor-pointer transform hover:scale-105"
                    onClick={() => setCurrentView("timer")}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=50&h=50&fit=crop"
                          alt="Cute anime clock"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <CardTitle className="text-lg text-purple-600">Timer</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Stay focused with timed sessions</p>
                    </CardContent>
                  </Card>
                  <Card
                    className="p-6 border-pink-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm cursor-pointer transform hover:scale-105"
                    onClick={() => setCurrentView("stats")}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop&crop=face"
                          alt="Cute anime chart"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <CardTitle className="text-lg text-pink-600">Statistics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Track your productivity</p>
                    </CardContent>
                  </Card>
                  <Card
                    className="p-6 border-purple-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm cursor-pointer transform hover:scale-105"
                    onClick={() => setCurrentView("music")}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=50&h=50&fit=crop&crop=face"
                          alt="Cute anime music"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <CardTitle className="text-lg text-purple-600">Music</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Play music while focusing</p>
                    </CardContent>
                  </Card>
                  <Card className="p-6 border-pink-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm transform hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=50&h=50&fit=crop"
                          alt="Cute anime rainbow"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <CardTitle className="text-lg text-pink-600">Themes</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Beautiful, cute designs</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {currentView === "timer" && (
            <>
              {/* Timer Section */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-12 text-center space-y-6 shadow-2xl backdrop-blur-sm">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-spin-slow">
                    {isBreak ? (
                      <img
                        src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=80&h=80&fit=crop&crop=face"
                        alt="Cute anime timer character"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop&crop=face"
                        alt="Cute anime timer character"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <h1 className="text-4xl font-bold">{isBreak ? "Break Time" : "Focus. Work. Achieve."}</h1>
                <p className="text-purple-100 text-lg">
                  {isBreak
                    ? "Take a well-deserved break and recharge"
                    : "Stay productive with the Pomodoro Technique Timer"}
                </p>
                <div className="text-7xl font-mono font-bold">{formatTime(timeLeft)}</div>
                <div className="text-lg">
                  Session {currentSession} • {isBreak ? "Break" : "Focus"} • {isRunning ? "Running" : "Paused"}
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="text-purple-600 border-white bg-white hover:bg-purple-50 transform hover:scale-105 transition-all"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    className="bg-white text-purple-600 hover:bg-purple-50 font-semibold transform hover:scale-105 transition-all shadow-lg"
                    onClick={isRunning ? pauseTimer : startTimer}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentView === "music" && (
            <>
              {/* Music Player */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=50&h=50&fit=crop&crop=face"
                      alt="Cute anime music"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Focus Music
                  </h2>
                  <p className="text-gray-600">Play your favorite music while focusing</p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <Card className="p-6 backdrop-blur-sm bg-white/60 border border-white/50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Music URL (YouTube, Spotify, etc.)
                        </label>
                        <Input
                          type="url"
                          placeholder="Paste your music URL here..."
                          value={musicUrl}
                          onChange={(e) => setMusicUrl(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleMusicPlay}
                          disabled={!musicUrl || isPlayingMusic}
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                        <Button
                          onClick={handleMusicPause}
                          disabled={!isPlayingMusic}
                          variant="outline"
                          className="flex-1"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Volume: {Math.round(musicVolume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={musicVolume}
                          onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 backdrop-blur-sm bg-white/60 border border-white/50">
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold text-gray-800">Quick Links</h3>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open("https://youtube.com", "_blank")}
                          className="flex items-center gap-1"
                        >
                          <Youtube className="w-4 h-4" />
                          YouTube
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open("https://spotify.com", "_blank")}
                          className="flex items-center gap-1"
                        >
                          <Music className="w-4 h-4" />
                          Spotify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open("https://soundcloud.com", "_blank")}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          SoundCloud
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {currentView === "stats" && (
            <>
              {/* Statistics */}
              <div className="text-center space-y-6">
                <div className="flex justify-center text-5xl mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop&crop=face"
                    alt="Cute anime progress"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Amazing Progress
                </h2>
                <p className="text-gray-600">Look how far you've come</p>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card className="p-8 text-center border-purple-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm transform hover:scale-105">
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=50&h=50&fit=crop"
                        alt="Cute anime trophy"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Sessions Completed</p>
                    <p className="text-4xl font-bold text-purple-600">{completedSessions}</p>
                  </div>
                </Card>
                <Card className="p-8 text-center border-pink-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm transform hover:scale-105">
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=50&h=50&fit=crop"
                        alt="Cute anime stopwatch"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Total Focus Time</p>
                    <p className="text-4xl font-bold text-pink-600">{totalFocusTime.toFixed(1)} hrs</p>
                  </div>
                </Card>
                <Card className="p-8 text-center border-green-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm transform hover:scale-105">
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop"
                        alt="Cute anime notes"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                    <p className="text-4xl font-bold text-green-600">{tasksCompleted}</p>
                  </div>
                </Card>
                <Card className="p-8 text-center border-yellow-100 hover:shadow-2xl transition-all bg-white/60 backdrop-blur-sm transform hover:scale-105">
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=50&h=50&fit=crop"
                        alt="Cute anime fire"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-4xl font-bold text-yellow-600">{currentStreak} days</p>
                  </div>
                </Card>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=50&h=50&fit=crop&crop=face"
                      alt="Cute anime settings"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Settings
                  </h2>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  <Card className="border-purple-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Focus Duration</p>
                          <p className="text-sm text-gray-500">Perfect focus time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateFocusDuration(Math.max(5, focusDuration - 5))}
                          disabled={isRunning}
                          className="hover:scale-110 transition-transform"
                        >
                          -
                        </Button>
                        <span className="font-semibold text-purple-600 min-w-[80px] text-center">
                          {focusDuration} min
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateFocusDuration(Math.min(60, focusDuration + 5))}
                          disabled={isRunning}
                          className="hover:scale-110 transition-transform"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </Card>
                  <Card className="border-pink-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium">Break Duration</p>
                          <p className="text-sm text-gray-500">Rest and recharge</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBreakDuration(Math.max(1, breakDuration - 1))}
                          disabled={isRunning}
                          className="hover:scale-110 transition-transform"
                        >
                          -
                        </Button>
                        <span className="font-semibold text-pink-600 min-w-[80px] text-center">
                          {breakDuration} min
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBreakDuration(Math.min(30, breakDuration + 1))}
                          disabled={isRunning}
                          className="hover:scale-110 transition-transform"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </Card>
                  <Card className="border-blue-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Volume2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Sound Notifications</p>
                          <p className="text-sm text-gray-500">Gentle chimes</p>
                        </div>
                      </div>
                      <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center space-y-6 pt-8 border-t border-purple-100 backdrop-blur-sm bg-white/30 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex justify-center text-3xl">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop&crop=face"
                  alt="Cute anime heart"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600">Made with love for productivity enthusiasts</p>
              <p className="text-xs text-gray-500">© 2025 Anjan Pandey</p>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Connect with me:</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://instagram.com/anjan.pandey57"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="font-medium">@anjan.pandey57</span>
                </a>
                <a
                  href="mailto:anpan37@yahoo.com"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">anpan37@yahoo.com</span>
                </a>
              </div>
              <p className="text-xs text-gray-500">Contact me for support or feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
