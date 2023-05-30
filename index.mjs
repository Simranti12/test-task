import { query as _query  } from "msnodesqlv8";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const connectionString = "server=LAPTOP-OE2SMJPE\\SQLEXPRESS;Database=backend db;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

app.use(bodyParser.json());

app.get("/", (req, res) => {
  
  res.send("This is my page");
});

app.get("/api/v1/top-rated-movies", (req, res) => {
    const query = `
    SELECT movies.tconst, movies.primaryTitle, movies.genres, AVG(ratings.averageRating) AS averageRating
    FROM movies
    JOIN ratings ON movies.tconst = ratings.tconst
    GROUP BY movies.tconst, movies.primaryTitle, movies.genres
    HAVING AVG(ratings.averageRating) > '6.0'
    ORDER BY averageRating DESC
    `;
  
    _query(connectionString, query, (err, rows) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
  
      res.status(200).json(rows);
    });
  });
  

  
  
  app.post("/api/v1/new-movie", (req, res) => {
    if (!req.body) {
        res.status(400).send("No movie data provided");
        return;
    }

    const movie = req.body;

    if (!movie.tconst || !movie.titleType || !movie.primaryTitle || !movie.runtimeMinutes || !movie.genres) {
        res.status(400).send("Invalid movie data");
        return;
    }

    const query = `INSERT INTO movies (tconst,titleType , primaryTitle, runtimeMinutes, genres)
                   VALUES (?, ?, ?, ? , ?)`;
    const values = [movie.tconst, movie.titleType ,movie.primaryTitle, movie.runtimeMinutes, movie.genres];

    _query(connectionString, query, values, (err, rows) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        console.log(rows)

        res.status(200).send({
            message: "Movie created successfully"
        });
    });
});


app.get("/api/v1/longest-duration-movies", (req, res) => {
  const query = `
    SELECT  TOP 10
      tconst,
      primaryTitle,
      runtimeMinutes,
      genres
    FROM movies
    ORDER BY runtimeMinutes DESC;
  `;

  _query(connectionString, query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
});





  app.listen(4300, () => {
    console.log("Server is up and running");
  });
  

