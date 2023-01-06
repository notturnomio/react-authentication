import { useContext, useState } from "react";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    const newEnteredPassword = newPasswordInputRef.current.value;
    const authUrl =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD0Ckv7WvgDvmCTQ4nagehNRjPJ3aGP470";
    //validation
    setIsLoading(true);
    fetch(authUrl, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: newEnteredPassword,
        returnSecureToken: false,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Password updating failed!";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          ref={newPasswordInputRef}
          minLength="6"
        />
      </div>
      <div className={classes.action}>
        {!isLoading && <button>Change Password</button>}
        {isLoading && <p>Sending Request...</p>}
      </div>
    </form>
  );
};

export default ProfileForm;
