import { indexOf } from "../api/helper/calendar";
import React, { Component } from "react";
import "../../scss/worktime/index.scss";

export default class Worktime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tahun: [],
      bulan: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
      openbox: {
        bulan: false,
        tahun: false,
      },
      placeholder: {
        bulan: null,
        tahun: null,
      },
      auto: false,
    };
  }

  componentDidMount() {
    this.getTime();
  }

  getTime = () => {
    // Tahun
    let { bulanIni, tahun } = this.props.workTime;
    let daftarTahun = [];

    // Dapatkan 3 tahun kedepan dan kebelakang
    const decreasedYear = parseInt(tahun) - 3;
    for (let x = 0; x < 7; x++) {
      daftarTahun.push(decreasedYear + x);
    }

    // Check auto
    const { auto, tanggal } = this.props.workTime;

    // Push state
    this.setState({
      auto,
      tahun: daftarTahun,
      placeholder: {
        tanggal,
        bulan: bulanIni,
        tahun,
      },
    });
  };

  setWorkTime = async () => {
    let month = this.state.placeholder.bulan;
    const year = this.state.placeholder.tahun;

    // Old date
    let { tanggal } = this.state.placeholder;

    // Get new date (if changed)
    if ($("#work-time-form .date-input").val() != "") {
      tanggal = parseInt($("#work-time-form .date-input").val());
    }

    // Jika bulan dan tahun masih sama (tidak ada perubahan)
    if (
      month == this.props.workTime.bulanIni &&
      year == this.props.workTime.tahun &&
      tanggal == this.props.workTime.tanggal
    ) {
      // Check jika tidak ada juga perubahan pada auto
      if (this.state.auto == this.props.workTime.auto) {
        return this.removeForm(); // Hentikan
      }
    }

    // Convert string month into number/ index
    month = indexOf(month);

    // Check auto-checkbox
    let { auto } = this.state;

    // Reset form
    // $("#work-time-form")[0].reset();

    // Close form
    await this.props.closeWorkTime();

    // Set worktime
    this.props.setWorkTime({ tanggal, month, year }, auto);
  };

  openBox = (id) =>
    this.setState({
      openbox: {
        ...this.state.openBox,
        ...id,
      },
    });

  updateData = (id) =>
    this.setState({
      placeholder: {
        ...this.state.placeholder,
        ...id,
      },
    });

  setAuto = () => this.setState({ auto: !this.state.auto });

  removeForm = () => {
    this.getTime(); // Reset time as default
    this.props.closeWorkTime();
  };

  render() {
    return (
      <div
        className={
          this.props.openWorkTime ? "work-time work-time-active" : "work-time"
        }
      >
        <form id="work-time-form" onSubmit={(e) => e.preventDefault()}>
          <h1
            style={{ backgroundColor: this.props.theme }}
            className="form-title"
          >
            ATUR WAKTU PENGELOLAAN
          </h1>
          <div className="form-group">
            <label>Tanggal</label>
            <input
              type="text"
              className="date-input"
              defaultValue={this.state.placeholder.tanggal}
            />
          </div>
          <div className="form-group">
            <label>Bulan</label>
            <p
              className="tombol-bulan"
              onClick={() => this.openBox({ bulan: !this.state.openbox.bulan })}
            >
              {this.state.placeholder.bulan}
            </p>
            <div
              className={
                this.state.openbox.bulan
                  ? "daftar-bulan daftar-bulan-active"
                  : "daftar-bulan"
              }
            >
              {this.props.workTime != null
                ? this.state.bulan.map((data, index) => {
                    return (
                      <p
                        key={index}
                        onClick={() => {
                          this.openBox({ bulan: false });
                          this.updateData({
                            bulan: data,
                          });
                        }}
                      >
                        {data}
                      </p>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="form-group">
            <label>Tahun</label>
            <p
              className="tombol-tahun"
              onClick={() => this.openBox({ tahun: !this.state.openbox.tahun })}
            >
              {this.state.placeholder.tahun}
            </p>
            <div
              className={
                this.state.openbox.tahun
                  ? "daftar-tahun daftar-tahun-active"
                  : "daftar-tahun"
              }
            >
              {this.props.workTime != null
                ? this.state.tahun.map((data, index) => {
                    return (
                      <p
                        key={index}
                        onClick={() => {
                          this.openBox({ tahun: false });
                          this.updateData({
                            tahun: data,
                          });
                        }}
                      >
                        {data}
                      </p>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="form-group auto-worktime">
            <input
              onChange={this.setAuto}
              checked={this.state.auto ? true : false}
              type="checkbox"
            />
            <label>Otomatis</label>
          </div>
          <div className="form-group form-btns">
            <button type="button" onClick={this.setWorkTime}>
              Simpan
            </button>
            <div className="spacer"></div>
            <button type="button" onClick={this.removeForm}>
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }
}
