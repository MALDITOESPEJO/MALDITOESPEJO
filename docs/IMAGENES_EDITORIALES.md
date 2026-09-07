# Sistema de imágenes editoriales

## Objetivo

Las imágenes de los artículos se gestionan de forma independiente del texto. El editor puede crear la imagen fuera del repositorio y subirla directamente a `public/images/`.

## Convención obligatoria

El nombre base de la imagen debe ser exactamente igual al nombre del archivo del artículo, cambiando únicamente la extensión.

Ejemplo:

- Artículo: `content/articles/2026-09-07-ejemplo-noticia.md`
- Imagen: `public/images/2026-09-07-ejemplo-noticia.webp`

También se admiten `.avif`, `.jpg`, `.jpeg`, `.png` y `.svg`.

## Asociación automática

`src/data/articles.ts` busca primero una imagen declarada explícitamente mediante `image` en el frontmatter. Si no existe, busca automáticamente en `public/images/` una imagen cuyo nombre base coincida exactamente con el slug del artículo.

Por tanto, para las nuevas noticias no es necesario modificar el Markdown para asociar la imagen: basta con subir el archivo con el nombre correcto.

## Prioridad de formatos

Si existen varias imágenes con el mismo slug, el sistema utiliza esta prioridad:

1. `.webp`
2. `.avif`
3. `.jpg`
4. `.jpeg`
5. `.png`
6. `.svg`

Se recomienda **WebP o AVIF** para imágenes fotográficas/editoriales de producción por rendimiento web.

## Flujo editorial nuevo

1. Se selecciona e investiga la noticia.
2. Se redacta el artículo.
3. El director editorial aprueba el texto.
4. Se crea la imagen de forma independiente.
5. Se sube a `public/images/` usando exactamente el slug del artículo.
6. El cargador editorial detecta automáticamente la imagen.
7. Se verifica la asociación.
8. Se publica.

## Regla de seguridad editorial

Una imagen nunca debe asociarse por similitud semántica, fecha aproximada o coincidencia parcial. La asociación automática requiere coincidencia exacta del slug para evitar que una imagen pueda terminar accidentalmente en otro artículo.
