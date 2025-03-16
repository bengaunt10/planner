import Form from "../components/Form"
import "../Styling/Form.css"
function Register() {
     const baseUrl = import.meta.env.VITE_BASE_URL;

    return (
        // <div className="registerContainer">
            <Form route={`${baseUrl}/user/create/`} result="register" />
        // </div>
    );
}

export default Register;
