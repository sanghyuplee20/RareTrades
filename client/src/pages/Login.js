import LoginForm from "./component/LoginForm"
import SignUp from "./component/SignUp"

function Login() {
    let Component;
    switch (window.location.pathname) {
        case "/join":
            Component = <SignUp />;
          break;
        default:
          Component = <LoginForm />;
    }
    return (
        <div>
            {Component}
        </div>
    )
}

export default Login;