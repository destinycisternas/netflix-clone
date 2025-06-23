import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './src/styles/styles.css';

function App() {
  // Estado para guardar las películas
  const [movies, setMovies] = useState([]);

  // Estado para la búsqueda por texto
  const [query, setQuery] = useState('');

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Estado para la paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Estado para mostrar errores
  const [error, setError] = useState('');

  // Estado para mostrar detalles de una película
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Estado para las categorías (géneros)
  const [categories, setCategories] = useState([]);

  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState('');

  // Estado para los usuarios registrados
  const [users, setUsers] = useState([]);

  // Estado del formulario de registro/inicio de sesión
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Mensaje de error en formularios
  const [formError, setFormError] = useState('');

  // Mostrar u ocultar formularios
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Usuario actualmente logueado
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Obtener categorías de películas al cargar la app
  useEffect(() => {
    const apiKey = '1c8d05d67fdcc727528ab1a50240d82b';
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then(res => res.json())
      .then(data => setCategories(data.genres))
      .catch(err => console.error('Error al cargar categorías:', err));
  }, []);

  // Obtener películas cada vez que cambia la búsqueda, página o categoría
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');
      const apiKey = '1c8d05d67fdcc727528ab1a50240d82b';

      // Armar la URL de la API según lo que se quiere buscar
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

        if (data.results.length === 0) {
          setError('No se encontraron películas.');
        }

        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (e) {
        setError('Ocurrió un error al obtener las películas.');
      }

      setLoading(false);
    };

    fetchMovies();
  }, [query, page, selectedCategory]);

  // Cambiar categoría seleccionada
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reiniciar a la primera página
  };

  // Cambiar búsqueda
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1); // Reiniciar a la primera página
  };

  // Mostrar detalles de una película
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Cerrar detalles
  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  // Cambiar los campos del formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Registrar nuevo usuario
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

    // Guardar nuevo usuario
    setUsers([...users, formData]);
    setLoggedInUser(formData.name); // Loguear directamente
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    alert('Usuario registrado con éxito.');
    setShowRegister(false);
    setShowLogin(false);
  };

  // Iniciar sesión
  const handleLogin = () => {
    const user = users.find(
      u => u.email === formData.email && u.password === formData.password
    );

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
      {/* Barra superior */}
      <div className="navbar">
        <div className="navbar-left">
          <h1>NESFLIX</h1>
        </div>

        <div className="navbar-center">
          <input
            type="text"
            placeholder="Buscar películas..."
            value={query}
            onChange={handleSearch}
          />
          <select onChange={handleCategoryChange} value={selectedCategory}>
            <option value="">Categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="navbar-right">
          {loggedInUser ? (
            <>
              <span>¡Hola, {loggedInUser}!</span>
              <button onClick={() => setLoggedInUser(null)}>Cerrar sesión</button>
            </>
          ) : (
            <button onClick={() => { setShowRegister(false); setShowLogin(true); }}>
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      {/* Formulario de registro */}
      {showRegister && (
        <div className="register-form">
          <button className="close-register" onClick={() => setShowRegister(false)}>X</button>
          <h2>Registro</h2>
          {formError && <div className="form-error">{formError}</div>}
          <input name="name" placeholder="Nombre" value={formData.name} onChange={handleFormChange} />
          <input name="email" placeholder="Correo" value={formData.email} onChange={handleFormChange} />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleFormChange} />
          <button onClick={handleRegister}>Registrar</button>
          <p>¿Ya tienes cuenta? <button onClick={() => { setShowRegister(false); setShowLogin(true); }}>Iniciar sesión</button></p>
        </div>
      )}

      {/* Formulario de login */}
      {showLogin && (
        <div className="login-form">
          <button className="close-login" onClick={() => setShowLogin(false)}>X</button>
          <h2>Iniciar Sesión</h2>
          {formError && <div className="form-error">{formError}</div>}
          <input name="email" placeholder="Correo" value={formData.email} onChange={handleFormChange} />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleFormChange} />
          <button onClick={handleLogin}>Entrar</button>
          <p>¿No tienes cuenta? <button onClick={() => { setShowLogin(false); setShowRegister(true); }}>Crear una</button></p>
        </div>
      )}

      {/* Estado de carga o error */}
      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="no-results">{error}</div>}

      {/* Listado de películas */}
      <div className="container">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h4>{movie.title}</h4>
            <div className="movie-rating">

              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>


      {/* Detalle de película seleccionada */}
      {selectedMovie && (
        <div className="movie-details">
          <button className="close-details" onClick={handleCloseDetails}>X</button>
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.overview}</p>
          <p><strong>Fecha:</strong> {selectedMovie.release_date}</p>
          <p>
            <strong>Voto: </strong>
            <FontAwesomeIcon icon={faStar} style={{ color: 'gold', marginRight: '5px' }} />
            {selectedMovie.vote_average.toFixed(1)} - Test
          </p>
          <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} alt={selectedMovie.title} />
        </div>
      )}

      {/* Paginación */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
        <span>{`Página ${page} de ${totalPages}`}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Siguiente</button>
      </div>
    </div>
  );
}

export default App;
