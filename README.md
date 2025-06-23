# 🎬 NESFLIX – Clon de Netflix con React

**NESFLIX** es una aplicación web inspirada en Netflix, creada con **React** y la API de **The Movie Database (TMDb)**. Permite buscar, filtrar y explorar películas, además de ver sus trailers directamente desde YouTube. El diseño es 100% **responsive**, ideal para escritorio, tablets y móviles.

---

## 🚀 Tecnologías

- **React**  
- **CSS** personalizado  
- **API TMDb** para datos de películas y trailers  
- **npm** para gestión de paquetes  
- **Variables de entorno** (`.env`) para proteger la API key  

---

## 🛠️ Características

- 🔍 **Búsqueda** de películas por título  
- 🎭 **Filtrado** por género  
- 🎞️ **Detalles** de película: sinopsis, fecha, rating  
- ▶️ **Reproductor de trailers** (YouTube)  
- 👥 **Simulación** de registro e inicio de sesión  
- 📱 **Responsive**: adaptada a dispositivos móviles  
- 🧭 **Navbar inteligente**: oculta al hacer scroll hacia abajo y aparece al subir  

---

## 🔐 Configuración de la API Key

1. En la raíz del proyecto, crea un archivo `.env`:
   En la consola con el comando "touch .env" o se puede crear manualmente.
2. Dentro de .env, añade tu clave TMDb (reemplaza con tu propia clave):
   REACT_APP_TMDB_API_KEY=TU_API_KEY_TMDB

3. Añade .env a tu .gitignore:
    # Variables de entorno
    .env

---

## 🧑‍💻 Instalación y ejecución

# 1. Clona el repositorio
git clone https://github.com/tu-usuario/nesflix.git
cd nesflix

# 2. Instala dependencias
npm install

# 3. Ejecuta en modo desarrollo
npm start
Abre http://localhost:3000 en tu navegador.

---

## 📦 Build para producción
npm run build
Esto generará una versión optimizada en la carpeta build/.

📸 Captura de pantalla

🤝 Créditos
Datos e imágenes: TMDb

Desarrolladora: DestinyCisternas.

📄 Licencia
Este proyecto está bajo la licencia MIT.
© 2025 NESFLIX – Todos los derechos reservados.