import "../../scss/templates/login.scss";
import React, { Component } from "react";
import * as request from "../api/request";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  openLoginForm = () => {
    this.setState({ opened: true }, () => {
      setTimeout(() => {
        $("#login-form .form-group input[name='username']").focus();
      }, 1000);
    });
  };

  closeLoginForm = () => {
    $("#login-form")[0].reset();
    this.setState({ opened: false });
  };

  login = async () => {
    const username = $("#login-form .form-group input[name='username']").val();
    const password = $("#login-form .form-group input[name='password']").val();

    if (username.length < 1 || password.length < 1) {
      this.errorHighlight();
      return Notif.send({
        title: "Login",
        body: "Isi username dan password!",
      });
    }

    const matchedAdmin = await request.post("/db/getone", {
      db: "Admin",
      options: { username },
    });

    if (!matchedAdmin) {
      return Notif.send({
        title: "Login",
        body: `Admin ${username} tidak ditemukan!`,
      });
    }

    // Admin ditemukan
    else {
      // Cek password
      const matchedPassword = matchedAdmin.password == password;
      if (!matchedPassword) {
        return Notif.send({
          title: "Login",
          body: "Password salah!",
        });
      }
    }

    this.closeLoginForm();

    this.props.getLogin(matchedAdmin);
  };

  errorHighlight = () => {
    // Username
    const usernameInput = $("#login-form .form-group .username");
    if (usernameInput.val().length < 1) {
      usernameInput.css("border", "1px solid red");
    }

    // Password
    const passwordInput = $("#login-form .form-group .password");
    if (passwordInput.val().length < 1) {
      passwordInput.css("border", "1px solid red");
    }

    // Reset border color
    setTimeout(() => {
      // Username
      usernameInput.css("border", "1px solid grey");
      // Nominal
      passwordInput.css("border", "1px solid grey");
    }, 1000);
  };

  render() {
    const { opened } = this.state;
    const { theme } = this.props;
    return (
      <div className={opened ? "login-page login-page-active" : "login-page"}>
        <form id="login-form" onSubmit={(e) => e.preventDefault()}>
          <h1 className="form-title" style={{ backgroundColor: theme }}>
            <span>MASUK SEBAGAI ADMIN</span>
          </h1>
          <div className="form-group">
            <input name="username" placeholder="Username" type="email" />
          </div>
          <div className="form-group">
            <input name="password" placeholder="Password" type="password" />
          </div>
          <div className="form-group form-btns">
            <button className="save-btn" type="button" onClick={this.login}>
              Masuk
            </button>
            <div className="spacer"></div>
            <button
              className="cancel-btn"
              type="button"
              onClick={this.closeLoginForm}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }
}
