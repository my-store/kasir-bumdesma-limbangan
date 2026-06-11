import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetBank = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Bank",
    options: {
      filter: {
        timestamp: {
          // Ambil data dari tahun ini (workTime) kebawah
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  // Prepare default response data
  let response = { data: [], perolehan: 0 };

  for (let data of _getData) {
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
    await response.data.push(data);

    // Decrease perolehan (tipe = "SetorBank")
    if (data.tipe == "SetorBank") {
      response.perolehan += data.nominal;
    }

    // Decrease perolehan (tipe = "TarikTunai")
    else if (data.tipe == "TarikTunai" && response.perolehan > 0) {
      response.perolehan -= data.nominal;
    }
  }

  // Return the response
  return response;
};

// Insert
export const InsertBank = async (data) =>
  await request.post("/db/insert", { db: "Bank", data });

// Update
export const UpdateBank = async (data) =>
  await request.post("/db/update", { db: "Bank", data });

// Get one
export const GetOneBank = async (options) =>
  await request.post("/db/getone", {
    db: "Bank",
    options,
  });

// Delete data
export const DeleteBank = async (data) =>
  await request.post("/db/delete", { db: "Bank", data });
