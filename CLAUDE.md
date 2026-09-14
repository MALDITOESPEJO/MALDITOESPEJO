@AGENTS.md

## Flujo de publicación de MALDITOESPEJO

### Regla canónica

`main` es el estado canónico y acumulado de producción.

Una rama `publish/*` es únicamente una rama temporal de trabajo/preview. Nunca representa por sí sola el estado completo de producción.

### Flujo obligatorio

1. Preparar el artículo y sus evidencias.
2. Crear una rama temporal `publish/*` desde el `main` más reciente.
3. Generar el preview para revisión editorial humana.
4. No publicar ni promocionar esa rama directamente a producción.
5. Esperar la aprobación explícita del editor.
6. Tras la aprobación, actualizar la referencia local/remota de `main`.
7. Integrar únicamente los cambios aprobados sobre el `main` actual.
8. Antes de integrar, comprobar que `main` no haya avanzado y que el cambio no elimine ni sustituya publicaciones existentes.
9. Tras la integración, Vercel debe desplegar el `main` acumulado.
10. La siguiente noticia debe partir siempre del `main` resultante.

### Aprobación humana

La aprobación editorial humana es obligatoria.

La indicación `APROBADO`, `PUBLICAR` o equivalente autoriza la integración del artículo aprobado en `main`, pero no autoriza a omitir las comprobaciones técnicas de integración.

### Regla de seguridad

Nunca:

- promocionar directamente una rama `publish/*` a producción;
- reemplazar `main` por una rama `publish/*`;
- crear una nueva publicación desde una rama `publish/*` anterior;
- asumir que una rama de preview contiene todas las publicaciones existentes;
- sobrescribir o eliminar artículos ya publicados como consecuencia de integrar una noticia nueva.

Si `main` ha avanzado desde que se creó el preview, detener la publicación y rehacer la integración sobre el `main` actual.

### Verificación posterior

Después de integrar una publicación:

- comprobar que el artículo nuevo está presente;
- comprobar que las publicaciones anteriores siguen presentes;
- comprobar que el build de producción corresponde al `main` integrado.

Si alguna comprobación falla, no continuar con la publicación.
