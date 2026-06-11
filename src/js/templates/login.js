import * as request from "../api/request";
import "../../scss/templates/login.scss";
import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  openLoginForm = () => {
    this.setState({ opened: true }, () => {
      setTimeout(() => $("input[name='username']").focus(), 1000);
    });
  };

  closeLoginForm = () => {
    $("#login-form")[0].reset();
    this.setState({ opened: false });
  };

  login = async () => {
    let username = $("input[name='username']");
    let password = $("input[name='password']");

    // Input not detected! -> Code error | Bug
    if (!username || !password) return;

    // Set variable contain the input value (not the input object or DOM)
    username = username.val();
    password = password.val();

    if (username.length < 1 || password.length < 1) {
      this.errorHighlight("username");
      this.errorHighlight("password");
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
      this.errorHighlight("username");
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
        this.errorHighlight("password");
        return Notif.send({
          title: "Login",
          body: "Password salah!",
        });
      }
    }

    this.closeLoginForm();

    this.props.getLogin(matchedAdmin);
  };

  errorHighlight = (inputName) => {
    const input = $(`input[name="${inputName}"]`);
    input.css("border", "2px solid red");

    // Reset border color
    setTimeout(() => {
      const inputs = $("#login-form input");
      for (let i of inputs) {
        $(i).css("border", "1px solid grey");
      }
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
