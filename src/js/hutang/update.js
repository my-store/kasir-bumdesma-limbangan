import { upperCase, numberFormat } from "../api/helper/string";
import { UpdateHutang, GetOneHutang } from "../api/hutang";
import { CekModal } from "../api/neraca";
import { FiEdit3 } from "react-icons/fi";
import React, { Component } from "react";
import "../../scss/hutang/form.scss";

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

    const id = $("#update-hutang-form .id").val();
    const status = $("#update-hutang-form .status").val();
    const pelunasan = $("#update-hutang-form .pelunasan").val();
    const keterangan = await upperCase(
      $("#update-hutang-form .keterangan").val()
    );
    const total = parseInt(
      $("#update-hutang-form .total").val().replace(/\,/gi, "")
    );

    // Get from state
    let { timestamp } = this.state;
    const { workTime, reload } = this.props;

    // Validasi
    if (keterangan != "" && total != "") {
      // Set ke tanggal lama, jika tanggal baru tidak di set,
      // atau set tanggal namun format salah, atau salahsatu tidak di isi.
      // Gunakan || bukan &&
      if (
        timestamp.hari == "" ||
        timestamp.tanggal == "" ||
        timestamp.bulan == "" ||
        timestamp.tahun == ""
      ) {
        const getTimestamp = $("#update-hutang-form .timestamp");
        timestamp.hari = getTimestamp.attr("hari");
        timestamp.tanggal = getTimestamp.attr("tanggal");
        timestamp.bulan = getTimestamp.attr("bulan");
        timestamp.tahun = getTimestamp.attr("tahun");
      }

      // Hanya menggunakan 1 angka pada tanggal, 01 to 1
      timestamp.tanggal = parseInt(timestamp.tanggal);
      // Force tahun ke integer, karna setelah update akan berubah menjadi string
      timestamp.tahun = parseInt(timestamp.tahun);

      // Update data
      let data = {
        id,
        keterangan,
        total: parseInt(total),
        status: parseInt(status),
        timestamp,
        pelunasan,
      };

      // Cek status lunas pada hutang
      const oldData = await GetOneHutang({ id });
      // Status lunas pada database dan update form berbeda
      if (oldData.status != data.status) {
        // 1=belum-lunas | 0=lunas
        if (data.status == 0) {
          // Ubah pelunasan
          const { hari, tanggal, bulanIni, tahun } = workTime;
          data.pelunasan = hari + ", " + tanggal + " " + bulanIni + " " + tahun;
        }

        // Perubahan data bukan untuk pelunasan
        else {
          data.pelunasan = "";
        }
      }

      // Cek modal/ kas
      const cekModal = await CekModal(workTime, {
        a: oldData.total - total,

        // Hanya mengelabuhi perkalian pada variable 'result' di CekModal
        // Karna nilai a akan dikalikan dengan nilai b,
        // CekModal dibuat karna kebutuhan pengecekan modal sebelum menginput data persediaan.
        b: 1,
      });
      if (cekModal.status == false) {
        this.errorHighlight();
        let modalMsg = "Jumlah uang kas kurang";
        if (cekModal.kurangan < 0) {
          modalMsg += ` Rp ${numberFormat(Math.abs(cekModal.kurangan))}`;
        } else {
          modalMsg += ", setidaknya sisakan 1 Rupiah";
        }
        Notif.send({ title: "Ubah Piutang", body: modalMsg });

        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.updateWait = false;

        return;
      }

      // Reset form (HARUS setelah data form diambil)
      await this.removeForm();

      // Update data
      await UpdateHutang(data);

      // Success message
      Notif.send({
        title: "Ubah Piutang",
        body: "Data berhasil diubah",
      });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({
        title: "Ubah Piutang",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.updateWait = false;
  };

  errorHighlight = () => {
    // Keterangan
    const keteranganInput = $("#insert-hutang-form .form-group .keterangan");
    if (keteranganInput.val().length < 1)
      keteranganInput.css("border", "1px solid red");
    // Nominal
    const nominalInput = $("#insert-hutang-form .form-group .total");
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

  listenTimestamp = () => {
    const tanggal = $(
      "#update-hutang-form .timestamp-input input[placeholder='Tanggal']"
    );
    const bulan = $(
      "#update-hutang-form .timestamp-input input[placeholder='Bulan']"
    );
    const tahun = $(
      "#update-hutang-form .timestamp-input input[placeholder='Tahun']"
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

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#update-hutang-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#update-hutang-form")[0].reset();
    this.removeTimestamp();
    this.props.close();
  };

  openTimestamp = () => {
    this.setState({ timestampOpened: true });
  };

  removeTimestamp = () => {
    // Reset all timestamp input when closed
    const ti = $("#update-hutang-form .timestamp-input input");
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

  getStatus = (_data) => {
    const statuses = [
      {
        state: 0,
        class: "lunas",
        name: "Lunas",
      },
      {
        state: 1,
        class: "belum-lunas",
        name: "Belum Lunas",
      },
    ];

    return statuses.map((_sts, index) => {
      const checked = _sts.state == _data.status ? true : false;
      return (
        <div
          key={index}
          className="checkbox-container"
          onClick={() => {
            $("#update-hutang-form ." + _sts.class).prop("checked", true);
            $("#update-hutang-form .status").val(_sts.state);
          }}
        >
          <input
            className={`status-checkbox ${_sts.class}`}
            type="radio"
            name="status"
            onChange={() => null}
            checked={checked}
          />
          <label>{_sts.name}</label>
        </div>
      );
    });
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
        <form id="update-hutang-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="hidden"
            className="id"
            defaultValue={data != null ? data.id : null}
          />
          <input
            type="hidden"
            className="status"
            defaultValue={data != null ? data.status : null}
          />
          <input
            type="hidden"
            className="pelunasan"
            defaultValue={data != null ? data.pelunasan : null}
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
            <span>PIUTANG</span>
            <span className="form-title-indicator">
              <FiEdit3 size={15} style={{ marginRight: 3 }} />
              Ubah data
            </span>
          </h1>
          <div className="form-group">
            <label>Jenis</label>
            <textarea
              className="keterangan"
              defaultValue={data != null ? data.keterangan : null}
            ></textarea>
          </div>

          {/* Total */}
          <div className="form-group">
            <label>Total</label>
            <input
              className="total"
              type="text"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "total")
              }
              defaultValue={data != null ? numberFormat(data.total) : null}
            />
          </div>

          {/* Status */}
          <div className="form-group status-container">
            {data != null ? this.getStatus(data) : null}
          </div>

          {/* Update 2025 */}
          {/* Cicilan */}
          <div className="form-group cicilan-container">
            <label>Cicilan</label>
            <input
              className="ciclan"
              type="text"
              // onChange={({ target: { value } }) =>
              //   this.reformatNumber(value, "total")
              // }
              // defaultValue={data != null ? numberFormat(data.total) : null}
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

          {/* Buttons */}
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
