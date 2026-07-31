# CRIDALVID Landing

Landing page estatica completa para CRIDALVID, lista para subir a GitHub y desplegar en Vercel.

## Archivos principales

- `index.html`: estructura completa de la pagina.
- `src/css/main.css`: diseno visual responsive.
- `src/js/config.js`: datos editables del negocio.
- `src/js/data.js`: servicios y galeria de proyectos.
- `src/js/main.js`: menu movil, galeria, formularios y WhatsApp.
- `assets/brand/`: favicon, logo y grafica social.
- `assets/projects/`: fotos y video reales del negocio.
- `vercel.json`: configuracion recomendada para Vercel.
- `robots.txt` y `sitemap.xml`: SEO basico.
- `site.webmanifest`: datos para navegador y acceso directo.

## Como probar localmente

Opcion rapida:

1. Abre `index.html` con doble clic.

Opcion con servidor local:

```bash
python -m http.server 5500
```

Luego abre:

```text
http://localhost:5500
```

## Como subir a GitHub

Sube todo el contenido de esta carpeta como raiz del repositorio:

```text
index.html
src/
assets/
vercel.json
robots.txt
sitemap.xml
site.webmanifest
package.json
README.md
```

## Como publicar en Vercel

1. Crea un repositorio en GitHub con estos archivos.
2. En Vercel, elige `New Project`.
3. Importa el repositorio.
4. Framework preset: `Other`.
5. Build command: dejar vacio.
6. Output directory: dejar vacio.
7. Deploy.

## Datos que debes reemplazar

Busca y reemplaza estos marcadores:

- `[NUMERO]`
- `[CORREO]`
- `[CIUDAD]`
- `[CIUDAD Y DIRECCION]`
- `[HORARIO]`
- `[ZONAS]`
- `[ENLACE]`
- `[ANOS]`
- `[CANTIDAD]`

En `src/js/config.js`, cambia:

```js
whatsapp: "[NUMERO]"
```

por el numero real con codigo de pais, por ejemplo:

```js
whatsapp: "593987654321"
```

## Funcionalidades incluidas

- Navegacion por secciones.
- Menu movil accesible.
- Hero comercial.
- Servicios generados desde JavaScript.
- Cotizacion por WhatsApp con mensaje ordenado.
- Postulacion por WhatsApp.
- Galeria con modal.
- Boton flotante de WhatsApp.
- Seccion de privacidad.
- SEO basico.
- Responsive para celular, tablet y escritorio.

No se inventaron testimonios, direccion, estadisticas ni garantias.
