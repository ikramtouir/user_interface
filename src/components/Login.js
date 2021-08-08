import { React, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [playOnce, setPlayOnce] = useState(true);
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState({});
  const [errorPasswordText, setPasswordErrorText] = useState({});
  const [errorCredentialsText, setErrorCredentialsText] = useState("");


  const history = useHistory();

  const isValidForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!identifier) {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
      setErrorText({ errorText: errors["email"] });
    }

    if (typeof identifier !== "undefined") {
      let atPosition = identifier.lastIndexOf("@");
      let dotPosition = identifier.lastIndexOf(".");

      if (
        !(
          atPosition < dotPosition &&
          atPosition > 0 &&
          identifier.indexOf("@@") == -1 &&
          dotPosition > 2 &&
          identifier.length - dotPosition > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }

    setErrorText({ errorText: errors["email"] });

    if (!password || password < 0) {
      formIsValid = false;
      setPasswordErrorText({ errorPasswordText: "Password cannot be empty" });
    } else {
      setPasswordErrorText({ errorPasswordText: "" });
    }

    return formIsValid;
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    let formvalidated = isValidForm();
    if (formvalidated) {
      if (playOnce) {
        axios({
          url: "https://cms.trial-task.k8s.ext.fcse.io/graphql",
          method: "post",
          data: {
            query: `mutation{
              login(input:{identifier: "${identifier}", password: "${password}"}){
                jwt
              }
             }`,
          },
        })
          .then((res) => {
           // console.log(res.data);
            setPlayOnce(false);
            if (res.data.data.login.jwt) {
              history.push("/me");
              history.push({ state: res.data.data.login.jwt });
              window.location.reload(false);
            } else {
              history.push("/");
            }
          })
          .catch((err) => {
            setErrorCredentialsText("Your credentials are incorrect");
            window.location.reload(false);
            console.log(err.message);
          });
      }
    }
  };

  return (
    <div className="login">
      <h1>Login to your portal </h1>
        <h5 >{errorCredentialsText}</h5>
      <form onSubmit={(e) => handleOnSubmit(e)}>
        <input
          type="text"
          placeholder="Please type your Email"
          onChange={(e) => {
            setIdentifier(e.target.value);
          }}
        />
        <span
          style={{
            color: "red",
            position: "absolute",
            top: "36%",
            left: "35%",
          }}
        >
          {errorText.errorText}
        </span>

        <input
          type="password"
          placeholder="Please type your password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <span
          style={{
            color: "red",
            position: "absolute",
            top: "46%",
            left: "35%",
          }}
        >
          {errorPasswordText.errorPasswordText}
        </span>

        <div>
          <input size="lg" type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
