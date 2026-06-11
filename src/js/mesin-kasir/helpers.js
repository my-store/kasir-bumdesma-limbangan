import { DeleteTransaksi, GetoneTransaksi } from "../api/transaksi";
import { numberFormat } from "../api/helper/string";
import {
  UpdatePersediaan,
  GetOnePupuk,
  SearchPupuk,
  SearchObat,
  GetOneObat,
  SearchPupukSubsidi,
  GetOnePupukSubsidi,
  GetPupukSubsidi,
  GetPupukNonSubsidi,
  GetObatPertanian,
} from "../api/persediaan";

// Random color (HEX) maker
export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let x = 0; x < 6; x++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Hex to RGBA converter
export const hexToRgbA = (hex, alpha) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      alpha +
      ")"
    );
  }
  throw new Error("Bad Hex");
};

// Mesin pencari pupuk subsidi
export const cariPupukSubsidi = async (val, workTime) => {
  let pupukSubsidi = [];
  if (val.length > 0) {
    const getPupukSubsidi = await SearchPupukSubsidi(val);
    pupukSubsidi = getPupukSubsidi;
  }
  // Search input is empty
  else {
    // Reload data
    const _getPupukSubsidi = await GetPupukSubsidi(workTime);
    pupukSubsidi = _getPupukSubsidi.data;
  }
  return pupukSubsidi;
};

// Mesin pencari pupuk nonsubsidi
export const cariPupuk = async (val, workTime) => {
  let pupuk = [];
  if (val.length > 0) {
    const getPupuk = await SearchPupuk(val);
    pupuk = getPupuk;
  }
  // Search input is empty
  else {
    // Reload data
    const _getPupuk = await GetPupukNonSubsidi(workTime);
    pupuk = _getPupuk.data;
  }
  return pupuk;
};

// Mesin pencari obat
export const cariObat = async (val, workTime) => {
  let obatPertanian = [];
  if (val.length > 0) {
    const getObatPertanian = await SearchObat(val);
    obatPertanian = getObatPertanian;
  }
  // Search input is empty
  else {
    // Reload data
    const _getObatPertanian = await GetObatPertanian(workTime);
    obatPertanian = _getObatPertanian.data;
  }
  return obatPertanian;
};

// Masukkan ke keranjang
export const pilihProduk = async ({ id, data, keranjang }) => {
  let getData = null;
  if (id == "Obat") {
    getData = await GetOneObat({ id: data });
  } else if (id == "Pupuk") {
    getData = await GetOnePupuk({ id: data });
  } else if (id == "PupukSubsidi") {
    getData = await GetOnePupukSubsidi({ id: data });
  }

  // Hentikan jika stok kosong
  if (parseInt(getData.stok) < 1) {
    return { keranjang: null };
  }

  // Set nilai beli (1 sebagai default)
  getData.beli = 1;

  // Filtering/ update untuk produk yang sama
  if (keranjang.daftar.length > 0) {
    const filterTest = await keranjang.daftar.filter((x) => x.id == data);
    if (filterTest.length > 0) {
      return; // Hentikan jika produk telah masuk keranjang
    }
  }

  // Product list
  const daftar = keranjang.daftar.concat(getData).reverse();

  // Tagihan
  let { total } = keranjang;
  total += parseInt(getData.hargaJual);

  // Reset jumlah uang dan kembalian
  $(".keranjang .input-jumlah-uang").val(null);
  const kembalian = null;

  // Focus into "jumlah-uang"
  setTimeout(() => $(".keranjang .input-jumlah-uang").focus(), 300);

  // response data
  return {
    keranjang: {
      ...keranjang,
      kembalian,
      total,
      daftar,
    },
  };
};

export const tambahPembelian = (id, keranjang) => {
  let daftar = [];

  // Tagihan
  let { total } = keranjang;

  for (let x = 0; x < keranjang.daftar.length; x++) {
    let data = keranjang.daftar[x];
    if (data.id == id) {
      // Hitung stok
      let stok = parseInt(data.stok);

      // Jumlah pembelian
      const beli = parseInt(data.beli);

      // Jika stok > 0 (masih ada)
      if (stok > 0) {
        if (beli < stok) {
          data.beli += 1;

          // Tagihan
          total += parseInt(data.hargaJual);
        }
      }
    }
    daftar.push(data);
  }

  // Reset jumlah uang dan kembalian
  $(".keranjang .input-jumlah-uang").val(null);
  const kembalian = null;

  // response data
  return {
    keranjang: {
      ...keranjang,
      kembalian,
      daftar,
      total,
    },
  };
};

export const kurangiPembelian = (id, keranjang) => {
  let daftar = [];
  let { total } = keranjang; // Tagihan
  for (let x = 0; x < keranjang.daftar.length; x++) {
    let data = keranjang.daftar[x];
    if (data.id == id) {
      if (parseInt(data.beli) > 1) {
        data.beli -= 1;

        // Tagihan
        total -= parseInt(data.hargaJual);
      }
    }
    daftar.push(data);
  }

  // Reset jumlah uang dan kembalian
  $(".keranjang .input-jumlah-uang").val(null);
  const kembalian = null;

  // Response data
  return {
    keranjang: {
      ...keranjang,
      kembalian,
      daftar,
      total,
    },
  };
};

export const setManualPembelian = (keranjang) => {
  let daftar = [];

  // Form data
  const id = $("#input-amount-form .id").val();
  const jumlah = $("#input-amount-form .jumlah")
    .val()
    .replace(/\s/gi, "")
    .replace(/\,/gi, "");

  // Tagihan
  let { total } = keranjang;

  for (let x = 0; x < keranjang.daftar.length; x++) {
    let data = keranjang.daftar[x];
    if (data.id == id) {
      // Kurangi total dari jumlah pembelian awal
      total -= parseInt(data.hargaJual) * parseInt(data.beli);

      // Set jumlah pembelian baru
      data.beli = parseInt(jumlah);

      // Total untuk produk ini (terpilih)
      const _totalPrdIni = parseInt(data.hargaJual) * parseInt(jumlah);

      // Tambah total berdasarkan julah pembelian baru (dari produk ini)
      total += _totalPrdIni;
    }
    daftar.push(data);
  }

  // Reset jumlah uang dan kembalian
  $(".keranjang .input-jumlah-uang").val(null);
  const kembalian = null;

  // response data
  return {
    openedInputAmount: false,
    keranjang: {
      ...keranjang,
      kembalian,
      daftar,
      total,
    },
  };
};

export const hapusDariKeranjang = (id, keranjang) => {
  let daftar = [];
  let { total } = keranjang; // Tagihan (saat ini)
  for (let x = 0; x < keranjang.daftar.length; x++) {
    let data = keranjang.daftar[x];
    if (data.id == id) {
      // Tagihan - (hargaJual * jumlah pembelian)
      total -= parseInt(data.hargaJual) * parseInt(data.beli);
    } else {
      daftar.push(data);
    }
  }

  // Reset jumlah uang dan kembalian
  $(".keranjang .input-jumlah-uang").val(null);
  const kembalian = null;

  // Response data
  return {
    keranjang: {
      ...keranjang,
      kembalian,
      daftar,
      total,
    },
  };
};

// Set uang kembalian
export const uangKembalian = (getVal, keranjang) => {
  const val = getVal;
  let { total } = keranjang;

  // Jika ada biaya operasional, gabungkan dengan total belanja
  if (keranjang.operasional > 0) {
    total += keranjang.operasional;
  }

  // Set uang kembalian
  let kembalian = parseInt(val) - total;

  if (kembalian < 1 || val == "") {
    // Menghindari jika hasil kurang dari 1 & input kosong (empty string)
    kembalian = 0;
  }

  // Response data
  return {
    keranjang: {
      ...keranjang,
      kembalian,
    },
  };
};

export const reformatNumber = async (getVal, target) => {
  // Hapus koma
  let val = await getVal.replace(/\,/gi, "");

  // Beri koma pada input jumlah uang (jika nilai tidak null)
  $(".keranjang ." + target).val(
    val.length > 0 ? numberFormat(parseInt(val)) : ""
  );
};

export const openOperationalForm = async (keranjang) => {
  const checked = $(".keranjang .check-biaya-operasional").prop("checked");
  if (checked) {
    setTimeout(
      () => $(".keranjang .input-keterangan-operasional").focus(),
      300
    );
    // Open operasional box
    return {
      keranjang: { ...keranjang, openedOperationalForm: true },
    };
  } else {
    // Reset biaya operasional beserta keterangannya
    await $(".keranjang .input-biaya-operasional").val("");
    await $(".keranjang .input-keterangan-operasional").val("");

    // Remove operasional box
    return {
      keranjang: { ...keranjang, operasional: 0, openedOperationalForm: false },
    };
  }
};

export const openTimestamp = (keranjang) => {
  const checked = $("#keranjang .check-timestamp").prop("checked");
  if (checked) {
    setTimeout(() => {
      $(".keranjang .timestamp-input input[placeholder='Tanggal']").focus();
    }, 300);
    return {
      keranjang: { ...keranjang, openedTimestampForm: true },
    };
  } else {
    return {
      keranjang: { ...keranjang, openedTimestampForm: false },
    };
  }
};

export const listenTimestamp = (callback) => {
  const tanggal = $(".timestamp-input input[placeholder='Tanggal']");
  const bulan = $(".timestamp-input input[placeholder='Bulan']");
  const tahun = $(".timestamp-input input[placeholder='Tahun']");

  if (
    tanggal.val().length > 0 &&
    bulan.val().length > 0 &&
    tahun.val().length > 3
  ) {
    // Set timestamp state
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

    callback(timestamp);
  }
};

export const resetForm = () => {
  $(".keranjang")[0].reset(); // Reset seluruh input

  // Reset search product (obat)
  $(".mesin-kasir .obatPertanian .search-product").val(null);

  // Response data
  return {
    timestamp: { hari: "", tanggal: "", bulan: "", tahun: "" },
    keranjang: {
      daftar: [],
      kembalian: 0,
      operasional: 0,
      total: 0,
      openedTimestampForm: false,
      openedOperationalForm: false,
    },
  };
};

export const deleteTransaction = async (TrsId) => {
  // Ambil data transaksi
  const _trs = await GetoneTransaksi({ id: TrsId });

  // Merubah data produk
  for (let produk of _trs.produk) {
    // Tipe
    const { tipeProduk, idBarang, beli } = produk;

    // Check data existence
    let dataExists = null;

    // Obat
    if (tipeProduk == "Obat") {
      dataExists = await GetOneObat({ id: idBarang });
    }

    // Pupuk non-subsidi
    else if (tipeProduk == "Pupuk") {
      dataExists = await GetOnePupuk({ id: idBarang });
    }

    // Pupuk Subsidi
    else if (tipeProduk == "PupukSubsidi") {
      dataExists = await GetOnePupukSubsidi({ id: idBarang });
    }

    // Jika produk/ barang tidak dihapus pada database
    if (dataExists != null) {
      // Kembalikan stok nya
      dataExists.stok = dataExists.stok + beli;

      // Update data
      await UpdatePersediaan({ id: tipeProduk, data: dataExists });
    }
  }

  // Hapus transaksi
  DeleteTransaksi({ id: TrsId });
};
