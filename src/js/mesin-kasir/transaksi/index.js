import { indexOf, reloadTime } from "../../api/helper/calendar";
import "../../../scss/mesin-kasir/transaksi/index.scss";
import { numberFormat } from "../../api/helper/string";
import { FiTrash2, FiPrinter } from "react-icons/fi";
import ReactToPrint from "react-to-print";
import React, { Component } from "react";
import Loading from "react-loading";
import Print from "./print";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: {
        hari: "",
        tanggal: "",
        bulan: "",
        tahun: "",
      },

      // Print
      _isPrinting: false,
      _printData: {
        title: "",
        time: "",
        list: [],
      },
    };
  }

  async componentDidMount() {
    const timestamp = await reloadTime();
    this.setState({ timestamp });

    const { tanggal, bulanIni, tahun } = this.props.workTime;
    this.setState({
      _printData: {
        title: "LAPORAN HARIAN TOKO",
        time: `${tanggal} ${bulanIni} ${tahun}`,
      },
    });
  }

  openPrintingPage = async () => {
    this.setState({ _isPrinting: true });
  };

  removePrintingPage = () => {
    this.setState({ _isPrinting: false });
  };

  getTotal = (produk, operasional) => {
    let total = 0;
    for (let x = 0; x < produk.length; x++) {
      total += parseInt(produk[x].hargaJual) * parseInt(produk[x].beli);
    }
    return (
      <p className="tambahan-dan-total">
        <span className="tambahan">
          {parseInt(operasional.biaya) > 0
            ? operasional.keterangan.toUpperCase() +
            ": Rp" +
            numberFormat(operasional.biaya)
            : null}
        </span>
        <span className="total">
          Rp {numberFormat(total + parseInt(operasional.biaya))}
        </span>
      </p>
    );
  };

  render() {
    const { workTime, login, transaksi } = this.props;
    const indexBulan = indexOf(workTime.bulanIni) + 1; // Index dimulai dari 0

    // Data transaksi
    const _trsData = transaksi.daftar;

    // 19-06-2026
    const jumlahTransaksi = transaksi.total > 0
      ? numberFormat(transaksi.total) + "x"
      : "-"

    return (
      <div className="transaksi">
        <h1 style={{ backgroundColor: this.props.theme }}>
          <span>
            <span>PENJUALAN</span>
            <span
              style={{ fontWeight: "normal", paddingLeft: 5, fontSize: 13 }}
            >
              {workTime.tahun == this.state.timestamp.tahun
                ? workTime.bulanIni == this.state.timestamp.bulan
                  ? workTime.tanggal == this.state.timestamp.tanggal
                    ? "Hari ini"
                    : workTime.tanggal + "/" + indexBulan + "/" + workTime.tahun
                  : workTime.tanggal + "/" + indexBulan + "/" + workTime.tahun
                : workTime.tanggal + "/" + indexBulan + "/" + workTime.tahun}
            </span>
          </span>
          <span style={{ fontWeight: "normal", fontSize: 13 }}>
            {jumlahTransaksi}
          </span>
        </h1>
        <div className="list-header">
          <div className="keterangan">
            <p>Keterangan</p>
          </div>
          <div className="timestamp">
            <p>Waktu</p>
          </div>
          <div className="qty">
            <p>Qty</p>
          </div>
          <div className="jumlah">
            <p>Total</p>
          </div>
        </div>
        <div className="list">
          {this.props._isLoading ? (
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          ) : _trsData.length > 0 ? (
            _trsData.map((data, index) => {
              const { operasional, produk, timestamp } = data;
              const { backgroundColor } = data.style;
              const _ops = parseInt(operasional.biaya) / produk.length;
              return (
                <div key={index} className="list-item-container">
                  <div className="list-item" style={{ backgroundColor }}>
                    {login.status && (
                      <FiTrash2
                        onClick={() => this.props.deleteTransaction(data.id)}
                        size={16}
                        style={{ cursor: "pointer", marginLeft: 5 }}
                        title="Hapus"
                      />
                    )}
                    <p
                      className="list-item-head"
                      title={
                        produk.length < 2
                          ? parseInt(operasional.biaya) > 0
                            ? operasional.keterangan +
                            " Rp" +
                            numberFormat(operasional.biaya)
                            : null
                          : null
                      }
                    >
                      <span className="keterangan">
                        {produk.map((_d, index) => {
                          return (
                            <span
                              // Update 2025
                              title={`
${_d.namaBarang.length > 27 ? _d.namaBarang : ""}
Harga Jual = Rp ${numberFormat(_d.hargaJual)}
Harga Pokok = Rp ${numberFormat(_d.hargaPokok)}
`}
                              key={index}
                            >
                              {_d.namaBarang.substring(0, 27)}
                            </span>
                          );
                        })}
                      </span>
                      <span className="timestamp">
                        {timestamp.tanggal}/{indexOf(timestamp.bulan) + 1}/
                        {timestamp.tahun}
                      </span>
                      <span className="qty">
                        {produk.map((_d, index) => {
                          return (
                            <span
                              key={index}
                              title={
                                parseInt(_d.beli) > 1
                                  ? "Rp" + numberFormat(_d.hargaJual)
                                  : null
                              }
                            >
                              {numberFormat(_d.beli)}
                            </span>
                          );
                        })}
                      </span>
                      <span className="jumlah">
                        {produk.map((_d, index) => {
                          let total = 0;

                          // Total dari hargJual * jumlah-pembelian
                          total += parseInt(_d.beli) * parseInt(_d.hargaJual);

                          // Tambahkan _ops (biaya tambahan, jika ada) | produk < 2 (hanya satu)
                          if (produk.length < 2) {
                            total += _ops;
                          }

                          return (
                            <span key={index}>Rp {numberFormat(total)}</span>
                          );
                        })}
                      </span>
                    </p>
                  </div>

                  {/* Total per transaksi (jika lebih dari 1 produk) */}
                  {produk.length > 1
                    ? this.getTotal(produk, operasional)
                    : null}

                  {/* List spacer */}
                  {index < _trsData.length - 1 ? (
                    <div className="spacer"></div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <p className="empty-data">Masih Kosong</p>
          )}
        </div>
        <div className="transaction-btns">
          <ReactToPrint
            trigger={() => {
              return (
                <button type="button">
                  <FiPrinter size={15} style={{ marginRight: 3 }} />
                  Cetak
                </button>
              );
            }}
            content={() => this.componentRef}
            onAfterPrint={this.removePrintingPage}
            onBeforeGetContent={this.openPrintingPage}
          />
        </div>

        {/* Print */}
        <div
          className={
            this.state._isPrinting
              ? "print-container print-container-active"
              : "print-container"
          }
        >
          <div className="print-box">
            <Print
              ref={(el) => (this.componentRef = el)}
              workTime={this.props.workTime}
              _printData={{
                ...this.state._printData,
                list: _trsData,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
