"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import "./HomePage.css"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { setUserId } = useUser()

  // Sign Up states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Sign In states
  const [email1, setEmail1] = useState("")
  const [password1, setPassword1] = useState("")
  const [showPassword1, setShowPassword1] = useState(false)

  // Validation refs for showing errors
  const nameFieldRef = useRef<HTMLDivElement>(null)
  const emailFieldRef = useRef<HTMLDivElement>(null)
  const passFieldRef = useRef<HTMLDivElement>(null)
  const emailField1Ref = useRef<HTMLDivElement>(null)
  const passField1Ref = useRef<HTMLDivElement>(null)

  // Validation functions (same as before)
  const checkName = () => {
    const namePattern =  /^[a-zA-Z0-9 _-]{2,30}$/
    if (!namePattern.test(name)) {
      nameFieldRef.current!.style.display = "inline"
    } else {
      nameFieldRef.current!.style.display = "none"
    }
  }

  const checkEmail = () => {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
    if (!emailPattern.test(email)) {
      emailFieldRef.current!.style.display = "inline"
    } else {
      emailFieldRef.current!.style.display = "none"
    }
  }

  const checkPass = () => {
    const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/
    if (!passPattern.test(password)) {
      passFieldRef.current!.style.display = "inline"
    } else {
      passFieldRef.current!.style.display = "none"
    }
  }

  const checkEmail1 = () => {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
    if (!emailPattern.test(email1)) {
      emailField1Ref.current!.style.display = "inline"
    } else {
      emailField1Ref.current!.style.display = "none"
    }
  }

  const checkPass1 = () => {
    const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/
    if (!passPattern.test(password1)) {
      passField1Ref.current!.style.display = "inline"
    } else {
      passField1Ref.current!.style.display = "none"
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1)
  }

  // Handle Sign Up submit with backend call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    checkName()
    checkEmail()
    checkPass()

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
    const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/

    if (emailPattern.test(email) && passPattern.test(password)) {
      try {
        const response = await fetch("http://localhost:8282/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        })

        if (response.ok) {
          alert("User registered successfully!")
          setName("")
          setEmail("")
          setPassword("")
          containerRef.current?.classList.remove("active") // Switch to login form
        } else {
          alert("Failed to register user.")
        }
      } catch (err) {
        alert("Error connecting to server.")
        console.error(err)
      }
    }
  }

  // Handle Sign In submit with backend call
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    checkEmail1()
    checkPass1()

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/

    if (emailPattern.test(email1)) {
      try {
        const res = await fetch(`http://localhost:8282/api/users/email/${email1}`)
        const user = await res.json()

        if (user?.id) {
          // Store user ID in context
          setUserId(user.id.toString())
          // Redirect to dashboard
          router.push("/dashboard")
        } else {
          alert("Invalid credentials.")
        }
      } catch (err) {
        alert("Login failed.")
        console.error(err)
      }
    }
  }

  // Toggle between forms
  const handleRegisterClick = () => {
    containerRef.current?.classList.add("active")
  }

  const handleLoginClick = () => {
    containerRef.current?.classList.remove("active")
  }

  return (
    <div className="container-wrapper">
      <div className="container active" ref={containerRef} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <span>Use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyUp={checkName}
            />
            <div className="namefield" ref={nameFieldRef}>
              Invalid name
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={checkEmail}
            />
            <div className="emailfield" ref={emailFieldRef}>
              Invalid email
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={checkPass}
            />
            <div className="passfield" ref={passFieldRef}>
              Invalid password
            </div>
            <i className={`fa ${showPassword ? "fa-unlock" : "fa-lock"}`} onClick={togglePasswordVisibility}></i>
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <span>Use your email password</span>
            <input
              type="email"
              placeholder="Email"
              value={email1}
              onChange={(e) => setEmail1(e.target.value)}
              onKeyUp={checkEmail1}
            />
            <div className="emailfield1" ref={emailField1Ref}>
              Invalid email
            </div>
            <input
              type={showPassword1 ? "text" : "password"}
              placeholder="Password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <div className="passfield1" ref={passField1Ref}>
              Invalid password
            </div>
            <i className={`fa ${showPassword1 ? "fa-unlock" : "fa-lock"}`} onClick={togglePasswordVisibility1}></i>
            <a href="/ForgetPassword">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of the site's features</p>
              <button id="login" onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of the site's features</p>
              <button id="register" onClick={handleRegisterClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
