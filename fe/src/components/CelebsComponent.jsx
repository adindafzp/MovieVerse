import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/Celebs.css";
import { URL } from "../utils";
import "../styles/Pagination.css"; // Import styles for pagination

const CelebsComponent = () => {
  const [celebs, setCelebs] = useState([]); // Semua selebriti
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [celebsPerPage] = useState(12); // Jumlah selebriti per halaman
  const [totalPages, setTotalPages] = useState(0); // Total jumlah halaman

  // Fetch celebs data with pagination
  useEffect(() => {
    const fetchCelebs = async () => {
      setLoading(true); // Set loading to true at the start of the fetch
      const url = `${URL}/actors?page=${currentPage}&limit=${celebsPerPage}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch celebrities.");
        }

        const data = await response.json();
        setCelebs(data.actors); // Menyimpan data selebriti untuk halaman saat ini
        setTotalPages(data.meta.totalPages); // Mengatur jumlah halaman dari respons
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCelebs();
  }, [currentPage, celebsPerPage]);

  // Fungsi untuk pindah ke halaman berikutnya
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk pindah ke halaman sebelumnya
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fungsi untuk berpindah ke halaman yang dipilih
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fungsi untuk menghasilkan array nomor halaman untuk ditampilkan
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Jumlah halaman yang terlihat sekaligus (misalnya 5)
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) return <p>Loading...</p>; // Tampilkan loading saat data sedang dimuat
  if (error) return <p>Error: {error.message}</p>; // Tampilkan error jika ada

  return (
    <Container>
      <Row>
        {celebs.map((celeb) => (
          <Col key={celeb.id} md={3} className="mb-4 celeb-item">
            <Link to={`/celeb/${celeb.id}`} className="celeb-link">
              <div className="celeb-image-wrapper">
                <img
                  src={celeb.image} // Mengambil image selebriti dari API
                  alt={celeb.name}
                  className="img-fluid rounded"
                />
                <div className="celeb-name">{celeb.name}</div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="pagination-container text-center">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          &lt;
        </Button>

        {currentPage > 2 && (
          <>
            <Button onClick={() => paginate(1)} className="pagination-btn">1</Button>
            {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {getPageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`pagination-btn ${pageNumber === currentPage ? "active" : ""}`}
          >
            {pageNumber}
          </Button>
        ))}

        {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
        {currentPage < totalPages - 1 && (
          <Button onClick={() => paginate(totalPages)} className="pagination-btn">
            {totalPages}
          </Button>
        )}

        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        >
          &gt;
        </Button>
      </div>
    </Container>
  );
};

export default CelebsComponent;


/* PAGINATION DENGAN LOAD MORE */
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Container, Row, Col, Button } from "react-bootstrap";
// import "../styles/Celebs.css";
// import { URL } from "../utils";

// const CelebsComponent = () => {
//   const [celebs, setCelebs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1); // State for page number
//   const [hasMore, setHasMore] = useState(true); // Control for whether more data can be loaded

//   useEffect(() => {
//     const fetchCelebs = async () => {
//       setLoading(true); // Set loading to true at the start of the fetch
//       const url = `${URL}/actors?page=${page}`;

//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error("Failed to fetch celebrities.");
//         }

//         const data = await response.json();

//         // Update celebs data (append to the existing array for pagination)
//         setCelebs((prevCelebs) => {
//           // Avoid duplicate entries
//           const newCelebs = data.actors.filter(
//             (newCeleb) => !prevCelebs.some((celeb) => celeb.id === newCeleb.id)
//           );
//           return [...prevCelebs, ...newCelebs];
//         });

//         // Check if there's more data to load
//         if (page >= data.meta.totalPages) {
//           setHasMore(false); // No more data to load
//         }

//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchCelebs();
//   }, [page]);

//   // Function to load more celebrities
//   const loadMoreCelebs = () => {
//     if (hasMore) {
//       setPage((prevPage) => prevPage + 1); // Increment the page number
//     }
//   };

//   if (loading && page === 1) return <p>Loading...</p>; // Loading when first loading the page
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <Container>
//       <Row>
//         {celebs.map((celeb) => (
//           <Col key={celeb.id} md={3} className="mb-4 celeb-item">
//             <Link to={`/celeb/${celeb.id}`} className="celeb-link">
//               <div className="celeb-image-wrapper">
//                 <img
//                   src={celeb.image} // Use the image field from your API
//                   alt={celeb.name}
//                   className="img-fluid rounded"
//                 />
//                 <div className="celeb-name">{celeb.name}</div>
//               </div>
//             </Link>
//           </Col>
//         ))}
//       </Row>

//       {/* Load More Button */}
//       {hasMore && (
//         <div className="text-center">
//           <Button
//             onClick={loadMoreCelebs}
//             className="mt-4"
//             style={{ backgroundColor: "red", border: "none" }}
//           >
//             Load More
//           </Button>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default CelebsComponent;

/* FETCHING DARI TMDB */
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Container, Row, Col, Button } from "react-bootstrap";
// import { apiKey } from "../data";
// import "../styles/Celebs.css";

// const CelebsComponent = () => {
//   const [celebs, setCelebs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1); // State untuk nomor halaman
//   const [hasMore, setHasMore] = useState(true); // State untuk memeriksa apakah ada data lagi yang bisa dimuat

//   useEffect(() => {
//     const fetchCelebs = async () => {
//       const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=${page}`;
//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error("Failed to fetch celebrities.");
//         }
//         const data = await response.json();
//         setCelebs((prevCelebs) => [...prevCelebs, ...data.results]); // Tambahkan selebriti baru
//         setHasMore(data.page < data.total_pages); // Cek apakah masih ada halaman berikutnya
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchCelebs();
//   }, [page]); // Jalankan efek ini setiap kali halaman berubah

//   // Fungsi untuk memuat lebih banyak selebriti
//   const loadMoreCelebs = () => {
//     setPage((prevPage) => prevPage + 1); // Tambahkan nomor halaman
//   };

//   if (loading && page === 1) return <p>Loading...</p>; // Loading saat pertama kali memuat halaman
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <Container>
//       <Row>
//         {celebs.map((celeb) => (
//           <Col key={celeb.id} md={3} className="mb-4 celeb-item">
//             <Link to={`/celeb/${celeb.id}`} className="celeb-link">
//               <div className="celeb-image-wrapper">
//                 <img
//                   src={`https://image.tmdb.org/t/p/w500${celeb.profile_path}`}
//                   alt={celeb.name}
//                   className="img-fluid rounded"
//                 />
//                 <div className="celeb-name">{celeb.name}</div>
//               </div>
//             </Link>
//           </Col>
//         ))}
//       </Row>

//       {/* Tombol Load More */}
//       {hasMore && (
//         <div className="text-center">
//           <Button
//             onClick={loadMoreCelebs}
//             className="mt-4"
//             style={{ backgroundColor: "red", border: "none" }}
//           >
//             Load More
//           </Button>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default CelebsComponent;
