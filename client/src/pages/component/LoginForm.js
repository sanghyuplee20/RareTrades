import "./LoginForm.css"

function LoginForm() {
    return(
        <div className="loginform">
            <form action="">
                <h1 className="logo">RareTrades</h1>
                <div className="login--input-box">
                    <input type="text" placeholder="Username" required/>
                </div>
                <div className="login--input-box">
                    <input type="text" placeholder="Password" required/>
                </div>

                <button type="submit">Submit</button>
                <div className="login--remember-forgot">
                    <label><input type="checkbox"/> Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>


                <div className="login--register">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;