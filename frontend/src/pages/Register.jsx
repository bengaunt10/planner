import Form from "../components/Form";
import "../Styling/Form.css";

function Register() {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  return (
    <>
    <h1 className="title">CALM DAY</h1>
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <Form route={`${baseUrl}/user/create/`} result="register" />
    </>
  );
}

export default Register;
