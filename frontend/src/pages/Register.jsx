import Form from "../components/Form";
import "../Styling/Form.css";

function Register() {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  return (
    // <div className="registerContainer">
    <>
    <h1 className="title">CALENDAR THINGY</h1>
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <Form route={`${baseUrl}/user/create/`} result="register" />
    </>
    // </div>
  );
}

export default Register;
