import { GetWhereTransaksi } from "./transaksi";
import { GetOperasional } from "./operasional";
import { numberFormat } from "./helper/string";
import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetLaporan = async (workTime) => {
  // Data chart
  const chart = {
    months: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    series: [
      {
        name: "Omset",
        data: [],
      },
      {
        name: "Margin",
        data: [],
      },
      {
        name: "Biaya",
        data: [],
      },
    ],
  };

  // Update 2025
  let DATA = { transaksi: [], biaya: [] };

  // Update 2025, filter transaksi
  const getTransaksi = await GetWhereTransaksi({
    filter: {
      timestamp: {
        tahun: { $lte: workTime.tahun },
      },
    },
  });

  for (let data of getTransaksi) {
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini, tapi tanggal lebih baru dari worktime
        if (data.timestamp.bulan == workTime.bulanIni) {
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            continue;
          }
        }
      }
    }

    // Push data
    await DATA.transaksi.push(data);
  }

  // Update 2025
  DATA.biaya = await GetOperasional(workTime);
  DATA.biaya = DATA.biaya.data;

  /*
  |
  |   CHART
  |   Fixed bugs:
  |   10-06-2026 2026
  |   Yang ada didalam chart, harus bulan-bulan di tahun ini.
  */
  for (let x = 0; x < chart.months.length; x++) {
    /*
    |   Pendapatan & Margin
    |   -------------------------------------------
    |   Fixed bugs:
    |   10-06-2026 2026 - add tahun checking in line 94
    */
    const _getTrs = await DATA.transaksi.filter(
      ({ timestamp: { bulan, tahun } }) =>
        bulan == chart.months[x] && tahun == workTime.tahun,
    );

    let omsetSebulan = null;
    let marginSebulan = null;

    if (_getTrs.length > 0) {
      omsetSebulan = 0;
      marginSebulan = 0;
      for (let y = 0; y < _getTrs.length; y++) {
        const { produk, operasional } = _getTrs[y];

        // Biaya tambahan dibagi jumlah produk dalam 1 transaksi
        const _ops = operasional.biaya / produk.length;

        for (let z = 0; z < produk.length; z++) {
          const { hargaJual, hargaPokok, beli } = produk[z];

          // Omset
          omsetSebulan += hargaJual * beli;

          // Biaya tambahan untuk omset
          omsetSebulan += _ops;

          // Biaya tambahan untuk margin (keuntungan = HPP - HJ * jumlah-pembelian)
          for (let i = 0; i < beli; i++) {
            marginSebulan += hargaJual - hargaPokok;
          }
          marginSebulan += _ops;
        }
      }
    } else {
      omsetSebulan = null;
      marginSebulan = null;
    }

    // Push omset perbulan
    await chart.series[0].data.push(omsetSebulan);

    // Push margin perbulan
    await chart.series[1].data.push(marginSebulan);

    /*
    |   Biaya operasional bulanan
    |   -------------------------------------------
    |   Fixed bugs:
    |   10-06-2026 2026 - add tahun checking in line 144
    */
    const _getBiaya = await DATA.biaya.filter(
      ({ timestamp: { bulan, tahun } }) =>
        bulan == chart.months[x] && tahun == workTime.tahun,
    );

    let biayaSebulan = null;

    if (_getBiaya.length > 0) {
      biayaSebulan = 0;
      for (let y = 0; y < _getBiaya.length; y++) {
        biayaSebulan += _getBiaya[y].jumlah;
      }
    } else {
      biayaSebulan = null;
    }

    // Push biaya perbulan
    await chart.series[2].data.push(biayaSebulan);
  }

  /*
  |
  |   TABLE
  |
  |
  */
  const { pendapatan, biaya, total } = await getTabledata(workTime, DATA);

  // Get omset
  const _omset = chart.series[0].data;
  let totalOmset = 0; // Placeholder
  for (let x = 0; x < _omset.length; x++) {
    if (_omset[x] != null) {
      totalOmset += _omset[x];
    }
  }

  // Get margin
  const _margin = chart.series[1].data;
  let totalMargin = 0; // Placeholder
  for (let x = 0; x < _margin.length; x++) {
    if (_margin[x] != null) {
      totalMargin += _margin[x];
    }
  }

  // Get biaya
  const _biaya = chart.series[2].data;
  let totalBiaya = 0; // Placeholder
  for (let x = 0; x < _biaya.length; x++) {
    if (_biaya[x] != null) {
      totalBiaya += _biaya[x];
    }
  }

  // Response
  return {
    totalMargin,
    pendapatan,
    totalOmset,
    totalBiaya,
    biaya,
    total,
    chart,
  };
};

async function getTabledata(workTime, DATA) {
  let pendapatan = {
    bulanLalu: {
      obatPertanian: 0,
      pupuk: 0,
      pupukSubsidi: 0,
    },
    bulanIni: {
      obatPertanian: 0,
      pupuk: 0,
      pupukSubsidi: 0,
    },
    bulanDepan: {
      obatPertanian: 0,
      pupuk: 0,
      pupukSubsidi: 0,
    },
  };
  let biaya = {
    bulanLalu: {
      honor: 0,
      transport: 0,
      lainnya: 0,
    },
    bulanIni: {
      honor: 0,
      transport: 0,
      lainnya: 0,
    },
    bulanDepan: {
      honor: 0,
      transport: 0,
      lainnya: 0,
    },
  };
  let total = {
    bulanLalu: 0,
    bulanIni: 0,
    bulanDepan: 0,
  };

  const { bulanIni } = workTime; // Worktime

  /*
  |   Pendapatan operasional bulanan
  */
  const _getPdt = DATA.transaksi;

  for (let x = 0; x < _getPdt.length; x++) {
    let _trs = _getPdt[x];
    const { produk, operasional } = _trs;

    // Biaya tambahan dibagi jumlah produk dalam 1 transaksi
    const _ops = operasional.biaya / produk.length;

    for (let y = 0; y < produk.length; y++) {
      const { beli, hargaJual, hargaPokok, tipeProduk } = produk[y];

      let _totalPertransaksi = 0; // Default as placeholder

      // s/d Bulan lalu
      if (indexOf(_trs.timestamp.bulan) < indexOf(bulanIni)) {
        // Obat
        if (tipeProduk == "Obat") {
          // Margin per transaksi
          _totalPertransaksi = hargaJual - hargaPokok;
          // Kalikan jumlah pembelian
          _totalPertransaksi *= beli;
          // Tambahkan biaya tambahan
          _totalPertransaksi += _ops;

          // Increase pendapatan obat s/d bulan lalu
          pendapatan.bulanLalu.obatPertanian += _totalPertransaksi;

          // Increase pendapatan obat s/d bulan ini
          pendapatan.bulanDepan.obatPertanian += _totalPertransaksi;
        }
        // Pupuk
        else if (tipeProduk == "Pupuk") {
          // Margin per transaksi
          _totalPertransaksi = hargaJual - hargaPokok;
          // Kalikan jumlah pembelian
          _totalPertransaksi *= beli;
          // Tambahkan biaya tambahan
          _totalPertransaksi += _ops;

          // Increase pendapatan pupuk s/d bulan lalu
          pendapatan.bulanLalu.pupuk += _totalPertransaksi;

          // Increase pendapatan pupuk s/d bulan ini
          pendapatan.bulanDepan.pupuk += _totalPertransaksi;
        }
        // Pupuk Subsidi
        else if (tipeProduk == "PupukSubsidi") {
          // Margin per transaksi
          _totalPertransaksi = hargaJual - hargaPokok;
          // Kalikan jumlah pembelian
          _totalPertransaksi *= beli;
          // Tambahkan biaya tambahan
          _totalPertransaksi += _ops;

          // Increase pendapatan pupuk subsidi s/d bulan lalu
          pendapatan.bulanLalu.pupukSubsidi += _totalPertransaksi;

          // Increase pendapatan pupuk subsidi s/d bulan ini
          pendapatan.bulanDepan.pupukSubsidi += _totalPertransaksi;
        }

        // Increase TOTAL pendapatan bulan ini
        total.bulanLalu += _totalPertransaksi;

        // Increase TOTAL pendapatan bulan ini
        total.bulanDepan += _totalPertransaksi;
      }

      // Bulan ini
      // Fixed bugs:
      // 10-06-2026 - Add tahun checking in line 329
      else if (
        _trs.timestamp.bulan == bulanIni &&
        _trs.timestamp.tahun == workTime.tahun
      ) {
        // Obat
        if (tipeProduk == "Obat") {
          // Margin per transaksi
          _totalPertransaksi = hargaJual - hargaPokok;
          // Kalikan jumlah pembelian
          _totalPertransaksi *= beli;
          // Tambahkan biaya tambahan
          _totalPertransaksi += _ops;

          // Increase pendapatan obat bulan ini
          pendapatan.bulanIni.obatPertanian += _totalPertransaksi;

          // Increase pendapatan obat s/d bulan ini
          pendapatan.bulanDepan.obatPertanian += _totalPertransaksi;
        }
        // Pupuk
        else if (tipeProduk == "Pupuk") {
          // Margin per transaksi
          _totalPertransaksi = hargaJual - hargaPokok;
          // Kalikan jumlah pembelian
          _totalPertransaksi *= beli;
          // Tambahkan biaya tambahan
          _totalPertransaksi += _ops;

          // Increase pendapatan pupuk bulan ini
          pendapatan.bulanIni.pupuk += _totalPertransaksi;

          // Increase pendapatan pupuk s/d bulan ini
          pendapatan.bulanDepan.pupuk += _totalPertransaksi;
        }
        // Pupuk Subsidi
        else if (tipeProduk == "PupukSubsidi") {
          // Margin per transaksi
          _totalPertransaksi = hargaJual - hargaPokok;
          // Kalikan jumlah pembelian
          _totalPertransaksi *= beli;
          // Tambahkan biaya tambahan
          _totalPertransaksi += _ops;

          // Increase pendapatan pupuk subsidi bulan ini
          pendapatan.bulanIni.pupukSubsidi += _totalPertransaksi;

          // Increase pendapatan pupuk subsidi s/d bulan ini
          pendapatan.bulanDepan.pupukSubsidi += _totalPertransaksi;
        }

        // Increase TOTAL pendapatan bulan ini
        total.bulanIni += _totalPertransaksi;

        // Increase TOTAL pendapatan bulan ini
        total.bulanDepan += _totalPertransaksi;
      }
    }
  }

  /*
  |   Biaya operasional bulanan
  */
  const _getBiaya = DATA.biaya;

  for (let x = 0; x < _getBiaya.length; x++) {
    const _bo = _getBiaya[x];
    const { tipe } = _bo;

    // s/d Bulan lalu
    if (indexOf(_bo.timestamp.bulan) < indexOf(bulanIni)) {
      if (tipe == "Honor") {
        biaya.bulanLalu.honor += parseInt(_bo.jumlah);

        // Increase honor s/d bulan ini
        biaya.bulanDepan.honor += parseInt(_bo.jumlah);
      }
      if (tipe == "Transport") {
        biaya.bulanLalu.transport += parseInt(_bo.jumlah);

        // Increase transport s/d bulan ini
        biaya.bulanDepan.transport += parseInt(_bo.jumlah);
      }
      if (tipe == "Lainnya") {
        biaya.bulanLalu.lainnya += parseInt(_bo.jumlah);

        // Increase lainnya s/d bulan ini
        biaya.bulanDepan.lainnya += parseInt(_bo.jumlah);
      }

      // Decrease total s/d bulan lalu
      total.bulanLalu -= parseInt(_bo.jumlah);

      // Decrease total s/d bulan ini
      total.bulanDepan -= parseInt(_bo.jumlah);
    }

    // Bulan ini
    // Fixed bugs:
    // 10-06-2026 - Add tahun checking in line 428
    else if (
      _bo.timestamp.bulan == bulanIni &&
      _bo.timestamp.tahun == workTime.tahun
    ) {
      if (tipe == "Honor") {
        biaya.bulanIni.honor += parseInt(_bo.jumlah);

        // Increase honor s/d bulan ini
        biaya.bulanDepan.honor += parseInt(_bo.jumlah);
      }
      if (tipe == "Transport") {
        biaya.bulanIni.transport += parseInt(_bo.jumlah);

        // Increase transport s/d bulan ini
        biaya.bulanDepan.transport += parseInt(_bo.jumlah);
      }
      if (tipe == "Lainnya") {
        biaya.bulanIni.lainnya += parseInt(_bo.jumlah);

        // Increase lainnya s/d bulan ini
        biaya.bulanDepan.lainnya += parseInt(_bo.jumlah);
      }

      // Decrease total bulan ini
      total.bulanIni -= parseInt(_bo.jumlah);

      // Decrease total s/d bulan ini
      total.bulanDepan -= parseInt(_bo.jumlah);
    }
  }

  // Hasil setelah pembulatan
  return { pendapatan, biaya, total };
}

// Ini dipanggil oleh render (tidak boleh async)
export const reformatNumber = (_getNumber) => {
  let _newNum = numberFormat(_getNumber);
  let _matchedComma = 0;

  if (_newNum.match(/\,/gi)) {
    _matchedComma = _newNum.match(/\,/gi).length;
  }

  // Juta | Milyar | Trilyun
  if (_matchedComma >= 2) {
    // Mendapatakan koma (1,2 M) atau (1,02 M) dst.
    _newNum.split(/\,/gi).map((_n, x) => {
      let _nxt = _n;

      if (x == 0) {
        _newNum = _nxt;
      }

      if (x == 1) {
        if (parseInt(_nxt[0]) > 0) {
          _newNum += "," + _nxt[0];
        } else if (parseInt(_nxt[1]) > 0) {
          _newNum += ",0" + _nxt[1];
        }

        // Milyar | Juta
        if (_matchedComma < 4) {
          // Milyar
          if (_matchedComma >= 3) {
            _newNum += "M";
          }

          // Juta
          else {
            _newNum += "Jt";
          }
        }

        // Trilyun
        else {
          _newNum += "T";
        }
      }
    });
  }

  return _newNum;
};
