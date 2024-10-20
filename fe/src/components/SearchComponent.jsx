// import { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Form,
//   DropdownButton,
//   Dropdown,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faYoutube } from "@fortawesome/free-brands-svg-icons";
// import { URL } from "../utils";
// import "../styles/Search.css";

// const SearchResultPage = () => {
//   const [movies, setMovies] = useState([]); // State untuk menyimpan data film
//   const [loading, setLoading] = useState(true); // State untuk loading
//   const [error, setError] = useState(null); // State untuk error
//   const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
//   const [moviesPerPage] = useState(9); // Jumlah film per halaman
//   const [filters, setFilters] = useState({
//     genre: "",
//     titleType: "",
//     releaseYear: "",
//     rating: "",
//     country: "",
//   });
//   const [activeCategory, setActiveCategory] = useState("movies"); // movies or celebs
//   const [sortBy, setSortBy] = useState("Ranking");

//   // Fetch data movie dari backend
//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const response = await fetch(`${URL}/movies/popular`); // Fetch data dari backend
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setMovies(data); // Simpan data film
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchMovies();
//   }, []);

//   const handleSortBy = (sortKey) => setSortBy(sortKey);
//   const handleFilterChange = (e) =>
//     setFilters({ ...filters, [e.target.name]: e.target.value });

//   // Logic pagination: menghitung indeks film yang ditampilkan per halaman
//   const indexOfLastMovie = currentPage * moviesPerPage;
//   const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
//   const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie); // Film yang ditampilkan pada halaman ini

//   // Fungsi untuk berpindah halaman
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Fungsi untuk pindah ke halaman berikutnya
//   const nextPage = () => {
//     if (currentPage < Math.ceil(movies.length / moviesPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Fungsi untuk pindah ke halaman sebelumnya
//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Fungsi untuk menghasilkan array nomor halaman untuk ditampilkan
//   const totalPages = Math.ceil(movies.length / moviesPerPage);
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageNumbers.push(i);
//     }
//     return pageNumbers;
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className="main-content">
//       <Container fluid className="search-result-page">
//         {/* Section for buttons and search */}
//         <Row className="mb-4">
//           <Col className="d-flex justify-content-center">
//             <Button
//               variant={activeCategory === "movies" ? "danger" : "secondary"}
//               className="me-2"
//               onClick={() => setActiveCategory("movies")}
//             >
//               MOVIE
//             </Button>
//             <Button
//               variant={activeCategory === "celebs" ? "danger" : "secondary"}
//               onClick={() => setActiveCategory("celebs")}
//             >
//               CELEBS
//             </Button>
//           </Col>
//         </Row>

//         {/* Search Field */}
//         <Row className="mb-4">
//           <Col md={12}>
//             <Form.Control
//               type="text"
//               placeholder={`Search ${
//                 activeCategory === "movies" ? "Movies" : "Celebs"
//               }`}
//               className="search-field"
//             />
//           </Col>
//         </Row>

//         <Row>
//           {/* Sidebar for Filters */}
//           <Col md={3} className="bg-dark p-3 rounded filter-sidebar">
//             <h5 className="text-light">Filters</h5>
//             <Form.Group className="mb-3">
//               <Form.Label className="text-light">Genres</Form.Label>
//               <Form.Select name="genre" onChange={handleFilterChange}>
//                 <option value="">All Genres</option>
//                 <option value="action">Action</option>
//                 <option value="comedy">Comedy</option>
//                 <option value="drama">Drama</option>
//                 <option value="thriller">Thriller</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label className="text-light">Title Type</Form.Label>
//               <Form.Select name="titleType" onChange={handleFilterChange}>
//                 <option value="">All Types</option>
//                 <option value="movie">Movie</option>
//                 <option value="series">Series</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label className="text-light">Release Year</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="releaseYear"
//                 placeholder="Enter year"
//                 onChange={handleFilterChange}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label className="text-light">Rating</Form.Label>
//               <Form.Select name="rating" onChange={handleFilterChange}>
//                 <option value="">All Ratings</option>
//                 <option value="8">8+</option>
//                 <option value="7">7+</option>
//                 <option value="6">6+</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label className="text-light">Country</Form.Label>
//               <Form.Select name="country" onChange={handleFilterChange}>
//                 <option value="">All Countries</option>
//                 <option value="us">United States</option>
//                 <option value="uk">United Kingdom</option>
//                 <option value="fr">France</option>
//               </Form.Select>
//             </Form.Group>
//             <Button variant="outline-light" onClick={() => console.log(filters)}>
//               Apply Filters
//             </Button>
//           </Col>

//           {/* Section for Movies */}
//           <Col md={9}>
//             <Row className="mb-3">
//               <Col>
//                 <h5>{movies.length} Movies</h5>
//               </Col>
//               <Col className="d-flex justify-content-end">
//                 <DropdownButton
//                   id="dropdown-basic-button"
//                   title={`Sort by: ${sortBy}`}
//                   onSelect={handleSortBy}
//                   variant="outline-secondary"
//                   size="sm"
//                   className="me-2"
//                 >
//                   <Dropdown.Item eventKey="Ranking">Ranking</Dropdown.Item>
//                   <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
//                   <Dropdown.Item eventKey="Popularity">Popularity</Dropdown.Item>
//                 </DropdownButton>
//               </Col>
//             </Row>

//             {/* Search Result Section - Grid layout */}
//             <div
//               className="movie-list"
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(3, 1fr)", // Ubah menjadi 3 kolom per baris
//                 gap: "20px",
//                 padding: "10px 0",
//               }}
//             >
//               {currentMovies.map((movie) => (
//                 <div key={movie.id} className="movie-item">
//                   <Link to={`/movie/${movie.id}`}>
//                     <img
//                       src={movie.poster_url}
//                       alt={movie.title}
//                       className="movie-poster"
//                       style={{
//                         width: "100%",
//                         borderRadius: "10px",
//                         transition: "transform 0.3s",
//                       }}
//                     />
//                   </Link>
//                   <div className="movie-info">
//                     <h5 style={styles.movieTitle}>{movie.title}</h5>
//                     <p>{movie.release_date}</p>
//                     <div className="rating-container">
//                       <div
//                         className="rating-circle"
//                         style={{
//                           border: `5px solid ${
//                             movie.rating >= 7 ? "green" : "red"
//                           }`,
//                           borderColor: `conic-gradient(green ${
//                             movie.rating * 10
//                           }%, #ccc 0)`,
//                           width: "50px",
//                           height: "50px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                         }}
//                       >
//                         <span>{movie.rating}</span>
//                       </div>
//                     </div>
//                     <a
//                       href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
//                         movie.title
//                       )}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <FontAwesomeIcon
//                         color="#dc3545"
//                         icon={faYoutube}
//                         size="2x"
//                       />
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination with arrows */}
//             <div className="pagination-container mt-4">
//               <Button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className="pagination-arrow"
//               >
//                 &lt;
//               </Button>

//               {/* Display numbered pagination */}
//               {getPageNumbers().map((pageNumber) => (
//                 <Button
//                   key={pageNumber}
//                   onClick={() => paginate(pageNumber)}
//                   className={`pagination-btn ${
//                     pageNumber === currentPage ? "active" : ""
//                   }`}
//                 >
//                   {pageNumber}
//                 </Button>
//               ))}

//               <Button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//                 className="pagination-arrow"
//               >
//                 &gt;
//               </Button>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// // Styles for the component
// const styles = {
//   movieTitle: {
//     textAlign: "center",
//     whiteSpace: "normal",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//   },
// };

// export default SearchResultPage;

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { URL } from "../utils";
import "../styles/Search.css";
import { debounce } from 'lodash'; // Import lodash debounce function


const SearchResultPage = () => {
  const [movies, setMovies] = useState([]); // State untuk menyimpan data film
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [moviesPerPage] = useState(9); // Jumlah film per halaman
  const [searchQuery, setSearchQuery] = useState(""); // Query pencarian
  const [filters, setFilters] = useState({
    genre: "",
    titleType: "",
    releaseYear: "",
    rating: "",
    country: "",
  });
  const [activeCategory, setActiveCategory] = useState("movies"); // movies or celebs
  const [sortBy, setSortBy] = useState("Ranking");

  // Fetch data movie dari backend
  const fetchMovies = async (query = "") => {
    try {
      setLoading(true);
      const url = query
        ? `${URL}/movies/search?query=${query}`
        : `${URL}/movies/popular`;
      const response = await fetch(url); // Fetch data dari backend
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMovies(data); // Simpan data film
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  // Fetch data saat component pertama kali dimuat
  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSortBy = (sortKey) => setSortBy(sortKey);
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // Fungsi untuk menangani pencarian saat mengetik dengan debounce
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    fetchMovies(query); // Fetch movies berdasarkan query pencarian
  }, 500); // Delay 500ms untuk debounce

  // Logic pagination: menghitung indeks film yang ditampilkan per halaman
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie); // Film yang ditampilkan pada halaman ini

  // Fungsi untuk berpindah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fungsi untuk pindah ke halaman berikutnya
  const nextPage = () => {
    if (currentPage < Math.ceil(movies.length / moviesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk pindah ke halaman sebelumnya
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fungsi untuk menghasilkan array nomor halaman untuk ditampilkan
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="main-content">
      <Container fluid className="search-result-page">
        {/* Section for buttons and search */}
        <Row className="mb-4">
          <Col className="d-flex justify-content-center">
            <Button
              variant={activeCategory === "movies" ? "danger" : "secondary"}
              className="me-2"
              onClick={() => setActiveCategory("movies")}
            >
              MOVIE
            </Button>
            <Button
              variant={activeCategory === "celebs" ? "danger" : "secondary"}
              onClick={() => setActiveCategory("celebs")}
            >
              CELEBS
            </Button>
          </Col>
        </Row>

        {/* Search Field */}
        <Row className="mb-4">
          <Col md={12}>
            <Form>
              <Form.Control
                type="text"
                placeholder={`Search ${
                  activeCategory === "movies" ? "Movies" : "Celebs"
                }`}
                className="search-field"
                onChange={(e) => handleSearch(e.target.value)} // Update search as user types
              />
            </Form>
          </Col>
        </Row>

        <Row>
          {/* Sidebar for Filters */}
          <Col md={3} className="bg-dark p-3 rounded filter-sidebar">
            <h5 className="text-light">Filters</h5>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Genres</Form.Label>
              <Form.Select name="genre" onChange={handleFilterChange}>
                <option value="">All Genres</option>
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="thriller">Thriller</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Title Type</Form.Label>
              <Form.Select name="titleType" onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Release Year</Form.Label>
              <Form.Control
                type="number"
                name="releaseYear"
                placeholder="Enter year"
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Rating</Form.Label>
              <Form.Select name="rating" onChange={handleFilterChange}>
                <option value="">All Ratings</option>
                <option value="8">8+</option>
                <option value="7">7+</option>
                <option value="6">6+</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Country</Form.Label>
              <Form.Select name="country" onChange={handleFilterChange}>
                <option value="">All Countries</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="fr">France</option>
              </Form.Select>
            </Form.Group>
            <Button variant="outline-light" onClick={() => console.log(filters)}>
              Apply Filters
            </Button>
          </Col>

          {/* Section for Movies */}
          <Col md={9}>
            <Row className="mb-3">
              <Col>
                <h5>{movies.length} Movies</h5>
              </Col>
              <Col className="d-flex justify-content-end">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={`Sort by: ${sortBy}`}
                  onSelect={handleSortBy}
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                >
                  <Dropdown.Item eventKey="Ranking">Ranking</Dropdown.Item>
                  <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
                  <Dropdown.Item eventKey="Popularity">
                    Popularity
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>

            {/* Search Result Section - Grid layout */}
            <div
              className="movie-list"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", // Ubah menjadi 3 kolom per baris
                gap: "20px",
                padding: "10px 0",
              }}
            >
              {currentMovies.map((movie) => (
                <div key={movie.id} className="movie-item">
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="movie-poster"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        transition: "transform 0.3s",
                      }}
                    />
                  </Link>
                  <div className="movie-info">
                    <h5 style={styles.movieTitle}>{movie.title}</h5>
                    <p>{movie.release_date}</p>
                    <div className="rating-container">
                      <div
                        className="rating-circle"
                        style={{
                          border: `5px solid ${
                            movie.rating >= 7 ? "green" : "red"
                          }`,
                          borderColor: `conic-gradient(green ${
                            movie.rating * 10
                          }%, #ccc 0)`,
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        movie.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        color="#dc3545"
                        icon={faYoutube}
                        size="2x"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination with arrows */}
            <div className="pagination-container mt-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="pagination-arrow"
              >
                &lt;
              </Button>

              {/* Display numbered pagination */}
              {getPageNumbers().map((pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`pagination-btn ${
                    pageNumber === currentPage ? "active" : ""
                  }`}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
              >
                &gt;
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Styles for the component
const styles = {
  movieTitle: {
    textAlign: "center",
    whiteSpace: "normal",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
};

export default SearchResultPage;
