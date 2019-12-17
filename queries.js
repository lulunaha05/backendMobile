const Pool = require("pg").Pool;
const pool = new Pool({
  user: "xodcpesnvrotee",
  host: "ec2-174-129-253-113.compute-1.amazonaws.com",
  database: "d86k5scvbco33e",
  password: "a65b2119c250578af373aa13eea77115aadcdb0c095a462b56b781e07dc216ed",
  port: 5432,
  ssl: true
});

// backend
const panti = (request, response) => {
  pool.query(
    "SELECT * FROM tbl_panti INNER JOIN tbl_gambar ON tbl_panti.gambar_id= tbl_gambar.gambar_id",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const panti_owner = (request, response) => {
  pool.query(
    "SELECT * FROM tbl_panti INNER JOIN tbl_owner ON tbl_panti.owner_kode  = tbl_owner.owner_kode",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const kategori_panti = (request, response) => {
  const id = request.params.id;
  pool.query(
    "SELECT * FROM tbl_panti WHERE kategori_panti = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const new_user = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;

  pool.query(
    "INSERT INTO tbl_user (user_first_name, user_last_name, user_email,user_password) VALUES ($1,$2,$3,$4)",
    [first_name, last_name, email, password],
    (error, results) => {
      console.log(results.rows);
      if (error) {
        throw error;
      } else {
        return response.status(200).send({
          success: true,
          signup: true
        });
      }
    }
  );
};

const new_owner = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;
  const alamat = request.body.alamat;
  const telepon = request.body.telepon;

  pool.query(
    "INSERT INTO tbl_owner (owner_alamat, owner_telepon, owner_firstname, owner_lastname, owner_email, owner_password) VALUES ($1,$2,$3,$4,$5,$6)",
    [alamat, telepon, first_name, last_name, email, password],
    (error, results) => {
      console.log(results.rows);
      if (error) {
        throw error;
      } else {
        return response.status(200).send({
          success: true,
          signup: true
        });
      }
    }
  );
};

const login_user = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  console.log("ini email", request.body.email);

  if (!email || !password) {
    return response.status(200).json({
      success: false,
      login: false,
      massage: "Please fill all required fields!"
    });
  } else if (email.length > 0 && password.length > 0) {
    pool.query(
      "SELECT * FROM tbl_user WHERE user_email = $1",
      [email],
      (error, results) => {
        console.log(results.rows);
        if (error) {
          throw error;
        }
        return response.status(200).json({
          success: true,
          login: true,
          data: results.rows
        });
      }
    );
  }
};

const login_owner = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  console.log("ini email", request.body.email);

  if (!email || !password) {
    return response.status(200).json({
      success: false,
      auth: false,
      massage: "Please fill all required fields!"
    });
  } else if (email.length > 0 && password.length > 0) {
    pool.query(
      "SELECT * FROM tbl_owner WHERE owner_email = $1",
      [email],
      (error, results) => {
        console.log(results.rows);
        if (error) {
          throw error;
        }
        return response.status(200).json({
          success: true,
          login: true,
          data: results.rows
        });
      }
    );
  }
};

const detail_panti = (request, response) => {
  const id = request.params.id;
  pool.query(
    " SELECT * FROM tbl_panti AS panti INNER JOIN tbl_gambar AS gambar ON gambar.gambar_id = panti.gambar_id INNER JOIN tbl_location AS loc ON loc.id_location = panti.id_location WHERE panti_id = $1;",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const edit_profile = (request, response) => {
  const password = request.body.password;
  const id = request.body.id;
  const name = request.body.name;
  const email = request.body.email;

  pool.query(
    "select * from tbl_user where user_password = $1",
    [password],
    (error, results) => {
      if (error) {
        response.status(200).json({ code: 201, message: "failed" });
      }
    }
  );

  pool.query(
    "UPDATE tbl_user SET user_first_name = $1, user_email = $2 WHERE user_id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        response.status(200).json({ code: 201, message: "failed" });
      }
    }
  );

  response.status(200).json({ code: 200, message: "success" });
};

const search_panti = (request, response) => {
  const search = "%" + request.body.search + "%";
  pool.query(
    "SELECT panti_nama, kontak_panti, location_nama FROM tbl_panti INNER JOIN tbl_location ON tbl_location.id_location = tbl_panti.id_location WHERE LOWER(panti_nama) LIKE LOWER($1)",
    [search],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const bookmark_panti = (request, response) => {
  const id_user = request.body.id_user;
  const id_panti = request.body.id_panti;

  pool.query(
    "SELECT * FROM bookmarks WHERE id_user=$1 AND id_panti=$2",
    [id_user, id_panti],
    (error, results) => {
      if (results.rows.length > 0) {
        return response.status(201).json({ code: 201, message: "Failed" });
      }
      pool.query(
        "INSERT INTO bookmarks (id_user, id_panti) VALUES ($1,$2)",
        [id_user, id_panti],
        (salah, hasil) => {
          if (salah) {
            throw salah;
          }
          response.status(200).json({ code: 200, message: "success" });
        }
      );
    }
  );
};

const delete_bookmark = (request, response) => {
  const id_user = request.body.id_user;
  const id_panti = request.body.id_panti;

  pool.query(
    "DELETE FROM bookmarks Where id_user = $1 AND id_panti = $2",
    [id_user, id_panti],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json({ code: 200, message: "success" });
    }
  );
};

module.exports = {
  panti,
  panti_owner,
  kategori_panti,
  login_user,
  new_user,
  new_owner,
  login_owner,
  detail_panti,
  edit_profile,
  search_panti,
  bookmark_panti,
  delete_bookmark
};

//post tapi bodynya banyak
// var {param1, param2} = request.body
//get
//const _param = request.params.id

// pool.query(
//   "SELECT * FROM tbl_panti WHERE id_panti = $1",
//   [id],
//   [nama],
//   (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   }
// );
