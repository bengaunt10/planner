import Form from "../components/Form";
import "../Styling/Form.css";

function Login() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  return (
    // <div className="registerContainer">
    <>
      <h1 className="title">CALM DAY</h1>
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <Form route={`${baseUrl}/token/`} result="login" />
    </>
    // </div>
  );
}

export default Login;
