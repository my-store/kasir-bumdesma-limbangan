import { upperCase, numberFormat } from "../api/helper/string";
import { GetOneInventaris, UpdateInventaris } from "../api/inventaris";
import "../../scss/inventaris/form.scss";
import { FiEdit3 } from "react-icons/fi";
import React, { Component } from "react";
import { CekModal } from "../api/neraca";

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

    const id = $("#update-inventaris-form .id").val();
    const jenis = await upperCase($("#update-inventaris-form .jenis").val());

    // Harga perolehan = hargaSatuan * unit (jumlah beli)
    const unit = $("#update-inventaris-form .unit").val().replace(/\,/gi, "");
    const hargaSatuan = $("#update-inventaris-form .harga-satuan")
      .val()
      .replace(/\,/gi, "");
    const hargaPerolehan = parseInt(hargaSatuan) * parseInt(unit);

    // Get from state
    let { timestamp } = this.state;
    const { workTime, reload } = this.props;

    // Validasi
    if (jenis != "" && unit != "" && hargaSatuan != "") {
      // Set ke tanggal lama, jika tanggal baru tidak di set,
      // atau set tanggal namun format salah, atau salahsatu tidak di isi.
      // Gunakan || bukan &&
      if (
        timestamp.hari == "" ||
        timestamp.tanggal == "" ||
        timestamp.bulan == "" ||
        timestamp.tahun == ""
      ) {
        const getTimestamp = $("#update-inventaris-form .timestamp");
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
      const data = {
        id,

        // Data yang dapat diubah oleh user, form/input
        jenis,
        unit: parseInt(unit),
        hargaSatuan: parseInt(hargaSatuan),

        // Data yang dibuat otomatis mengikuti harga satuan dan jumlah unit
        hargaPerolehan: parseInt(hargaPerolehan),

        // Tanggal
        timestamp,
      };

      // Update 2025
      // Get old data for comparing
      const oldData = await GetOneInventaris({ id });

      // Update 2025
      // Tidak ada perubahan data
      const nothingChange =
        data.jenis == oldData.jenis &&
        // Jika ada perubahan nilai unit atau hargaSatuan,
        // maka secara otomatis akan merubah nilai hargaPerolehan pula.
        data.hargaPerolehan == oldData.hargaPerolehan &&
        // Jika user melakukan perubahan pada tanggal
        data.timestamp.tahun == oldData.timestamp.tahun &&
        data.timestamp.bulan == oldData.timestamp.bulan &&
        data.timestamp.tanggal == oldData.timestamp.tanggal;

      // Hentikan jika tidak ada perubahan
      if (nothingChange) {
        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.updateWait = false;

        // Reset dan tutup form
        return this.removeForm();
      }

      // Update 2025
      // Jika harga perolehan berubah, cek kembali sisa uang kas
      if (data.hargaPerolehan != oldData.hargaPerolehan) {
        // Cek modal/ kas
        const cekModal = await CekModal(workTime, {
          a: data.hargaPerolehan - oldData.hargaPerolehan,

          // Hanya mengelabuhi perkalian pada variable 'result' di CekModal
          // Karna nilai a akan dikalikan dengan nilai b,
          // CekModal dibuat karna kebutuhan pengecekan modal sebelum menginput data persediaan.
          b: 1,
        });
        // Uang kas habis atau bahkan kurang
        if (cekModal.status == false) {
          this.errorHighlight();
          let modalMsg = "Jumlah uang kas kurang";
          if (cekModal.kurangan < 0) {
            modalMsg += ` Rp ${numberFormat(Math.abs(cekModal.kurangan))}`;
          } else {
            modalMsg += ", setidaknya sisakan 1 Rupiah";
          }
          Notif.send({ title: "Ubah Inventaris", body: modalMsg });

          // Update 2025
          // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
          this.updateWait = false;

          return;
        }
      }

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Update data
      await UpdateInventaris(data);

      // Success message
      Notif.send({
        title: "Ubah Inventaris",
        body: "Data berhasil diubah",
      });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({
        title: "Ubah Inventaris",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.updateWait = false;
  };

  errorHighlight = () => {
    // Jenis
    const jenisInput = $("#update-inventaris-form .form-group .jenis");
    if (jenisInput.val().length < 1) {
      jenisInput.css("border", "1px solid red");
    }
    // Unit
    const unitInput = $("#update-inventaris-form .form-group .unit");
    if (unitInput.val().length < 1) {
      unitInput.css("border", "1px solid red");
    }
    // Harga satuan
    const hargaSatuanInput = $(
      "#update-inventaris-form .form-group .harga-satuan"
    );
    if (hargaSatuanInput.val().length < 1) {
      hargaSatuanInput.css("border", "1px solid red");
    }
    // Reset border color
    setTimeout(() => {
      // Jenis
      jenisInput.css("border", "1px solid grey");
      // Unit
      unitInput.css("border", "1px solid grey");
      // Harga satuan
      hargaSatuanInput.css("border", "1px solid grey");
    }, 1000);
  };

  listenTimestsamp = () => {
    const tanggal = $(
      "#update-inventaris-form .timestamp-input input[placeholder='Tanggal']"
    );
    const bulan = $(
      "#update-inventaris-form .timestamp-input input[placeholder='Bulan']"
    );
    const tahun = $(
      "#update-inventaris-form .timestamp-input input[placeholder='Tahun']"
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
    $("#update-inventaris-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#update-inventaris-form")[0].reset();
    this.removeTimestamp();
    this.props.close();
  };

  openTimestamp = () => {
    this.setState({ timestampOpened: true });
  };

  removeTimestamp = () => {
    // Reset all timestamp input when closed
    const ti = $("#update-inventaris-form .timestamp-input input");
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
        <form id="update-inventaris-form" onSubmit={(e) => e.preventDefault()}>
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
            <span>INVENTARIS</span>
            <span className="form-title-indicator">
              <FiEdit3 size={15} style={{ marginRight: 3 }} />
              Ubah data
            </span>
          </h1>

          <div className="form-group">
            <label>Jenis</label>
            <textarea
              className="jenis"
              defaultValue={data != null ? data.jenis : null}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Unit</label>
            <input
              className="unit"
              type="text"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "unit")
              }
              defaultValue={data != null ? numberFormat(data.unit) : null}
            />
          </div>

          <div className="form-group">
            <label>Harga Satuan</label>
            <input
              className="harga-satuan"
              type="text"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "harga-satuan")
              }
              defaultValue={
                data != null ? numberFormat(data.hargaSatuan) : null
              }
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
                onChange={this.listenTimestsamp}
                placeholder="Tanggal"
              />
              <div className="spacer"></div>
              <input
                type="number"
                onChange={this.listenTimestsamp}
                placeholder="Bulan"
              />
              <div className="spacer"></div>
              <input
                type="number"
                onChange={this.listenTimestsamp}
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
