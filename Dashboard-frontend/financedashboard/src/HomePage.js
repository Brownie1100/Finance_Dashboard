import React, { useRef, useState } from 'react';
import './HomePage.css';

function HomePage() {
    const containerRef = useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [email1, setEmail1] = useState('');
    const [password1, setPassword1] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    
    const nameFieldRef = useRef(null);
    const emailFieldRef = useRef(null);
    const passFieldRef = useRef(null);
    const emailField1Ref = useRef(null);
    const passField1Ref = useRef(null);

    const checkName = () => {
        const namePattern = /^[a-z\d]{6,12}$/i;
        if (!RegExp(namePattern).exec(name)) {
            nameFieldRef.current.style.display = 'inline';
        } else {
            nameFieldRef.current.style.display = 'none';
        }
    };

    const checkEmail = () => {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!RegExp(emailPattern).exec(email)) {
            emailFieldRef.current.style.display = 'inline';
        } else {
            emailFieldRef.current.style.display = 'none';
        }
    };

    const checkPass = () => {
        const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
        if (!RegExp(passPattern).exec(password)) {
            passFieldRef.current.style.display = 'inline';
        } else {
            passFieldRef.current.style.display = 'none';
        }
    };

    const checkEmail1 = () => {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!RegExp(emailPattern).exec(email1)) {
            emailField1Ref.current.style.display = 'inline';
        } else {
            emailField1Ref.current.style.display = 'none';
        }
    };

    const checkPass1 = () => {
        const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
        if (!RegExp(passPattern).exec(password1)) {
            passField1Ref.current.style.display = 'inline';
        } else {
            passField1Ref.current.style.display = 'none';
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        checkEmail();
        checkPass();
    };

    const handleRegisterClick = () => {
        containerRef.current.classList.add('active');
    };

    const handleLoginClick = () => {
        containerRef.current.classList.remove('active');
    };

    return (
        <div className="container-wrapper">
            <div className="container" ref={containerRef} id="container">
                <div className="form-container sign-up">
                    <form onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            {/* <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-instagram"></i></a> */}
                        </div>
                        <span>Use your email for registration</span>
                        <input 
                            type="text" 
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="namefield" ref={nameFieldRef}>Invalid name</div>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyUp={checkEmail}
                        />
                        <div className="emailfield" ref={emailFieldRef}>Invalid email</div>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyUp={checkPass}
                        />
                        <div className="passfield" ref={passFieldRef}>Invalid password</div>
                        <i className={`fa ${showPassword ? 'fa-unlock' : 'fa-lock'}`} onClick={togglePasswordVisibility}></i>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            {/* <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-instagram"></i></a> */}
                        </div>
                        <span>Use your email password</span>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email1}
                            onChange={(e) => setEmail1(e.target.value)}
                            onKeyUp={checkEmail1}
                        />
                        <div className="emailfield1" ref={emailField1Ref}>Invalid email</div>
                        <input 
                            type={showPassword1 ? 'text' : 'password'}
                            placeholder="Password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            onKeyUp={checkPass1}
                        />
                        <div className="passfield1" ref={passField1Ref}>Invalid password</div>
                        <i className={`fa ${showPassword1 ? 'fa-unlock' : 'fa-lock'}`} onClick={togglePasswordVisibility1}></i>
                        <a href="/ForgetPassword">Forget Your Password?</a>
                        <button type="submit"><a href="/Dashboard">Sign In</a></button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of the site's features</p>
                            <button className="hidden" id="login" onClick={handleLoginClick}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of the site's features</p>
                            <button className="hidden" id="register" onClick={handleRegisterClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
