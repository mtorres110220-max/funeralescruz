# Funerales Cruz — sitio web estático

Sitio informativo hecho con HTML, CSS y JavaScript puro. No requiere Node.js, instalación de paquetes, compilación ni servidor backend.

## Probar en tu computadora

1. Descomprime el ZIP.
2. Abre la carpeta `funerales-cruz`.
3. Abre `index.html` en tu navegador. Para probarlo con un servidor local, abre una terminal en esa carpeta y ejecuta `python -m http.server 8000`; luego visita <http://localhost:8000>.

Mantén juntos `index.html`, `styles.css`, `script.js` y la carpeta `assets`.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `funerales-cruz`.
2. Sube el contenido de esta carpeta al nivel raíz del repositorio (de modo que `index.html` quede en la raíz, no dentro de otra carpeta).
3. En el repositorio, entra a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/(root)`, y guarda.
6. Espera a que termine la publicación; GitHub mostrará la URL del sitio en esa misma sección.

Si publicas desde un repositorio de proyecto, GitHub Pages normalmente asigna una URL del tipo `https://TU-USUARIO.github.io/funerales-cruz/`. Los enlaces internos y las rutas a `assets/` de este proyecto son relativas para funcionar desde una subruta. No subas claves privadas ni datos sensibles al repositorio.

## Editar el sitio

- Textos, servicios, teléfonos, direcciones y enlaces: `index.html`.
- Colores, tipografía, tamaños y adaptación móvil: `styles.css`. El bloque de variables de marca está al comienzo; los refinamientos premium están en la mitad y la **edición azul** (paleta, carrusel y animaciones) está al final del archivo, así que es el que manda.
- Menú móvil, navegación activa, carrusel de servicios, animaciones de scroll y año del pie de página: `script.js`.
- Fotografía de portada: reemplaza `assets/hero-lirios.jpg`. Si cambias la imagen, actualiza el texto `alt` de `.hero-image`.
- Logo: `assets/logo.png`.

## Estructura de la página

El orden de las secciones (tal como aparecen en `index.html` y en el menú) es:

1. `#inicio` — portada con la llamada a WhatsApp.
2. Franja de confianza.
3. `#nosotros` — nuestra historia (2021) y trayectoria.
4. `#servicios` — carrusel de servicios + botón **Cotizar ahora**.
5. `#proposito` — **misión, visión 2030 y los seis valores** (se movieron aquí para que no queden tan arriba).
6. `#sucursales` — tarjetas con mapa de San Pedro Sula y Villanueva.
7. `#contacto` — banda de contacto y pie de página.

Para reordenar: mueve el bloque `<section>` completo dentro de `<main>`; no hace falta tocar nada más, salvo el enlace del menú si la sección tiene `id`.

## Carrusel y catálogo

La sección **Servicios** es un carrusel que avanza solo cada pocos segundos y se pausa al pasar el mouse o al usarlo con el teclado. Las **flechas quedan ancladas a los extremos del carrusel** (a los lados de las tarjetas en escritorio y tablet; abajo, a izquierda y derecha, en móvil, con los puntos al centro) y también se puede deslizar con el dedo. Debajo está el botón **Cotizar ahora**, que abre <https://funerales-cruz.kyte.site/es> en una pestaña nueva.

Para cambiar el destino: busca `funerales-cruz.kyte.site` en `index.html`. Para agregar o quitar servicios, edita la lista de tarjetas `.service-card` dentro de `<section class="section services">`; el número de tarjetas visibles lo define la variable `--per-view` en `styles.css` (4 en escritorio, 3 en tableta pequeña, 2 en móvil y 1 en pantallas pequeñas).

## Contacto y mapas

WhatsApp: +504 9754-4604. Llamadas: +504 9772-3198 y +504 9754-4604. Los botones de WhatsApp (menú, portada, banda de contacto y el botón flotante) abren una conversación con el mensaje de siempre; la sección de servicios ya no redirige a WhatsApp, sino que invita a **Cotizar ahora**.

Los mapas usan estas coordenadas:
- San Pedro Sula: 15.4998329, -88.0303046.
- Villanueva: 15.3131545, -87.9907215.

Las direcciones de San Pedro Sula, Villanueva, Marale, Yorito y Tegucigalpa, así como misión, visión, valores y servicios, se conservaron del contenido original del proyecto.

## Diseño y dependencias

El diseño usa la **paleta azul de la marca**: azul profundo `#082C50` y azul `#175C91` como color principal, fondo papel azulado `#F5F8FB`, oro `#D9B96E` como acento secundario (coincide con el logotipo) y esquinas redondeadas, con **Fraunces** (títulos) y **Nunito Sans** (textos). Las variables están al inicio del bloque final de `styles.css`: cambia `--navy`, `--blue`, `--clay` y `--gold` para ajustar toda la página de una sola vez.

Incluye animaciones ligeras, sin librerías:

- **Portada:** los bloques entran en escalonado al cargar (título, texto, botones).
- **Scroll:** cada bloque aparece al entrar en pantalla con un desplazamiento suave y un retardo escalonado (110 ms entre elementos hermanos).
- **Carrusel:** las tarjetas suben una tras otra cuando la sección aparece.
- **Botones:** una onda al presionarlas.

Todas se desactivan automáticamente si el sistema tiene activada la opción de *reducir movimiento*; sin JavaScript la página queda visible y funcional.

Google Fonts, Google Maps, WhatsApp y los enlaces a Google Maps requieren conexión a internet; las fuentes incluyen alternativas locales.

La imagen de portada es una imagen decorativa y no representa instalaciones reales de Funerales Cruz. El sitio no contiene formulario ni recopila datos: las consultas se dirigen directamente a llamadas o WhatsApp.
