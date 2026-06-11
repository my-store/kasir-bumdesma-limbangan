import { numberFormat } from "../api/helper/string";
import { FiTrash2 } from "react-icons/fi";
import React, { Component } from "react";
import Loading from "react-loading";

export default class Table extends Component {
  render() {
    const { _isLoading, persediaan, removeNote, login, confirmPage } =
      this.props;
    const data = persediaan.semua.daftar;

    return (
      <div
        id="nota-table"
        className="td"
        style={{
          overflowY: data.length > 0 ? "scroll" : "hidden",
        }}
      >
        {_isLoading ? (
          <div className="loading">
            <Loading width={50} height={50} type="bubbles" color="grey" />
          </div>
        ) : data.length > 0 ? (
          data.map((d, index) => {
            return (
              <div className="tr-td" key={index}>
                <p className="no">{index + 1}</p>
                <p className="keterangan">{d.keterangan}</p>
                <p className="tanggal">
                  {d.timestamp.hari +
                    ", " +
                    d.timestamp.tanggal +
                    " " +
                    d.timestamp.bulan +
                    " " +
                    d.timestamp.tahun}
                </p>
                <p className="qty">{numberFormat(d.qty)}</p>
                <p className="satuan">{d.satuan}</p>
                <p className="harga-pokok">Rp{numberFormat(d.hargaPokok)}</p>
                <p className="harga-perolehan">
                  Rp{numberFormat(d.hargaPerolehan)}
                </p>
                {login.status && (
                  <p className="aksi">
                    <FiTrash2
                      onClick={() => {
                        confirmPage.current.openConfirmForm(
                          () => {
                            removeNote(d.id);
                          },
                          "Hapus Nota Pembelian",
                          d.keterangan
                        );
                      }}
                      size={16}
                      style={{ cursor: "pointer" }}
                      title="Hapus"
                    />
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p className="empty-table">
            Belum ada pembelian/ penambahan stok barang.
          </p>
        )}
      </div>
    );
  }
}
