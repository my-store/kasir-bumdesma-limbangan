import { indexOf, reloadTime, setTime } from "./api/helper/calendar";
import React, { Component, createRef } from "react";
import ColorPicker from "./templates/color-picker";
import Welcome from "./templates/welcome";
import * as request from "./api/request";
import Footer from "./templates/footer";
import Navbar from "./templates/navbar";
import Worktime from "./worktime";
import ReactDOM from "react-dom";
import "../scss/index.scss";
import Login from "./templates/login";
import Confirm from "./templates/confirm";

/*  ENTRY POINT
|
|   Ini adalah kelas utama atau entry point aplikasi,
|   kelas ini yang menampung seluruh komponen didalam aplikasi.
|
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _page: null,
      theme: null,
      workTime: null,
      openWorkTime: false,
      openColorPicker: false,

      dataToko: {
        nama: "BUMDESMA UNGGUL PERKASA KERSANA",
        alamat: "LIMBANGAN KEC. KERSANA KAB. BREBES JAWA TENGAH",
        tlp: "/root/index.js/App.js/state.dataToko",
        laporan: {
          print: {
            penyetuju: {
              nama: "Dwiyan Riyadianto, A.Md",
              jabatan: "Ketua UPK",
            },
            pembuat: {
              nama: "Tino Rindianto",
              jabatan: "Kepala Toko",
            },
          },
        },
      },

      login: {
        status: false,
        data: null,
      },
    };
    this.__mounted__ = false;
    this.LoginRef = createRef();
    this.ConfirmRef = createRef();
  }

  async componentDidMount() {
    this.__mounted__ = true;

    // Get theme
    await this.getTheme();

    // Get work-time
    this.getWorktime();
  }

  componentWillUnmount() {
    this.__mounted__ = false;
  }

  getWorktime = async () => {
    // Ambil worktime
    const workTime = await request.post("/db/getone", {
      db: "Application.Settings",
      options: { id: "sQIiyFFFmT6ViMJE" },
    });

    // Destruct work-time
    let { hari, tanggal, bulanLalu, bulanIni, tahun } = workTime.value;
    const auto = eval(workTime.auto);

    // Jika auto == true, maka work-time adalah bulan ini
    if (auto == true) {
      const timestamp = await reloadTime();
      const _st = await setTime({
        month: await indexOf(timestamp.bulan),
        year: timestamp.tahun,
      });

      hari = timestamp.hari;
      tanggal = timestamp.tanggal;
      bulanLalu = _st.bulanLalu;
      bulanIni = _st.bulanIni;
      tahun = _st.tahun;
    }
    this.__mounted__ &&
      this.setState({
        workTime: { hari, tanggal, bulanIni, bulanLalu, tahun, auto },
      });
  };

  setWorkTime = async (time, auto) => {
    const { bulanLalu, bulanIni, tahun } = await setTime(time);

    // Hari
    let date = new Date(
      parseInt(time.year),
      parseInt(time.month),
      parseInt(time.tanggal)
    );
    let hari = date.toLocaleString("id-ID", { weekday: "long" });
    const { tanggal } = time;

    // Update worktime
    await request.post("/db/update", {
      db: "Application.Settings",
      data: {
        id: "sQIiyFFFmT6ViMJE",
        auto,
        value: { hari, tanggal, bulanLalu, bulanIni, tahun },
      },
    });

    // Reload page
    location.reload();
  };

  openWorkTime = () =>
    this.__mounted__ && this.setState({ openWorkTime: true });

  closeWorkTime = () =>
    this.__mounted__ && this.setState({ openWorkTime: false });

  changePage = (_page) =>
    this.__mounted__ &&
    this.setState({
      _page: {
        ..._page,
        props: {
          theme: this.state.theme,
          workTime: this.state.workTime,
          setWorkTime: this.setWorkTime,

          // Update 2025
          dataToko: this.state.dataToko,
          login: this.state.login,
          confirmPage: this.ConfirmRef,
        },
      },
    });

  getTheme = async () => {
    const theme = await request.post("/db/getone", {
      db: "Application.Settings",
      options: { id: "AzQK06f5v1Tc0rjS" },
    });
    this.__mounted__ && this.setState({ theme: theme.value });
  };

  changeTheme = async (value) => {
    await request.post("/db/update", {
      db: "Application.Settings",
      data: {
        id: "AzQK06f5v1Tc0rjS",
        value,
      },
    });
  };

  prepareTheme = (value) => {
    this.__mounted__ &&
      this.setState({
        _page: Object.assign({}, this.state._page, {
          props: {
            ...this.state._page.props, // Another props
            theme: value, // Theme for page
          },
        }),
        theme: value, // Theme for navbar
      });
  };

  // Update 2025
  getLogin = (data) =>
    this.setState(
      { login: { status: true, data } },
      () => this.changePage(this.state._page) // Reload page
    );

  // Update 2025
  getLogout = () =>
    this.setState(
      { login: { status: false, data: null } },
      () => this.changePage(this.state._page) // Reload page
    );

  openColorPicker = () =>
    this.__mounted__ && this.setState({ openColorPicker: true });

  removeColorPicker = () =>
    this.__mounted__ && this.setState({ openColorPicker: false });

  /*  RENDER ROCCESS
  |
  |   Ini adalah proses rendering aplikasi,
  |   jika state berubah, apapun yang ada didalamnya akan dirender ulang.
  |
  */
  render() {
    const {
      theme,
      login,
      workTime,
      openColorPicker,
      openWorkTime,
      dataToko,
      _page,
    } = this.state;

    if (workTime != null) {
      return (
        <div>
          <Confirm ref={this.ConfirmRef} theme={theme} />
          <Login ref={this.LoginRef} theme={theme} getLogin={this.getLogin} />

          <Navbar
            theme={theme}
            navigate={this.changePage}
            loginPage={this.LoginRef}
            getLogout={this.getLogout}
            login={login}
          />

          <div className="halaman">
            <ColorPicker
              theme={theme}
              changeTheme={this.changeTheme}
              prepareTheme={this.prepareTheme}
              removeColorPicker={this.removeColorPicker}
              openColorPicker={openColorPicker}
            />
            <Worktime
              theme={theme}
              setWorkTime={this.setWorkTime}
              workTime={workTime}
              closeWorkTime={this.closeWorkTime}
              openWorkTime={openWorkTime}
            />
            {_page}
          </div>

          <Footer
            workTime={workTime}
            openWorkTime={this.openWorkTime}
            openColorPicker={this.openColorPicker}
          />
        </div>
      );
    } else {
      return <Welcome dataToko={dataToko} />;
    }
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
