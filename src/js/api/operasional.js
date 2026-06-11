import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetOperasional = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Operasional",
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

    // Increase perolehan
    response.perolehan += parseInt(data.jumlah);
  }

  // Return the response
  return response;
};

export const GetWhereOperasional = async (options) =>
  await request.post("/db/get", { db: "Operasional", options });

// Insert data
export const InsertOperasional = async (data) =>
  await request.post("/db/insert", { db: "Operasional", data });

// Delete data
export const DeleteOperasional = async (data) =>
  await request.post("/db/delete", { db: "Operasional", data });

// Update data
export const UpdateOperasional = async (data) =>
  await request.post("/db/update", { db: "Operasional", data });

// Get one data
export const GetOneOperasional = async (options) =>
  await request.post("/db/getone", { db: "Operasional", options });
