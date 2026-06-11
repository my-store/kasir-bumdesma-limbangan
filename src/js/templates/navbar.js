import "../../scss/templates/navbar.scss";
import Operasional from "../operasional";
import React, { Component } from "react";
import MesinKasir from "../mesin-kasir";
import Persediaan from "../persediaan";
import Inventaris from "../inventaris";
import Investasi from "../investasi";
import Bank from "../bank";
import AsetTetap from "../aset-tetap";
import Laporan from "../laporan";
import Neraca from "../neraca";
import Hutang from "../hutang";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
    };
  }

  componentDidMount() {
    this.loadPage("navbar-links-kasir", "Mesin Kasir", <MesinKasir />);
  }

  loadPage = async (className, title, page) => {
    // Block multi click
    if (title == this.state.title) return;

    this.setState({ title });
    this.changeColor(className);
    this.props.navigate(page);
  };

  changeColor = (className) => {
    const navBtns = $(".navbar-links").children();
    for (let x = 0; x < navBtns.length; x++) {
      if (navBtns.eq(x).attr("class") != className) {
        navBtns.eq(x).css({ color: "black" });
        navBtns.eq(x).css({ fontWeight: "normal" });
        navBtns.eq(x).css({ borderBottom: "none" });
      } else {
        navBtns.eq(x).css({ color: this.props.theme });
        navBtns.eq(x).css({ fontWeight: "bold" });
        navBtns.eq(x).css({ borderBottom: `1px solid ${this.props.theme}` });
      }
    }
  };

  render() {
    const { login, loginPage, getLogout, theme } = this.props;

    return (
      <div className="navbar">
        <div className="navbar-head">
          <h1 className="label" style={{ backgroundColor: theme }}>
            {this.state.title}
          </h1>
          <div className="navbar-links">
            <p
              className="navbar-links-kasir"
              onClick={() =>
                this.loadPage(
                  "navbar-links-kasir",
                  "Mesin Kasir",
                  <MesinKasir />
                )
              }
            >
              Kasir
            </p>
            <p
              className="navbar-links-bank"
              onClick={() =>
                this.loadPage("navbar-links-bank", "Bank", <Bank />)
              }
            >
              Bank
            </p>
            <p
              className="navbar-links-persediaan"
              onClick={() =>
                this.loadPage(
                  "navbar-links-persediaan",
                  "Persediaan",
                  <Persediaan />
                )
              }
            >
              Persediaan
            </p>
            <p
              className="navbar-links-inventaris"
              onClick={() =>
                this.loadPage(
                  "navbar-links-inventaris",
                  "Inventaris",
                  <Inventaris />
                )
              }
            >
              Inventaris
            </p>
            <p
              className="navbar-links-asetTetap"
              onClick={() =>
                this.loadPage(
                  "navbar-links-asetTetap",
                  "Aset Tetap",
                  <AsetTetap />
                )
              }
            >
              Aset-Tetap
            </p>
            <p
              className="navbar-links-operasional"
              onClick={() =>
                this.loadPage(
                  "navbar-links-operasional",
                  "Operasional",
                  <Operasional />
                )
              }
            >
              Operasional
            </p>
            <p
              className="navbar-links-hutang"
              onClick={() =>
                this.loadPage("navbar-links-hutang", "Piutang", <Hutang />)
              }
            >
              Piutang
            </p>
            <p
              className="navbar-links-investasi"
              onClick={() =>
                this.loadPage("navbar-links-investasi", "Modal", <Investasi />)
              }
            >
              Modal
            </p>
            <p
              className="navbar-links-neraca"
              onClick={() =>
                this.loadPage("navbar-links-neraca", "Neraca", <Neraca />)
              }
            >
              Neraca
            </p>
            <p
              className="navbar-links-laporan"
              onClick={() =>
                this.loadPage("navbar-links-laporan", "Laporan", <Laporan />)
              }
            >
              Laporan
            </p>
          </div>
        </div>
        <div className="navbar-admin">
          {!login.status && (
            <button
              className="login-btn"
              onClick={() => loginPage.current.openLoginForm()}
              style={{ backgroundColor: theme }}
            >
              Login
            </button>
          )}
          {login.status && (
            <div className="admin-data">
              <p className="admin-name">{login.data.nama}</p>
              <button
                className="logout-btn"
                style={{ backgroundColor: theme }}
                onClick={getLogout}
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
