// Importamos los hooks necesarios de React
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendarDays, faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './styles/styles.css';

function App() {
  // Estados para manejar datos y acciones del usuario
  const [movies, setMovies] = useState([]); // Lista de películas
  const [query, setQuery] = useState(''); // Búsqueda
  const [loading, setLoading] = useState(true); // Cargando o no
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(0); // Total de páginas disponibles
  const [error, setError] = useState(''); // Mensaje de error
  const [selectedMovie, setSelectedMovie] = useState(null); // Película seleccionada
  const [categories, setCategories] = useState([]); // Categorías de películas
  const [selectedCategory, setSelectedCategory] = useState(''); // Categoría seleccionada
  const [users, setUsers] = useState([]); // Lista de usuarios registrados
  const [formData, setFormData] = useState({ name: '', email: '', password: '' }); // Datos del formulario
  const [formError, setFormError] = useState(''); // Error del formulario
  const [showRegister, setShowRegister] = useState(false); // Mostrar formulario de registro
  const [showLogin, setShowLogin] = useState(false); // Mostrar formulario de inicio
  const [loggedInUser, setLoggedInUser] = useState(null); // Usuario logueado
  const [movieVideos, setMovieVideos] = useState([]); // Videos de película seleccionada
  const [showNavbar, setShowNavbar] = useState(true); // Mostrar u ocultar navbar al hacer scroll
  const [lastScrollY, setLastScrollY] = useState(0); // Última posición del scroll

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;


  // Manejar scroll para mostrar u ocultar la barra de navegación
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Obtener categorías de películas al iniciar la app
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then(res => res.json())
      .then(data => setCategories(data.genres))
      .catch(err => console.error('Error al cargar categorías:', err));
  }, []);

  // Obtener películas cada vez que cambie la búsqueda, página o categoría
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');

      let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;

      if (selectedCategory) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedCategory}&page=${page}`;
      }

      if (query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
          setError('No se encontraron películas.');
          setMovies([]);
          setTotalPages(0);
        } else {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        }
      } catch (e) {
        setError('Ocurrió un error al obtener las películas.');
        setMovies([]);
        setTotalPages(0);
      }

      setLoading(false);
    };

    fetchMovies();
  }, [query, page, selectedCategory]);

  // Cambiar categoría seleccionada
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  // Cambiar búsqueda
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  // Mostrar detalles de una película y obtener sus videos
  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);

    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`);
      const data = await res.json();
      const trailers = data.results.filter(video => video.type === "Trailer" && video.site === "YouTube");
      setMovieVideos(trailers);
    } catch (error) {
      console.error('Error al obtener videos:', error);
      setMovieVideos([]);
    }
  };

  // Cerrar el modal de detalles
  const handleCloseDetails = () => {
    setSelectedMovie(null);
    setMovieVideos([]);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Registro de usuario
  const handleRegister = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Todos los campos son requeridos.');
      return;
    }

    const userExists = users.find(u => u.email === formData.email);
    if (userExists) {
      setFormError('Este correo ya está registrado.');
      return;
    }

    setUsers(prev => [...prev, formData]);
    setLoggedInUser(formData.name);
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    alert('Usuario registrado con éxito.');
    setShowRegister(false);
    setShowLogin(false);
  };

  // Inicio de sesión
  const handleLogin = () => {
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (!user) {
      setFormError('Correo o contraseña incorrectos.');
      return;
    }

    setLoggedInUser(user.name);
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    setShowLogin(false);
  };

  return (
    <div>
      {/* Barra de navegación */}
      <div className={`navbar ${showNavbar ? 'visible' : 'hidden'}`}>
        <div className="navbar-left">
          <h1
            onClick={() => {
              setQuery('');
              setSelectedCategory('');
              setPage(1);
            }}
            style={{ cursor: 'pointer' }}
          >
            NESFLIX
          </h1>
        </div>
        <div className="navbar-center">
          <div className="control-wrapper">
            <FontAwesomeIcon icon={faSearch} className="control-icon" />
            <input
              type="text"
              placeholder="Buscar películas..."
              value={query}
              onChange={handleSearch}
            />
          </div>
          <div className="control-wrapper">
            <select onChange={handleCategoryChange} value={selectedCategory}>
              <option value="">Categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="control-icon select-icon" />
          </div>
        </div>
        <div className="navbar-right">
          {loggedInUser ? (
            <>
              <span>¡Hola, {loggedInUser}!</span>
              <button onClick={() => setLoggedInUser(null)}>Cerrar sesión</button>
            </>
          ) : (
            <button onClick={() => { setShowRegister(false); setShowLogin(true); }}>Iniciar sesión</button>
          )}
        </div>
      </div>

      {/* Modales */}
      {showRegister && (
        <div className="register-overlay" onClick={() => setShowRegister(false)}>
          <div className="register-wrapper" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowRegister(false)}>×</button>
            <div className="register-form">
              <h2>Registro</h2>
              {formError && <div className="form-error">{formError}</div>}
              <input name="name" placeholder="Nombre" value={formData.name} onChange={handleFormChange} />
              <input name="email" placeholder="Correo" value={formData.email} onChange={handleFormChange} />
              <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleFormChange} />
              <button onClick={handleRegister}>Registrar</button>
              <p>¿Ya tienes cuenta? <button className="register-btn" onClick={() => { setShowRegister(false); setShowLogin(true); }}>Iniciar sesión</button></p>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-wrapper" onClick={e => e.stopPropagation()}>
            <button className="close-login" onClick={() => setShowLogin(false)}>×</button>
            <div className="login-form">
              <h2>Iniciar Sesión</h2>
              {formError && <div className="form-error">{formError}</div>}
              <input name="email" placeholder="Correo" value={formData.email} onChange={handleFormChange} />
              <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleFormChange} />
              <button onClick={handleLogin}>Entrar</button>
              <p>¿No tienes cuenta? <button className="register-btn" onClick={() => { setShowRegister(true); setShowLogin(false); }}>Regístrate</button></p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de películas */}
      <div className="movies-container">
        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && movies.length === 0 && <p>No hay películas para mostrar.</p>}

        {!loading && !error && movies.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
            <div className="movie-image" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}>
              <div className="movie-rating"><FontAwesomeIcon icon={faStar} /> {movie.vote_average.toFixed(1)}</div>
              <div className="movie-release"><FontAwesomeIcon icon={faCalendarDays} /> {new Date(movie.release_date).toLocaleDateString('es-CL').replace(/\//g, '-')}</div>
            </div>
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>

      {/* Modal de detalles de película */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="movie-details" onClick={e => e.stopPropagation()}>
            <button className="close-details" onClick={handleCloseDetails}>X</button>
            <h2 className="movie-title">{selectedMovie.title}</h2>
            <p className="movie-overview">{selectedMovie.overview}</p>
            <div className="movie-icons">
              <span className="movie-info"><FontAwesomeIcon icon={faStar} className="icon" />{selectedMovie.vote_average.toFixed(1)}</span>
              <span className="movie-info"><FontAwesomeIcon icon={faCalendarDays} className="icon" />{new Date(selectedMovie.release_date).toLocaleDateString('es-CL').replace(/\//g, '-')}</span>
            </div>
            <div className="media-section">
              <img className="movie-poster" src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`} alt={selectedMovie.title} />
              {movieVideos.length > 0 ? (
                <div className="movie-trailer">
                  <h4>{movieVideos[0].name}</h4>
                  <iframe
                    width="420"
                    height="235"
                    src={`https://www.youtube.com/embed/${movieVideos[0].key}`}
                    title={movieVideos[0].name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p>No hay trailers disponibles.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
