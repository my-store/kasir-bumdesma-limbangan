import { UpdatePersediaan, GetOnePupukSubsidi } from "../../api/persediaan";
import { upperCase, numberFormat } from "../../api/helper/string";
import { CekModal } from "../../api/neraca";
import { FiEdit3 } from "react-icons/fi";
import React, { Component } from "react";

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

    const id = $("#update-pupuk-subsidi-form .id").val();
    const namaBarang = await upperCase(
      $("#update-pupuk-subsidi-form .nama-barang").val()
    );
    // Stok
    const stok = $("#update-pupuk-subsidi-form .stok")
      .val()
      .replace(/\,/gi, "");
    // Satuan
    const satuan = await upperCase(
      $("#update-pupuk-subsidi-form .satuan").val()
    );
    // Harga pokok
    const hargaPokok = $("#update-pupuk-subsidi-form .hargaPokok")
      .val()
      .replace(/\,/gi, "");
    // Harga jual
    const hargaJual = $("#update-pupuk-subsidi-form .hargaJual")
      .val()
      .replace(/\,/gi, "");

    // Tanggal
    let { timestamp } = this.state;
    const { workTime, reload } = this.props;

    // Validasi
    if (satuan != "" && hargaPokok != "" && stok != "" && hargaJual != "") {
      // Set ke tanggal lama, jika tanggal baru tidak di set,
      // atau set tanggal namun format salah, atau salahsatu tidak di isi.
      // Gunakan || bukan &&
      if (
        timestamp.hari == "" ||
        timestamp.tanggal == "" ||
        timestamp.bulan == "" ||
        timestamp.tahun == ""
      ) {
        const getTimestamp = $("#update-pupuk-subsidi-form .timestamp");
        timestamp.hari = getTimestamp.attr("hari");
        timestamp.tanggal = getTimestamp.attr("tanggal");
        timestamp.bulan = getTimestamp.attr("bulan");
        timestamp.tahun = getTimestamp.attr("tahun");
      }

      // Hanya menggunakan 1 angka pada tanggal, 01 to 1
      timestamp.tanggal = parseInt(timestamp.tanggal);
      // Force tahun ke integer, karna setelah update akan berubah menjadi string
      timestamp.tahun = parseInt(timestamp.tahun);

      let data = {
        id,

        // Set milai default jika kosong
        namaBarang: namaBarang == "" ? "Pupuk Subsidi" : namaBarang,

        timestamp,
        satuan,
        hargaPokok: parseInt(hargaPokok),
        hargaJual: parseInt(hargaJual),
        stok: parseInt(stok),
      };

      // Update 2025
      // Get old data for comparing
      const oldData = await GetOnePupukSubsidi({ id });

      // Update 2025
      // Tidak ada perubahan data
      const nothingChange =
        data.namaBarang == oldData.namaBarang &&
        data.satuan == oldData.satuan &&
        data.hargaPokok == oldData.hargaPokok &&
        data.hargaJual == oldData.hargaJual &&
        data.stok == oldData.stok &&
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
      // Jika harga pokok dan stok berubah, cek kembali sisa uang kas,
      // karna neraca dan laporan membutuhkan informasi terkait harga pokok dan stok, bukan harga jual.
      if (data.hargaPokok != oldData.hargaPokok || data.stok != oldData.stok) {
        // Cek modal/ kas
        const cekModal = await CekModal(workTime, {
          a:
            // Cek apakah perubahan harga pokok ini menambah atau mengurangi
            data.hargaPokok > oldData.hargaPokok
              ? // Jika harga pokok baru > harga pokok lama (menambah)
                data.hargaPokok - oldData.hargaPokok // HPP baru - HPP lama
              : // Jika harga pokok baru < harga pokok lama (mengurangi)
                oldData.hargaPokok - data.hargaPokok,
          b: data.stok,
        });
        if (cekModal.status == false) {
          let modalMsg = "Jumlah uang kas kurang";
          if (cekModal.kurangan < 0) {
            modalMsg += ` Rp ${numberFormat(Math.abs(cekModal.kurangan))}`;
          } else {
            modalMsg += ", setidaknya sisakan 1 Rupiah";
          }
          Notif.send({ title: "Ubah Pupuk Subsidi", body: modalMsg });

          // Update 2025
          // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
          this.updateWait = false;

          return;
        }
      }

      // Reset form (HARUS setelah data form diambil)
      await this.removeForm();

      // Update data
      await UpdatePersediaan({ id: "PupukSubsidi", data });

      // Success message
      Notif.send({
        title: data.namaBarang,
        body: "Berhasil diubah",
      });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      Notif.send({
        title: "Ubah Pupuk Subsidi",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.updateWait = false;
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#update-pupuk-subsidi-form ." + target).val(newVal);
  };

  listenTimestamp = () => {
    const tanggal = $(
      "#update-pupuk-subsidi-form .timestamp-input input[placeholder='Tanggal']"
    );
    const bulan = $(
      "#update-pupuk-subsidi-form .timestamp-input input[placeholder='Bulan']"
    );
    const tahun = $(
      "#update-pupuk-subsidi-form .timestamp-input input[placeholder='Tahun']"
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
    $("#update-pupuk-subsidi-form")[0].reset();
    this.removeTimestamp();
    this.props.close();
  };

  openTimestamp = () => {
    this.setState({ timestampOpened: true });
  };

  removeTimestamp = () => {
    // Reset all timestamp input when closed
    const ti = $("#update-pupuk-subsidi-form .timestamp-input input");
    for (let tx of ti) {
      $(tx).val(null);
    }

    // Ketika listenTimestamp merubah state timestamp
    // kemudian user menutup ubah tanggal (tidak jadi merubah),
    // maka reset kembali sesuai data lama.
    let timestamp = { ...this.state.timestamp };
    timestamp.hari = this.props.updateData.timestamp.hari;
    timestamp.bulan = this.props.updateData.timestamp.bulan;
    timestamp.tahun = this.props.updateData.timestamp.tahun;

    this.setState({ timestampOpened: false, timestamp });
  };

  render() {
    const data = this.props.updateData;
    const { timestampOpened, timestamp } = this.state;

    return (
      <form id="update-pupuk-subsidi-form">
        {/* Hidden data */}
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
          <span>PUPUK SUBSIDI</span>
          <span className="form-title-indicator">
            <FiEdit3 size={15} style={{ marginRight: 2 }} />
            Ubah data
          </span>
        </h1>

        <div className="form-group">
          <label>Nama Barang</label>
          <input
            type="text"
            className="nama-barang"
            autoComplete="off"
            defaultValue={data != null ? data.namaBarang : null}
          />
        </div>

        <div className="form-group">
          <label>Stok</label>
          <input
            type="text"
            className="stok"
            defaultValue={data != null ? numberFormat(data.stok) : null}
            onChange={({ target: { value } }) =>
              this.reformatNumber(value, "stok")
            }
          />
        </div>

        <div className="form-group">
          <label>Satuan</label>
          <input
            type="text"
            className="satuan"
            autoComplete="off"
            defaultValue={data != null ? data.satuan : null}
          />
        </div>

        <div className="form-group harga">
          <div className="pokok">
            <label>Harga Pokok</label>
            <input
              type="text"
              className="hargaPokok"
              defaultValue={data != null ? numberFormat(data.hargaPokok) : null}
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
              defaultValue={data != null ? numberFormat(data.hargaJual) : null}
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "hargaJual")
              }
            />
          </div>
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
            Ubah Tanggal Pembelian
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
          <button className="save-btn" type="button" onClick={this.updateData}>
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
