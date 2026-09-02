# Validación automática de artículos

## Objetivo

MALDITOESPEJO incorpora una primera validación automática del repositorio para detectar errores estructurales antes de que un artículo entre en el flujo editorial.

El validador se ejecuta con:

```bash
npm run validate:articles
```

## Qué comprueba

- existencia y cierre correcto del frontmatter;
- campos obligatorios: `title`, `description`, `date`, `section`, `author`, `type`, `status`;
- formato de fecha `YYYY-MM-DD`;
- secciones editoriales reconocidas;
- correspondencia entre sección y redactor responsable;
- estados editoriales permitidos: `draft`, `review`, `verified`, `published`.

## Qué no comprueba

Esta herramienta no determina si una afirmación es verdadera ni sustituye la cadena de verificación editorial.

No valida automáticamente:

- calidad o autoridad de las fuentes;
- suficiencia de la evidencia;
- corroboración independiente;
- contradicciones materiales;
- atribución correcta de declaraciones;
- revisión humana;
- necesidad de corrección posterior a la publicación.

Por tanto, su función es estructural: responde a **“¿está correctamente preparado el artículo para entrar en el flujo editorial?”**, no a **“¿es verdadera toda la información publicada?”**.

## Regla de autoría

La asignación automática sigue la regla establecida por MALDITOESPEJO:

`SECCIÓN → AUTOR/A RESPONSABLE`

Una discrepancia entre sección y autor bloquea la validación automática. Las excepciones deberán documentarse en el sistema editorial antes de ampliar el validador para admitirlas.

## Principio de diseño

La automatización debe reducir errores mecánicos sin convertir una comprobación técnica en una falsa garantía de verdad.

> **La investigación puede ser compleja; la explicación no debe serlo.**
