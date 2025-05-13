import { useEffect, useState } from 'react';
import './styles.css';

const API_KEY = '1c8d05d67fdcc727528ab1a50240d82b';

function App() {
  const [state, setState] = useState({
    movies: [],
    query: '',
    page: 1,
    totalPages: 0,
    error: '',
    loading: true,
    selectedMovie: null,
    categories: [],
    selectedCategory: '',
    users: [],
    loggedInUser: null,
    showRegister: false,
    showLogin: false,
    formData: { name: '', email: '', password: '' },
    formError: ''
  });

  const {
    movies, query, page, totalPages, error, loading,
    selectedMovie, categories, selectedCategory, users,
    loggedInUser, showRegister, showLogin, formData, formError
  } = state;

  const updateState = (changes) => setState(prev => ({ ...prev, ...changes }));

  const fetchData = async (url, key) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      return data[key];
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`, 'genres')
      .then(genres => updateState({ categories: genres }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      updateState({ loading: true, error: '' });
      let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;

      if (selectedCategory)
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedCategory}&page=${page}`;
      if (query)
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;

      try {
        const data = await fetchData(url, 'results');
        updateState({ movies: data, totalPages: data.total_pages || 1 });
        if (!data.length) updateState({ error: 'No se encontraron películas.' });
      } catch {
        updateState({ error: 'Ocurrió un error al obtener las películas.' });
      } finally {
        updateState({ loading: false });
      }
    };

    fetchMovies();
  }, [query, page, selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateState({ formData: { ...formData, [name]: value } });
  };

  const handleRegister = () => {
    if (!formData.name || !formData.email || !formData.password) {
      updateState({ formError: 'Todos los campos son requeridos.' });
      return;
    }
    if (users.some(user => user.email === formData.email)) {
      updateState({ formError: 'Este correo ya está registrado.' });
      return;
    }
    updateState({
      users: [...users, formData],
      loggedInUser: formData.name,
      formData: { name: '', email: '', password: '' },
      formError: '',
      showRegister: false,
      showLogin: false
    });
    alert('Usuario registrado con éxito.');
  };

  const handleLogin = () => {
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    if (!user) {
      updateState({ formError: 'Correo o contraseña incorrectos.' });
      return;
    }
    updateState({
      loggedInUser: user.name,
      formData: { name: '', email: '', password: '' },
      formError: '',
      showLogin: false
    });
  };

  return (
    <div>
      <nav className="navbar">
        <h1>NESFLIX</h1>
        <input type="text" placeholder="Buscar..." value={query} onChange={(e) => updateState({ query: e.target.value, page: 1 })} />
        <select value={selectedCategory} onChange={(e) => updateState({ selectedCategory: e.target.value, page: 1 })}>
          <option value="">Categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {loggedInUser ? (
          <div className="user-info">
            <span>Hola, {loggedInUser}</span>
            <button onClick={() => updateState({ loggedInUser: null })}>Cerrar sesión</button>
          </div>
        ) : (
          <button onClick={() => updateState({ showLogin: true, showRegister: false })}>Iniciar sesión</button>
        )}
      </nav>

      {showRegister && (
        <div className="form-container">
          <button onClick={() => updateState({ showRegister: false })}>X</button>
          <h2>Registro</h2>
          {formError && <div className="form-error">{formError}</div>}
          <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
          <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
          <button onClick={handleRegister}>Registrar</button>
          <p>¿Ya tienes cuenta? <button onClick={() => updateState({ showLogin: true, showRegister: false })}>Iniciar sesión</button></p>
        </div>
      )}

      {showLogin && (
        <div className="form-container">
          <button onClick={() => updateState({ showLogin: false })}>X</button>
          <h2>Login</h2>
          {formError && <div className="form-error">{formError}</div>}
          <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
          <button onClick={handleLogin}>Entrar</button>
          <p>¿No tienes cuenta? <button onClick={() => updateState({ showRegister: true, showLogin: false })}>Crear cuenta</button></p>
        </div>
      )}

      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="error">{error}</div>}

      <div className="container">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => updateState({ selectedMovie: movie })}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="movie-details">
          <button onClick={() => updateState({ selectedMovie: null })}>X</button>
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.overview}</p>
          <p><strong>Fecha de estreno:</strong> {selectedMovie.release_date}</p>
          <p><strong>Voto promedio:</strong> {selectedMovie.vote_average}</p>
          <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} alt={selectedMovie.title} />
        </div>
      )}

      <div className="pagination">
        <button onClick={() => updateState({ page: page - 1 })} disabled={page === 1}>Anterior</button>
        <span>{`Página ${page} de ${totalPages}`}</span>
        <button onClick={() => updateState({ page: page + 1 })} disabled={page === totalPages}>Siguiente</button>
      </div>
    </div>
  );
}

export default App;
