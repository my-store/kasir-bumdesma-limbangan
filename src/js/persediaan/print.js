import { numberFormat } from "../api/helper/string";
import React, { PureComponent } from "react";
import "../../scss/persediaan/print.scss";

const Head = ({ data: { title, time }, page }) => {
  return (
    <div className="persediaan-print-head">
      <h1 className="persediaan-print-head-title">
        LAPORAN STOK BARANG ({title})
      </h1>
      <p className="persediaan-print-head-date">Per {time}</p>
      <p className="persediaan-print-head-page">Halaman {page}</p>
    </div>
  );
};

const paginator = (items, current_page, per_page_items) => {
  let page = current_page || 1,
    per_page = per_page_items || 10,
    offset = (page - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page_items),
    total_pages = Math.ceil(items.length / per_page);
  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems,
  };
};

export default class Print extends PureComponent {
  render() {
    let products = this.props._printData.list;
    let _paginatedData = [];

    if (products.length > 0) {
      // Add index on products (item)
      for (let y = 0; y < products.length; y++) {
        products[y].index = y + 1;
      }
      const { total_pages } = paginator(products, 1, 43);
      for (let x = 0; x < total_pages; x++) {
        const { data, page } = paginator(products, x + 1, 43);
        _paginatedData.push({ page, data });
      }
    }

    return (
      <div>
        {_paginatedData.length > 0 ? (
          <div>
            {_paginatedData.map(({ data, page }, _indexPage) => {
              return (
                <div key={_indexPage} className="persediaan-print">
                  {/* Head */}
                  <Head data={this.props._printData} page={page} />
                  {/* Body */}
                  <div className="persediaan-print-body">
                    <div className="print-table">
                      <div className="print-table-tr">
                        <div className="print-table-tr-th">
                          <h1 className="print-table-tr-no">NO</h1>
                        </div>
                        <div className="print-table-tr-th">
                          <h1 className="print-table-tr-nama">NAMA</h1>
                        </div>
                        <div className="print-table-tr-th">
                          <h1 className="print-table-tr-harga">HPP</h1>
                        </div>
                        <div className="print-table-tr-th">
                          <h1 className="print-table-tr-stok">ESTIMASI</h1>
                        </div>
                        <div className="print-table-tr-th">
                          <h1 className="print-table-tr-opname">HASIL</h1>
                        </div>
                        <div className="print-table-tr-th">
                          <h1 className="print-table-tr-selisih">SELISIH</h1>
                        </div>
                      </div>
                      {data.map((_data, _indexData) => {
                        const { namaBarang, stok, index, hargaPokok } = _data;
                        return (
                          <div className="print-table-tr" key={_indexData}>
                            <div className="print-table-tr-td">
                              <p className="print-table-tr-no">
                                {numberFormat(index)}
                              </p>
                            </div>
                            <div className="print-table-tr-td">
                              <p className="print-table-tr-nama">
                                {namaBarang}
                              </p>
                            </div>
                            <div className="print-table-tr-td">
                              <p className="print-table-tr-harga">
                                <span>{numberFormat(hargaPokok)}</span>
                              </p>
                            </div>
                            <div className="print-table-tr-td">
                              <p className="print-table-tr-stok">
                                <span>{numberFormat(stok)}</span>
                              </p>
                            </div>
                            <div className="print-table-tr-td">
                              <p className="print-table-tr-opname">
                                <span style={{ opacity: 0 }}>-</span>
                              </p>
                            </div>
                            <div className="print-table-tr-td">
                              <p className="print-table-tr-selisih">
                                <span style={{ opacity: 0 }}>-</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}
