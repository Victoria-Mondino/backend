# 🛒 Backend de Gestión de Carritos

## 📜 Descripción
Backend para gestionar carritos de compras usando **Node.js** y **Express**. Permite crear y manejar productos en los carritos.

## 🚀 Tecnologías
- **Node.js**
- **Express**
- **File System** (fs)

## 📂 Estructura del Proyecto
data/ └── carts.json # Almacena información de carritos routes/ └── carts.js # Rutas para gestión de carritos server.js # Archivo principal del servidor

bash
Copiar
Editar

## ⚙️ Instalación
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu_usuario/nombre_del_repositorio.git
Instalar dependencias
bash
Copiar
Editar
npm install
🏗️ Uso
Iniciar el servidor
bash
Copiar
Editar
node server.js
Visita http://localhost:3000.
📬 Rutas Disponibles
POST /api/cart: Crear un nuevo carrito.
POST /api/cart/:cid/product/:pid: Agregar un producto al carrito.
GET /api/cart/:cid: Listar productos en el carrito.
🌟 Contribuciones
¡Contribuciones son bienvenidas! Crea un fork y envía un pull request.

📄 Licencia
Este proyecto está bajo la Licencia MIT.

css
Copiar
Editar

Puedes personalizarlo aún más con colores o íconos si lo deseas, y recuerda ajustar el enlace al repositorio. ¡Espero que te guste!
