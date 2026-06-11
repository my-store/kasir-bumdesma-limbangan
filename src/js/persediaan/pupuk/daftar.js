import { FiTrash2, FiEdit, FiPlus, FiPrinter, FiSearch } from "react-icons/fi";
import { numberFormat } from "../../api/helper/string";
import { reloadTime } from "../../api/helper/calendar";
import "../../../scss/persediaan/pupuk/daftar.scss";
import ReactToPrint from "react-to-print";
import { BsDot } from "react-icons/bs";
import Loading from "react-loading";
import React, { Component } from "react";
import CariPupuk from "./search";
import Print from "../print";

export default class Daftar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _isPrinting: false,
      _printData: {
        title: "",
        time: "",
        list: [],
      },
    };
  }

  async componentDidMount() {
    const { tanggal, bulan, tahun } = await reloadTime();
    this.setState({
      _printData: {
        title: "PUPUK",
        time: `${tanggal} ${bulan} ${tahun}`,
      },
    });
  }

  openPrintingPage = async () => {
    this.setState({ _isPrinting: true });
  };

  removePrintingPage = () => {
    this.setState({ _isPrinting: false });
  };

  render() {
    const {
      theme,
      data,
      login,
      _isLoading,
      openUpdateForm,
      deleteData,
      openInsertForm,
      openSearchBox,
      searchBox,
      closeSearchBox,
      searchData,
      confirmPage,
    } = this.props;

    const { _isPrinting, _printData } = this.state;

    return (
      <div className="pupuk">
        <p className="title" style={{ backgroundColor: theme }}>
          <span className="label">PUPUK NON-SUBSIDI</span>
          <span className="stok">
            Stok
            <BsDot size={16} color="white" />
            Satuan
          </span>
        </p>
        <div
          className="pupuk-list"
          style={{
            overflowY: data.daftar.length > 0 ? "scroll" : "hidden",
          }}
        >
          {_isLoading ? (
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          ) : data.daftar.length > 0 ? (
            data.daftar.map((d, index) => {
              const stok = parseInt(d.stok);
              return (
                <p
                  key={index}
                  style={
                    stok < 1
                      ? {
                          backgroundColor: "rgba(255, 220, 237, 0.8)",
                          color: "red",
                        }
                      : null
                  }
                  // Update 2025
                  // Jangan diubah !!!
                  title={`
Harga pokok = Rp ${numberFormat(d.hargaPokok)}
Harga jual = Rp ${numberFormat(d.hargaJual)}
`}
                >
                  <span>
                    {login.status && (
                      <span className="action-box">
                        <FiEdit
                          onClick={() =>
                            openUpdateForm({
                              id: "Pupuk",
                              data: { id: d.id },
                            })
                          }
                          size={15.5}
                          style={{ cursor: "pointer" }}
                          title="Ubah"
                        />
                        <FiTrash2
                          onClick={() => {
                            confirmPage.current.openConfirmForm(
                              () => {
                                deleteData({ id: "Pupuk", data: { id: d.id } });
                              },
                              "Hapus Pupuk Nonsubsidi",
                              d.namaBarang
                            );
                          }}
                          size={16}
                          style={{ cursor: "pointer", marginLeft: 4 }}
                          title="Hapus"
                        />
                      </span>
                    )}
                    {d.namaBarang}
                  </span>
                  <span>
                    {numberFormat(stok)}
                    <BsDot size={16} color={theme} />
                    {d.satuan}
                  </span>
                </p>
              );
            })
          ) : (
            <p className="empty-table">Masih kosong</p>
          )}
        </div>
        <div className="aksi">
          <div className="btns">
            <div
              className="button"
              onClick={() => {
                openInsertForm({ id: "Pupuk" });
                setTimeout(() => {
                  $("#insert-pupuk-form .nama-barang").focus();
                }, 1000);
              }}
            >
              <FiPlus size={16} />
              <p>Tambahkan</p>
            </div>
            <div className="spacer"></div>
            <div
              className="button"
              onClick={() =>
                openSearchBox({
                  id: "Pupuk",
                  state: { pupuk: true },
                })
              }
            >
              <FiSearch size={16} />
              <p>Cari</p>
            </div>

            <div className="spacer"></div>

            <ReactToPrint
              trigger={() => {
                return (
                  <div className="button">
                    <FiPrinter size={16} />
                    <p>Cetak</p>
                  </div>
                );
              }}
              content={() => this.componentRef}
              onBeforeGetContent={this.openPrintingPage}
              onAfterPrint={this.removePrintingPage}
            />
          </div>

          {/* Serachbox | Pupuk */}
          <div
            className={
              searchBox.pupuk
                ? "search-pupuk-container search-pupuk-container-active"
                : "search-pupuk-container"
            }
          >
            {searchBox.pupuk ? (
              <CariPupuk
                search={(key) => searchData(key, "Pupuk")}
                close={() =>
                  closeSearchBox({
                    id: "Pupuk",
                    state: { pupuk: false },
                  })
                }
              />
            ) : null}
          </div>
        </div>

        {/* Print */}
        <div
          className={
            _isPrinting
              ? "print-container print-container-active"
              : "print-container"
          }
        >
          <div className="print-box">
            <Print
              ref={(el) => (this.componentRef = el)}
              _printData={{
                ..._printData,
                list: data.daftar,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
