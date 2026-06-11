import { upperCase, numberFormat } from "../api/helper/string";
import { InsertInventaris } from "../api/inventaris";
import { FiEdit3 } from "react-icons/fi";
import { CekModal } from "../api/neraca";
import "../../scss/inventaris/form.scss";
import React, { Component } from "react";

export default class Insert extends Component {
  constructor(props) {
    super(props);

    // Update 2025 - Sistem pemblokiran input ganda
    this.insertWait = false;
  }

  saveData = async () => {
    // Update 2025 - Sistem pemblokiran input ganda
    // Blokir jika user melakukan klik berkali-kali
    // pada tombol simpan saat input atau ubah data.
    if (this.insertWait) return;
    // Aktifkan pemblokiran sementara, jika sudah ter-input
    // makan pemblokiran akan di non-aktifkan kembali.
    this.insertWait = true;

    const jenis = await upperCase($("#insert-inventaris-form .jenis").val());

    // Harga perolehan = hargaSatuan * unit (jumlah beli)
    const unit = $("#insert-inventaris-form .unit").val().replace(/\,/gi, "");
    const hargaSatuan = $("#insert-inventaris-form .harga-satuan")
      .val()
      .replace(/\,/gi, "");
    const hargaPerolehan = parseInt(hargaSatuan) * parseInt(unit);

    const { workTime, reload } = this.props;

    // Validasi
    if (jenis != "" && unit != "" && hargaSatuan != "") {
      const { hari, tanggal, bulanIni, tahun } = workTime;
      const timestamp = {
        hari,
        tanggal,
        bulan: bulanIni,
        tahun,
      };

      let data = {
        jenis,
        unit: parseInt(unit),
        hargaSatuan: parseInt(hargaSatuan),
        hargaPerolehan: parseInt(hargaPerolehan),
        timestamp,
      };

      // Cek modal/ kas
      const cekModal = await CekModal(workTime, {
        a: data.hargaSatuan,
        b: data.unit,
      });
      if (cekModal.status == false) {
        this.errorHighlight();
        let modalMsg = "Jumlah uang kas kurang";
        if (cekModal.kurangan < 0) {
          modalMsg += ` Rp ${numberFormat(Math.abs(cekModal.kurangan))}`;
        } else {
          modalMsg += ", setidaknya sisakan 1 Rupiah";
        }
        Notif.send({ title: "Input Inventaris", body: modalMsg });

        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.insertWait = false;

        return;
      }

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Insert data
      await InsertInventaris(data);

      // Success message
      Notif.send({
        title: data.jenis,
        body: "Berhasil ditambahkan",
      });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({
        title: "Input Inventaris",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.insertWait = false;
  };

  errorHighlight = () => {
    // Jenis
    const jenisInput = $("#insert-inventaris-form .form-group .jenis");
    if (jenisInput.val().length < 1) {
      jenisInput.css("border", "1px solid red");
    }

    // Unit
    const unitInput = $("#insert-inventaris-form .form-group .unit");
    if (unitInput.val().length < 1) {
      unitInput.css("border", "1px solid red");
    }

    // Harga satuan
    const hargaSatuanInput = $(
      "#insert-inventaris-form .form-group .harga-satuan"
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

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#insert-inventaris-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#insert-inventaris-form")[0].reset();
    this.props.close();
  };

  render() {
    return (
      <div
        className={
          this.props.opened
            ? "form-container form-container-active"
            : "form-container"
        }
      >
        <form id="insert-inventaris-form" onSubmit={(e) => e.preventDefault()}>
          <h1
            className="form-title"
            style={{ backgroundColor: this.props.theme }}
          >
            <span>INVENTARIS</span>
            <span className="form-title-indicator">
              <FiEdit3 size={15} style={{ marginRight: 3 }} />
              Input data
            </span>
          </h1>
          <div className="form-group">
            <label>Jenis</label>
            <textarea className="jenis"></textarea>
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input
              type="text"
              className="unit"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "unit")
              }
            />
          </div>
          <div className="form-group">
            <label>Harga Satuan</label>
            <input
              type="text"
              className="harga-satuan"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "harga-satuan")
              }
            />
          </div>
          <div className="form-group form-btns">
            <button className="save-btn" type="button" onClick={this.saveData}>
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
