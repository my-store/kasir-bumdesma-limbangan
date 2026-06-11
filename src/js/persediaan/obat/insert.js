import { upperCase, numberFormat, makeUniqueId } from "../../api/helper/string";
import { InsertPersediaan } from "../../api/persediaan";
import { CekModal } from "../../api/neraca";
import { FiEdit3 } from "react-icons/fi";
import React, { Component } from "react";

export default class Insert extends Component {
  constructor(props) {
    super(props);

    // Update 2025 - Sistem pemblokiran input ganda
    this.insertWait = false;
  }

  insertData = async () => {
    // Update 2025 - Sistem pemblokiran input ganda
    // Blokir jika user melakukan klik berkali-kali
    // pada tombol simpan saat input atau ubah data.
    if (this.insertWait) return;
    // Aktifkan pemblokiran sementara, jika sudah ter-input
    // makan pemblokiran akan di non-aktifkan kembali.
    this.insertWait = true;

    const namaBarang = await upperCase(
      $("#insert-obatPertanian-form .nama-barang").val()
    );
    const satuan = await upperCase(
      $("#insert-obatPertanian-form .satuan").val()
    );

    // Hapus semua koma
    const stok = $("#insert-obatPertanian-form .stok")
      .val()
      .replace(/\,/gi, "");
    const hargaPokok = $("#insert-obatPertanian-form .hargaPokok")
      .val()
      .replace(/\,/gi, "");
    const hargaJual = $("#insert-obatPertanian-form .hargaJual")
      .val()
      .replace(/\,/gi, "");

    const { workTime, reload } = this.props;

    // Validasi
    if (
      namaBarang != "" &&
      stok != "" &&
      satuan != "" &&
      hargaPokok != "" &&
      hargaJual != ""
    ) {
      const { hari, tanggal, bulanIni, tahun } = workTime;
      const timestamp = {
        hari,
        tanggal,
        bulan: bulanIni,
        tahun,
      };

      let data = {
        id: await makeUniqueId(30), // Ini digunakan juga untuk nota
        namaBarang,
        timestamp,
        stok: parseInt(stok),
        satuan,
        hargaPokok: parseInt(hargaPokok),
        hargaJual: parseInt(hargaJual),
      };

      // Cek modal/ kas
      const cekModal = await CekModal(workTime, {
        a: hargaPokok,
        b: stok,
      });
      if (cekModal.status == false) {
        let modalMsg = "Jumlah uang kas kurang";
        if (cekModal.kurangan > 0) {
          modalMsg += ` Rp ${numberFormat(Math.abs(cekModal.kurangan))}`;
        }
        Notif.send({ title: "Input Obat Pertanian", body: modalMsg });

        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.insertWait = false;

        return;
      }

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Insert obat pertanian
      await InsertPersediaan({ id: "Obat", data });

      // Success message
      Notif.send({
        title: data.namaBarang,
        body: "Berhasil ditambahkan",
      });

      // Reload data
      await reload();

      // Scroll to bottom
      setTimeout(() => {
        // Scroll daftar obat
        const daftarObat = $(".obat .obat-list").eq(0);
        const obatHeight = daftarObat.prop("scrollHeight");
        daftarObat.animate({ scrollTop: obatHeight }, 500);

        // Scroll daftar nota
        const daftarNota = $("#nota-table").eq(0);
        const notaHeight = daftarNota.prop("scrollHeight");
        daftarNota.animate({ scrollTop: notaHeight }, 500);
      }, 1000);
    }

    // Failed message
    else {
      Notif.send({
        title: "Input Obat Pertanian",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.insertWait = false;
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#insert-obatPertanian-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#insert-obatPertanian-form")[0].reset();
    this.props.close();
  };

  render() {
    return (
      <form id="insert-obatPertanian-form">
        <h1
          className="form-title"
          style={{ backgroundColor: this.props.theme }}
        >
          <span>OBAT PERTANIAN</span>
          <span className="form-title-indicator">
            <FiEdit3 size={15} style={{ marginRight: 3 }} />
            Input data
          </span>
        </h1>
        <div className="form-group">
          <label>Nama Barang</label>
          <input type="text" className="nama-barang" autoComplete="off" />
        </div>
        <div className="form-group">
          <label>Jumlah</label>
          <input
            type="text"
            className="stok"
            onChange={({ target: { value } }) =>
              this.reformatNumber(value, "stok")
            }
          />
        </div>
        <div className="form-group">
          <label>Satuan</label>
          <input type="text" className="satuan" autoComplete="off" />
        </div>
        <div className="form-group harga">
          <div className="pokok">
            <label>Harga Pokok</label>
            <input
              type="text"
              className="hargaPokok"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "hargaPokok")
              }
            />
          </div>
          <div className="spacer"></div>
          <div className="jual">
            <label>Harga Jual</label>
            <input
              type="text"
              className="hargaJual"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "hargaJual")
              }
            />
          </div>
        </div>
        <div className="form-group form-btns">
          <button className="save-btn" type="button" onClick={this.insertData}>
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
    );
  }
}
