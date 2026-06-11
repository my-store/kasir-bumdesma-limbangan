import { upperCase, numberFormat } from "../api/helper/string";
import { UpdateInvestasi } from "../api/investasi";
import React, { Component } from "react";
import { FiEdit3 } from "react-icons/fi";
import "../../scss/investasi/form.scss";

export default class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: {
        hari: "",
        tanggal: "",
        bulan: "",
        tahun: "",
      },

      timestampOpened: false,
    };

    // Update 2025 - Sistem pemblokiran input ganda
    this.updateWait = false;
  }

  updateData = async () => {
    // Update 2025 - Sistem pemblokiran input ganda
    // Blokir jika user melakukan klik berkali-kali
    // pada tombol simpan saat input atau ubah data.
    if (this.updateWait) return;
    // Aktifkan pemblokiran sementara, jika sudah ter-input
    // makan pemblokiran akan di non-aktifkan kembali.
    this.updateWait = true;

    const id = $("#update-modal-form .id").val();
    const nominal = $("#update-modal-form .nominal").val().replace(/\,/gi, "");
    const keterangan = await upperCase(
      $("#update-modal-form .keterangan").val()
    );

    // Get from state
    let { timestamp } = this.state;

    if (nominal != "" && keterangan != "") {
      // Set ke tanggal lama, jika tanggal baru tidak di set,
      // atau set tanggal namun format salah, atau salahsatu tidak di isi.
      // Gunakan || bukan &&
      if (
        timestamp.hari == "" ||
        timestamp.tanggal == "" ||
        timestamp.bulan == "" ||
        timestamp.tahun == ""
      ) {
        const getTimestamp = $("#update-modal-form .timestamp");
        timestamp.hari = getTimestamp.attr("hari");
        timestamp.tanggal = getTimestamp.attr("tanggal");
        timestamp.bulan = getTimestamp.attr("bulan");
        timestamp.tahun = getTimestamp.attr("tahun");
      }

      // Hanya menggunakan 1 angka pada tanggal, 01 to 1
      timestamp.tanggal = parseInt(timestamp.tanggal);
      // Force tahun ke integer, karna setelah update akan berubah menjadi string
      timestamp.tahun = parseInt(timestamp.tahun);

      // Prepare data
      const data = { id, nominal: parseInt(nominal), timestamp, keterangan };

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Update data
      await UpdateInvestasi(data);

      // Success message
      Notif.send({
        title: "Ubah Modal",
        body: "Data berhasil diubah",
      });

      // Reload data
      await this.props.reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({
        title: "Ubah Modal",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.updateWait = false;
  };

  errorHighlight = () => {
    // Keterangan
    const keteranganInput = $("#update-modal-form .form-group .keterangan");
    if (keteranganInput.val().length < 1)
      keteranganInput.css("border", "1px solid red");
    // Nominal
    const nominalInput = $("#update-modal-form .form-group .nominal");
    if (nominalInput.val().length < 1)
      nominalInput.css("border", "1px solid red");
    // Reset border color
    setTimeout(() => {
      // Keterangan
      keteranganInput.css("border", "1px solid grey");
      // Nominal
      nominalInput.css("border", "1px solid grey");
    }, 1000);
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#update-modal-form ." + target).val(newVal);
  };

  listenTimestamp = () => {
    const tanggal = $(
      "#update-modal-form .timestamp-input input[placeholder='Tanggal']"
    );
    const bulan = $(
      "#update-modal-form .timestamp-input input[placeholder='Bulan']"
    );
    const tahun = $(
      "#update-modal-form .timestamp-input input[placeholder='Tahun']"
    );

    // Set timestamp state
    if (
      tanggal.val().length > 0 &&
      bulan.val().length > 0 &&
      tahun.val().length > 3
    ) {
      const date = new Date(
        parseInt(tahun.val()),
        parseInt(bulan.val()) - 1,
        parseInt(tanggal.val())
      );
      const timestamp = {
        hari: date.toLocaleString("id-ID", { weekday: "long" }),
        tanggal: tanggal.val(),
        bulan: date.toLocaleString("id-ID", { month: "long" }),
        tahun: tahun.val(),
      };
      this.setState({ timestamp });
    }
  };

  removeForm = () => {
    $("#update-modal-form")[0].reset();
    this.removeTimestamp();
    this.props.close();
  };

  openTimestamp = () => {
    this.setState({ timestampOpened: true });
  };

  removeTimestamp = () => {
    // Reset all timestamp input when closed
    const ti = $("#update-modal-form .timestamp-input input");
    for (let tx of ti) {
      $(tx).val(null);
    }

    // Ketika listenTimestamp merubah state timestamp
    // kemudian user menutup ubah tanggal (tidak jadi merubah),
    // maka reset kembali sesuai data lama.
    let timestamp = { ...this.state.timestamp };
    timestamp.hari = this.props.updateFormData.timestamp.hari;
    timestamp.bulan = this.props.updateFormData.timestamp.bulan;
    timestamp.tahun = this.props.updateFormData.timestamp.tahun;

    this.setState({ timestampOpened: false, timestamp });
  };

  render() {
    const data = this.props.updateFormData;
    const { timestampOpened, timestamp } = this.state;

    return (
      <div
        className={
          this.props.opened
            ? "form-container form-container-active"
            : "form-container"
        }
      >
        <form id="update-modal-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="hidden"
            className="id"
            defaultValue={data != null ? data.id : null}
          />
          <input
            type="hidden"
            className="timestamp"
            hari={data != null ? data.timestamp.hari : null}
            tanggal={data != null ? data.timestamp.tanggal : null}
            bulan={data != null ? data.timestamp.bulan : null}
            tahun={data != null ? data.timestamp.tahun : null}
          />

          <h1
            className="form-title"
            style={{ backgroundColor: this.props.theme }}
          >
            <span>MODAL</span>
            <span className="form-title-indicator">
              <FiEdit3 size={15} style={{ marginRight: 3 }} />
              Ubah data
            </span>
          </h1>

          <div className="form-group">
            <label>Keterangan</label>
            <textarea
              className="keterangan"
              defaultValue={data != null ? data.keterangan : null}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Nominal</label>
            <input
              className="nominal"
              type="text"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "nominal")
              }
              defaultValue={data != null ? numberFormat(data.nominal) : null}
            />
          </div>

          {/* Update 2025 */}
          {/* Timestamp */}
          <div className="form-group">
            <label className="update-timestamp-trigger">
              <input
                type="checkbox"
                checked={timestampOpened}
                onChange={({ target: { checked } }) => {
                  if (checked) {
                    this.openTimestamp();
                  } else {
                    this.removeTimestamp();
                  }
                }}
              />{" "}
              Ubah Tanggal
            </label>

            {/* Update 2025 */}
            {/* Timestamp Input */}
            <div
              className={
                timestampOpened
                  ? "timestamp-input timestamp-input-active"
                  : "timestamp-input"
              }
            >
              <input
                type="number"
                onChange={this.listenTimestamp}
                placeholder="Tanggal"
              />
              <div className="spacer"></div>
              <input
                type="number"
                onChange={this.listenTimestamp}
                placeholder="Bulan"
              />
              <div className="spacer"></div>
              <input
                type="number"
                onChange={this.listenTimestamp}
                placeholder="Tahun"
              />
            </div>

            {/* Timestamp Preview */}
            <p className="timestamp-preview">
              {data != null
                ? timestamp.hari == ""
                  ? data.timestamp.hari + ", "
                  : timestamp.hari + ", "
                : null}
              {data != null
                ? timestamp.tanggal == ""
                  ? data.timestamp.tanggal + " "
                  : timestamp.tanggal + " "
                : null}
              {data != null
                ? timestamp.bulan == ""
                  ? data.timestamp.bulan + " "
                  : timestamp.bulan + " "
                : null}
              {data != null
                ? timestamp.tahun == ""
                  ? data.timestamp.tahun
                  : timestamp.tahun
                : null}
            </p>
          </div>

          <div className="form-group form-btns">
            <button
              className="save-btn"
              type="button"
              onClick={this.updateData}
            >
              Simpan
            </button>
            <div className="spacer"></div>
            <button
              className="cancel-btn"
              type="button"
              onClick={this.removeForm}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }
}
