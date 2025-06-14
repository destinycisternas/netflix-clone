import { useEffect, useState } from 'react';
import './styles.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [categories, setCategories] = useState([]); // Nuevo estado para categorías
  const [selectedCategory, setSelectedCategory] = useState(''); // Nuevo estado para categoría seleccionada
  const [users, setUsers] = useState([]); // Estado para usuarios
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Cargar las categorías
  useEffect(() => {
    async function fetchCategories() {
      try {
        const apiKey = '1c8d05d67fdcc727528ab1a50240d82b';
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        );
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategories(data.genres);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, []);

  // Obtener las películas
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError('');
      
      try {
        let response;
        const apiKey = '1c8d05d67fdcc727528ab1a50240d82b';

        let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
        
        // Si hay una categoría seleccionada, se filtra por ella
        if (selectedCategory) {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedCategory}&page=${page}`;
        }
        
        // Si hay una búsqueda, se realiza el filtro por query
        if (query) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
        }

        response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al obtener las películas');
        }

        const data = await response.json();
        if (data.results.length === 0) {
          setError('No se encontraron películas.');
        }
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        setError('Ocurrió un error al obtener las películas.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [query, page, selectedCategory]); // Dependiendo de la categoría seleccionada, se realiza una nueva búsqueda

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Actualiza la categoría seleccionada
    setPage(1); // Resetear la página al primer resultado cuando se cambia de categoría
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Todos los campos son requeridos.');
      return;
    }

    const existingUser = users.find(user => user.email === formData.email);
    if (existingUser) {
      setFormError('Este correo ya está registrado.');
      return;
    }

    setUsers([...users, formData]);
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    alert('Usuario registrado con éxito.');
    setLoggedInUser(formData.name); // Loguear automáticamente después del registro
    setShowRegister(false);
    setShowLogin(false); // Cerrar ambos formularios después de registrarse
  };

  const handleLogin = () => {
    const existingUser = users.find(user => user.email === formData.email && user.password === formData.password);
    if (!existingUser) {
      setFormError('Correo o contraseña incorrectos.');
      return;
    }

    setLoggedInUser(existingUser.name); // Establecer el nombre del usuario logueado
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    setShowLogin(false); // Cerrar el formulario de login
  };

  return (
    <div>
      <div className="navbar">
        <h1>NESFLIX</h1>
        <input
          type="text"
          placeholder="Buscar películas..."
          value={query}
          onChange={handleSearch}
        />
        <select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">Filtrar por Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {loggedInUser ? (
          <div className="user-info">
            <span>¡Hola! , {loggedInUser}</span>
            <button onClick={() => setLoggedInUser(null)}>Cerrar sesión</button>
          </div>
        ) : (
          <div>
            <button className="login-button" onClick={() => { setShowRegister(false); setShowLogin(true); }}>
              Iniciar sesión
            </button>
          </div>
        )}
      </div>

      {showRegister && (
        <div className="register-form">
          <button className="close-register" onClick={() => setShowRegister(false)}>
            X
          </button>
          <h2>Registro de Usuario</h2>
          {formError && <div className="form-error">{formError}</div>}
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleFormChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleFormChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleFormChange}
          />
          <button onClick={handleRegister}>Registrar</button>
          <p>
            ¿Ya tienes una cuenta? <button onClick={() => { setShowRegister(false); setShowLogin(true); }}>Iniciar sesión</button>
          </p>
        </div>
      )}

      {showLogin && (
        <div className="login-form">
          <button className="close-login" onClick={() => setShowLogin(false)}>
            X
          </button>
          <h2>Iniciar Sesión</h2>
          {formError && <div className="form-error">{formError}</div>}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleFormChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleFormChange}
          />
          <button onClick={handleLogin}>Iniciar sesión</button>
          <p>
            ¿No tienes una cuenta? <button onClick={() => { setShowLogin(false); setShowRegister(true); }}>Crear cuenta</button>
          </p>
        </div>
      )}

      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="no-results">{error}</div>}

      <div className="container">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleMovieClick(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="movie-details">
          <button className="close-details" onClick={handleCloseDetails}>
            X
          </button>
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.overview}</p>
          <p><strong>Fecha de lanzamiento:</strong> {selectedMovie.release_date}</p>
          <p><strong>Voto Promedio:</strong> {selectedMovie.vote_average}</p>
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
          />
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>{`Página ${page} de ${totalPages}`}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default App;
