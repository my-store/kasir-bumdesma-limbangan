import { numberFormat, makeUniqueId, upperCase } from "../api/helper/string";
import { InsertTransaksi, GetDayTransaction } from "../api/transaksi";
import { indexOf, getThisMonth } from "../api/helper/calendar";
import { GetLaporan } from "../api/laporan";
import "../../scss/mesin-kasir/index.scss";
import * as request from "../api/request";
import { GetNeraca } from "../api/neraca";
import { FiEdit3 } from "react-icons/fi";
import React, { Component } from "react";
import Pendapatan from "./pendapatan";
import * as _myFunc from "./helpers";
import Keranjang from "./keranjang";
import Transaksi from "./transaksi";
import PrintStruk from "./struk";
import Produk from "./produk";
import Margin from "./margin";
import {
  GetOnePupukSubsidi,
  UpdatePersediaan,
  GetPersediaan,
  GetOnePupuk,
  GetOneObat,
} from "../api/persediaan";
import Kas from "./kas";

// Entry point
export default class Mesin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Loading | Waktu tunggu
      _isLoading: {
        _produk: true,
        _transaksi: true,
        _pendapatan: true,
        _kas: true,
      },

      // Keranjang
      keranjang: {
        daftar: [],
        kembalian: 0,
        operasional: 0,
        total: 0,
        openedTimestampForm: false,
        openedOperationalForm: false,
        openedInputAmount: false,
      },

      // Manual worktime (Keranjang)
      timestamp: {
        hari: "",
        tanggal: "",
        bulan: "",
        tahun: "",
      },

      // Daftar obat pertanian
      obatPertanian: [],

      // Daftar pupuk
      pupuk: [],

      // Update 2025
      // Daftar pupuk subsidi
      pupukSubsidi: [],

      // Daftar & Total transaksi
      transaksi: {
        daftar: [],
        cariData: [],
        total: 0,
      },

      // Uang kas s/d bulan ini
      kas: 0,

      // Pendapatan / Omset
      pendapatan: {
        omset: {
          pupuk: 0,
          pupukSubsidi: 0,
          obatPertanian: 0,
          semua: 0,
        },

        // Margin
        margin: {
          pupuk: 0,
          pupukSubsidi: 0,
          obatPertanian: 0,
          semua: 0,
        },
      },

      // Struk
      strukOpened: false,
      strukData: null,
    };
    this.__mounted__ = false;

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    // Untuk menghindari pengetukan tombol bayar berkali-kali.
    this.transactionWait = false;
  }

  async componentDidMount() {
    this.__mounted__ = true;

    // Load data
    await this.loadData();

    // Enter handler (manual amount input)
    $("#input-amount-form .jumlah").on("keyup", ({ keyCode }) => {
      if (keyCode == 13) {
        this.setInputAmount();
      }
    });
  }

  componentWillUnmount() {
    this.__mounted__ = false;

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    // Untuk menghindari pengetukan tombol bayar berkali-kali.
    this.transactionWait = false;
  }

  loadData = async () => {
    // Persediaan
    const { obatPertanian, pupuk, pupukSubsidi } = await GetPersediaan(
      this.props.workTime,
    );
    this.__mounted__ &&
      this.setState({
        obatPertanian,
        pupuk,
        pupukSubsidi,
        _isLoading: {
          ...this.state._isLoading,
          _produk: false,
        },
      });

    // Transaksi & Omset
    const { transaksi, omset, margin } = await GetDayTransaction(
      this.props.workTime,
    );
    this.__mounted__ &&
      this.setState({
        transaksi: {
          daftar: transaksi,
          total: transaksi.length,
          cariData: [],
        },

        pendapatan: {
          omset,
          margin,
        },

        _isLoading: {
          ...this.state._isLoading,
          _transaksi: false,
          _pendapatan: false,
        },
      });

    // Kas
    const {
      aktiva: { kas },
    } = await GetNeraca(this.props.workTime);
    this.__mounted__ &&
      this.setState({
        kas,
        _isLoading: {
          ...this.state._isLoading,
          _kas: false,
        },
      });
  };

  searchData = async (id, _val) => {
    // Obat
    if (id == "Obat") {
      const obatPertanian = await _myFunc.cariObat(_val, this.props.workTime);
      this.__mounted__ && this.setState({ obatPertanian });
    }
    // Pupuk
    else if (id == "Pupuk") {
      const pupuk = await _myFunc.cariPupuk(_val, this.props.workTime);
      this.__mounted__ && this.setState({ pupuk });
    }
    // Pupuk subsidi
    else if (id == "PupukSubsidi") {
      const pupukSubsidi = await _myFunc.cariPupukSubsidi(
        _val,
        this.props.workTime,
      );
      this.__mounted__ && this.setState({ pupukSubsidi });
    }
  };

  chooseProduct = async ({ id, data }) => {
    // Reset search form
    if (id == "Obat") {
      $(".obatPertanian .search-container")[0].reset();
    } else if (id == "Pupuk") {
      $(".pupuk .search-container")[0].reset();
    } else if (id == "PupukSubsidi") {
      $(".pupuk-subsidi .search-container")[0].reset();
    }

    const { keranjang } = await _myFunc.pilihProduk({
      id,
      data,
      keranjang: this.state.keranjang,
    });

    // Jika stok habis
    if (keranjang != null) {
      this.__mounted__ && this.setState({ keranjang });
    }

    // Update 2025
    // Reload data produk
    // Barangkali user melakukan pencarian, ketika klik produk untuk masuk ke keranjang
    // harus di reset daftar obat|pupuk.
    await this.searchData(id, "");
  };

  increaseAmount = async (id) => {
    const { keranjang } = await _myFunc.tambahPembelian(
      id,
      this.state.keranjang,
    );
    setTimeout(() => $(".keranjang .input-jumlah-uang").focus(), 300);
    this.__mounted__ && this.setState({ keranjang });
  };

  decreaseAmount = async (id) => {
    const { keranjang } = await _myFunc.kurangiPembelian(
      id,
      this.state.keranjang,
    );
    setTimeout(() => $(".keranjang .input-jumlah-uang").focus(), 300);
    this.__mounted__ && this.setState({ keranjang });
  };

  removeFromCart = async (id) => {
    const { keranjang } = await _myFunc.hapusDariKeranjang(
      id,
      this.state.keranjang,
    );
    this.__mounted__ && this.setState({ keranjang });

    // Jika keranjang kosong, reset form
    if (this.state.keranjang.daftar.length < 1) {
      this.resetForm();
    } else {
      setTimeout(() => $(".keranjang .input-jumlah-uang").focus(), 300);
    }
  };

  // Set uang kembalian
  setChange = (getVal) => {
    const { keranjang } = _myFunc.uangKembalian(getVal, this.state.keranjang);
    this.__mounted__ && this.setState({ keranjang });
  };

  reformatNumber = async (getVal, target) => {
    await _myFunc.reformatNumber(getVal, target);

    const val = getVal.replace(/\,/gi, "");

    // Biaya operasional
    if (target == "input-biaya-operasional") {
      // Reset jumlah uang dan kembalian
      $(".keranjang .input-jumlah-uang").val(null);
      const kembalian = null;
      // Update state
      this.__mounted__ &&
        this.setState({
          keranjang: {
            ...this.state.keranjang,
            operasional: val.length > 0 ? parseInt(val) : 0,
            kembalian,
          },
        });
    }
  };

  getTimestamp = async () => {
    // Convert string bulan ke number
    const getBulan = await indexOf(this.props.workTime.bulanIni);

    // Dapatkan awal dan akhir bulan tersebut
    const {
      awal: { hari, tanggal, bulan },
      tahun,
    } = await getThisMonth(this.props.workTime.tahun, getBulan);

    return { hari, tanggal, bulan, tahun };
  };

  setTimestamp = () => {
    _myFunc.listenTimestamp(
      (timestamp) =>
        this.__mounted__ && timestamp && this.setState({ timestamp }),
    );
  };

  openOperationalForm = async () => {
    const { keranjang } = await _myFunc.openOperationalForm(
      this.state.keranjang,
    );
    this.__mounted__ && this.setState({ keranjang });
  };

  openInputAmount = async (getId) => {
    const id = $("#input-amount-form .id");
    id.val(getId);

    // Title/ head
    const head = $("#input-amount-form .form-title .form-title-text");

    // Push default amount into manual amount form
    const jumlah = $("#input-amount-form .jumlah");
    const { keranjang } = this.state;

    const matched = await keranjang.daftar.find((p) => p.id == getId);
    if (matched) {
      // Ubah form penambahan beli dengan nama barang
      head.html(matched.namaBarang);

      // Open manual amount form
      this.__mounted__ &&
        this.setState({ openedInputAmount: true }, () => {
          setTimeout(() => {
            // Set input penambahan jumlah (sesuai nilai beli sekarang/ saat di klik)
            jumlah.val(matched.beli);
            // Auto focus ke input penambahan jumlah pembelian
            jumlah.focus();
          }, 300);
        });
    }
  };

  setInputAmount = async () => {
    // Input jumlah pembelian
    const jumlahInput = $("#input-amount-form .jumlah")
      .val()
      .replace(/\s/gi, "")
      .replace(/\,/gi, "");

    // ID (hidden)
    const id = $("#input-amount-form .id").val();

    // Cek data
    let data = null;

    // Obat
    const is_obat = await GetOneObat({ id });
    if (is_obat) {
      data = is_obat;
    }

    // Pupuk
    const is_pupuk = await GetOnePupuk({ id });
    if (is_pupuk) {
      data = is_pupuk;
    }

    // Pupuk subsidi
    const is_pupukSubsidi = await GetOnePupukSubsidi({ id });
    if (is_pupukSubsidi) {
      data = is_pupukSubsidi;
    }

    // Cek stok
    const { stok, namaBarang, satuan } = data;

    if (parseInt(stok) < parseInt(jumlahInput)) {
      return Notif.send({
        title: "Ubah Jumlah Pembelian",
        body: `Stok ${namaBarang} tersisa ${numberFormat(stok)} ${satuan}`,
      });
    }

    // Loloskan jika input jumlah tidak kosong
    if (jumlahInput != "" || jumlahInput.length > 0) {
      const newKeranjangState = await _myFunc.setManualPembelian(
        this.state.keranjang,
      );
      setTimeout(() => $(".keranjang .input-jumlah-uang").focus(), 500);
      this.__mounted__ && this.setState({ ...newKeranjangState });
    }
  };

  removeInputAmount = () =>
    this.__mounted__ && this.setState({ openedInputAmount: false });

  openTimestamp = async () => {
    const tanggal = $(".timestamp-input input[placeholder='Tanggal']");
    const bulan = $(".timestamp-input input[placeholder='Bulan']");
    const tahun = $(".timestamp-input input[placeholder='Tahun']");
    const { keranjang } = await _myFunc.openTimestamp(this.state.keranjang);
    this.__mounted__ &&
      this.setState({
        keranjang,
        timestamp: {
          hari: "",
          tanggal: "",
          bulan: "",
          tahun: "",
        },
      });

    tanggal.val(null);
    bulan.val(null);
    tahun.val(null);
  };

  resetForm = async () => {
    const _newState = await _myFunc.resetForm();
    this.__mounted__ && this.setState({ ..._newState });
  };

  deleteTransaction = (id) => {
    this.props.confirmPage.current.openConfirmForm(
      async () => {
        await _myFunc.deleteTransaction(id);
        this.loadData();
      },
      "Hapus Transaksi",
      "Stok produk akan dikembalikan",
    );
  };

  getTransaction = async () => {
    // Update 2025 - Sistem pemblokiran input ganda
    // Blokir jika user melakukan klik berkali-kali
    // pada tombol simpan saat input atau ubah data.
    if (this.transactionWait) return;
    // Aktifkan pemblokiran sementara, jika sudah ter-input
    // makan pemblokiran akan di non-aktifkan kembali.
    this.transactionWait = true;

    // Data keranjang
    let { daftar, total, operasional } = this.state.keranjang;

    // Total + Biaya tambahan
    total += operasional;

    // Hentikan jika keranjang kosong
    if (daftar.length == 0) {
      // Update 2025
      // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
      this.transactionWait = false;

      return;
    }

    // Hentikan jika jumlah uang kosong
    const jumlahUang = $(".input-jumlah-uang").val().replace(/\,/gi, "");
    if (jumlahUang == "") {
      // Update 2025
      // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
      this.transactionWait = false;

      return Notif.send({
        title: "Transaksi Penjualan",
        body: "Mohon isi jumlah uang.",
      });
    }

    // Hentikan jika ada biaya operasional namun detail tidak dijelaskan.
    if (operasional > 0) {
      const keterangan = $("#keranjang .input-keterangan-operasional").val();
      if (keterangan == "" || keterangan.length < 1) {
        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.transactionWait = false;

        return Notif.send({
          title: "Transaksi Penjualan",
          body: "Mohon isi keterangan operasional.",
        });
      }
    }

    // Uang kembalian
    const kembalian = parseInt(jumlahUang) - parseInt(total);
    // Jika uang pas atau kurang
    if (kembalian < 1) {
      // Jika uang kurang
      if (parseInt(jumlahUang) < parseInt(total)) {
        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.transactionWait = false;

        return Notif.send({
          title: "Transaksi Penjualan",
          body: `Jumlah uang kurang Rp${numberFormat(
            parseInt(total) - parseInt(jumlahUang),
          )}.`,
        });
      }
    }

    // Set otomatis (waktu sekarang) ke work-time jika tanggal tidak di set
    // Atau format tanggal salah, atau ada salahsatuu yang tidak di isi.
    let { timestamp } = this.state;
    if (
      timestamp.hari == "" ||
      timestamp.tanggal == "" ||
      timestamp.bulan == "" ||
      timestamp.tahun == ""
    ) {
      const { workTime } = this.props;
      // Masukkan kedalam timestamp
      timestamp = {
        hari: workTime.hari,
        tanggal: workTime.tanggal,
        bulan: workTime.bulanIni,
        tahun: workTime.tahun,
      };
    }

    // Hanya menggunakan 1 angka pada tanggal, 01 to 1
    timestamp.tanggal = parseInt(timestamp.tanggal);
    // Force tahun ke integer, karna setelah update akan berubah menjadi string
    timestamp.tahun = parseInt(timestamp.tahun);

    // Check timestamp (jika salah input)
    if (timestamp.hari == "Invalid Date" || timestamp.bulan == "Invalid Date") {
      // Update 2025
      // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
      this.transactionWait = false;

      return Notif.send({
        title: "Input Tanggal",
        body: "Format tanggal salah",
      });
    }

    // Data transaksi
    let trsData = {
      id: await makeUniqueId(30),
      keterangan: "", // Set sesuai data terkini pada API transaksi
      operasional: {
        keterangan: await upperCase($(".input-keterangan-operasional").val()),
        biaya: operasional,
      },
      style: {
        backgroundColor: "",
      },
      produk: [],
      jumlahUang: parseInt(jumlahUang),
      kembalian: parseInt(kembalian),
      timestamp,
      total: parseInt(total),
    };

    // Reset form (setelah data berhasil di load ke memori)
    await this.resetForm();

    // Set background color
    let getHex = await _myFunc.getRandomColor();
    let getRgba = await _myFunc.hexToRgbA(getHex, "0.3");
    trsData.style.backgroundColor = getRgba;

    for (let x = 0; x < daftar.length; x++) {
      // Produk didalam keranjang
      const _oldProduct = daftar[x];

      // idBarang
      const { id } = _oldProduct;

      // Stok & jumlah beli
      let { stok, beli } = _oldProduct;
      stok = parseInt(stok);
      beli = parseInt(beli);
      stok -= beli; // Stok dikurangi jumlah pembelian

      // Tipe (untuk pengambilan data transaksi)
      let tipeProduk = null;

      // Obat pertanian
      const isObat = await GetOneObat({ id });
      if (isObat) {
        tipeProduk = "Obat";

        // Update stok obat
        await UpdatePersediaan({
          id: tipeProduk,
          data: Object.assign({}, isObat, { stok }),
        });
      }

      // Pupuk
      const isPupuk = await GetOnePupuk({ id });
      if (isPupuk) {
        tipeProduk = "Pupuk";

        // Update stok pupuk
        await UpdatePersediaan({
          id: tipeProduk,
          data: Object.assign({}, isPupuk, { stok }),
        });
      }

      // Pupuk subsidi
      const isPupukSubsidi = await GetOnePupukSubsidi({ id });
      if (isPupukSubsidi) {
        tipeProduk = "PupukSubsidi";

        // Update stok pupuk
        await UpdatePersediaan({
          id: tipeProduk,
          data: Object.assign({}, isPupukSubsidi, { stok }),
        });
      }

      // Push ID & jumlah-beli barang (produk)
      const { namaBarang, hargaPokok, hargaJual } = _oldProduct;
      await trsData.produk.push({
        idBarang: id,
        beli,
        tipeProduk,
        namaBarang,
        hargaPokok,
        hargaJual,
      });
    }

    // Insert transaksi
    await InsertTransaksi(trsData);

    // Reload data
    await this.loadData();

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.transactionWait = false;

    // Print struk
    this.cetakStruk({
      ...trsData,
      produk: daftar, // Produk pada data (untuk transaksi hanya id & beli)
    });
  };

  cetakStruk = (trsData) => {
    this.__mounted__ &&
      this.setState({ strukOpened: true, strukData: trsData });
    setTimeout(() => $(".mesin-kasir .print-struk-btn").click(), 1000);
  };

  removeCetakStruk = () => {
    this.__mounted__ && this.setState({ strukOpened: false, strukData: null });
  };

  render() {
    const { dataToko, workTime } = this.props;
    const { hari, tanggal, bulanIni, tahun } = workTime;

    return (
      <div className="mesin-kasir">
        <div className="judul">
          <h1 style={{ color: this.props.theme }}>{dataToko.nama}</h1>
          <h2 style={{ color: this.props.theme }}>{dataToko.alamat}</h2>
          <p>
            {hari}, {tanggal} {bulanIni} {tahun}
          </p>
        </div>

        {/* input amount */}
        <div
          className={
            this.state.openedInputAmount
              ? "input-amount input-amount-active"
              : "input-amount"
          }
        >
          <form id="input-amount-form" onSubmit={(e) => e.preventDefault()}>
            <input type="hidden" className="id" />
            <h1
              className="form-title"
              style={{ backgroundColor: this.props.theme }}
            >
              <span className="form-title-text"></span>
              <span className="form-title-indicator">
                <FiEdit3 size={15} style={{ marginRight: 3 }} />
                Ubah data
              </span>
            </h1>
            <div className="form-group">
              <label>Jumlah Barang</label>
              <input type="text" className="jumlah" autoComplete="off" />
            </div>
            <div className="form-group form-btns">
              <button
                className="save-btn"
                type="button"
                onClick={this.setInputAmount}
              >
                Simpan
              </button>
              <div className="spacer"></div>
              <button
                className="cancel-btn"
                type="button"
                onClick={this.removeInputAmount}
              >
                Batal
              </button>
            </div>
          </form>
        </div>

        {/* Print struk */}
        <div
          className={
            this.state.strukOpened
              ? "print-struk-container print-struk-container-active"
              : "print-struk-container"
          }
        >
          <div className="print-struk-box">
            {this.state.strukOpened ? (
              <PrintStruk
                dataToko={dataToko}
                strukData={this.state.strukData}
                removeCetakStruk={this.removeCetakStruk}
              />
            ) : null}
          </div>
        </div>

        {/* Keranjang */}
        <Keranjang
          theme={this.props.theme}
          resetForm={this.resetForm}
          setChange={this.setChange}
          timestamp={this.state.timestamp}
          setTimestamp={this.setTimestamp}
          keranjang={this.state.keranjang}
          reformatNumber={this.reformatNumber}
          decreaseAmount={this.decreaseAmount}
          increaseAmount={this.increaseAmount}
          removeFromCart={this.removeFromCart}
          getTransaction={this.getTransaction}
          openOperationalForm={this.openOperationalForm}
          openedOperationalForm={this.state.keranjang.openedOperationalForm}
          openTimestamp={this.openTimestamp}
          openInputAmount={this.openInputAmount}
          openedTimestampForm={this.state.keranjang.openedTimestampForm}
        />

        {/* Produk */}
        <Produk
          theme={this.props.theme}
          pupuk={this.state.pupuk}
          pupukSubsidi={this.state.pupukSubsidi}
          searchData={this.searchData}
          chooseProduct={this.chooseProduct}
          obatPertanian={this.state.obatPertanian}
          _isLoading={this.state._isLoading._produk}
        />

        {/* Transaksi | Pendapatan | Kas */}
        <div className="transaksi-pendapatan-kas">
          {/* Transaksi */}
          <Transaksi
            theme={this.props.theme}
            // searchData={this.searchData}
            workTime={this.props.workTime}
            transaksi={this.state.transaksi}
            deleteTransaction={this.deleteTransaction}
            _isLoading={this.state._isLoading._transaksi}
            // Update 2025
            login={this.props.login}
          />

          {/* Omset */}
          <Pendapatan
            theme={this.props.theme}
            workTime={this.props.workTime}
            pendapatan={this.state.pendapatan}
            _isLoading={this.state._isLoading._pendapatan}
          />

          {/* Margin */}
          <Margin
            theme={this.props.theme}
            workTime={this.props.workTime}
            pendapatan={this.state.pendapatan}
            _isLoading={this.state._isLoading._pendapatan}
          />

          {/* Kas */}
          <Kas
            theme={this.props.theme}
            kas={this.state.kas}
            _isLoading={this.state._isLoading._kas}
          />
        </div>
      </div>
    );
  }
}
