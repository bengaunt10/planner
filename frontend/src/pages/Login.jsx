import Form from "../components/Form"

function Login() {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    return (
        // <div className="registerContainer">
            <Form route={`${baseUrl}/token/`} result="login" />
        // </div>
    );
}

export default Login;
