import fs from "node:fs";
import path from "node:path";
import type { Article, SectionSlug } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
const IMAGE_DIR = path.join(process.cwd(), "public", "images");
const IMAGE_EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png", ".svg"] as const;
const VALID_SECTIONS = new Set<SectionSlug>(["actualidad","politica","economia","sociedad","mundo","tecnologia","cartagena","regiondemurcia","mayores","cultura"]);
const LEGACY_PUBLICATION_TIMES: Record<string,string> = {"ceuta-crisis-marruecos-septiembre-2026":"11:07","finlandia-defensa-civil-ejercicio-2026":"11:07","petroleo-economia-mundial-septiembre-2026":"11:07","australia-estados-unidos-cooperacion-pacifico-septiembre-2026":"11:18","india-alipay-upi-septiembre-2026":"11:19","ctrack-acceso-archivos-judiciales-septiembre-2026":"11:19","nueva-york-ia-escuelas-septiembre-2026":"11:19","el-nino-intensidad-2026-2027":"11:20","suecia-elecciones-septiembre-2026":"11:20","openai-hugging-face-incidente-ciberseguridad-septiembre-2026":"16:56","tres-peliculas-espanolas-preseleccionadas-oscar-septiembre-2026":"17:04"};
const PUBLICATION_AUTHOR = "Redacción MALDITOESPEJO";
function parseFrontmatter(markdown:string):Record<string,string>{const match=markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!match)return{};const fields:Record<string,string>={};for(const line of match[1].split(/\r?\n/)){const field=line.match(/^([A-Za-z][\w-]*):\s*(?:\"([\s\S]*)\"|'([\s\S]*)'|(.*))$/);if(field)fields[field[1]]=(field[2]??field[3]??field[4]??"").trim();}return fields;}

/**
 * Soporte para listas YAML simples de cadenas, del tipo:
 *   sources:
 *     - "Ayuntamiento de Murcia"
 *     - "Orden de 31 de octubre de 2024"
 * Cada clave con una lista devuelve un array de strings (comillas quitadas).
 * No soporta listas de objetos anidados; para eso, el string completo de
 * cada item es el "label" de la fuente (ver mapSourcesFromFrontmatter).
 */
function parseFrontmatterLists(markdown:string):Record<string,string[]>{
  const match=markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if(!match)return{};
  const lines=match[1].split(/\r?\n/);
  const lists:Record<string,string[]>={};
  let currentKey:string|null=null;
  for(const line of lines){
    const listItem=line.match(/^\s+-\s*(?:"([\s\S]*)"|'([\s\S]*)'|(.*))$/);
    if(listItem&&currentKey){
      lists[currentKey]=lists[currentKey]??[];
      lists[currentKey].push((listItem[1]??listItem[2]??listItem[3]??"").trim());
      continue;
    }
    const keyOnly=line.match(/^([A-Za-z][\w-]*):\s*$/);
    currentKey=keyOnly?keyOnly[1]:null;
  }
  return lists;
}

function mapSourcesFromFrontmatter(rawSources:string[]|undefined):import("./types").Source[]{
  return (rawSources??[]).map((label)=>({label}));
}

/* Fuentes en formato objeto (id/entity/label/nature/date/url). Devuelve [] si el articulo usa el formato simple de una linea por fuente. */
function parseStructuredSources(markdown:string):import("./types").Source[]{
  const match=markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if(!match)return[];
  const out:Array<Record<string,string>>=[];
  let inSources=false;
  let current:Record<string,string>|null=null;
  const unquote=(v:string)=>v.trim().replace(/^"([\s\S]*)"$/,"$1").replace(/^'([\s\S]*)'$/,"$1").trim();
  for(const line of match[1].split(/\r?\n/)){
    if(/^sources:\s*$/.test(line)){inSources=true;continue;}
    if(!inSources)continue;
    if(/^\S/.test(line)){inSources=false;continue;}
    const first=line.match(/^\s+-\s+([A-Za-z]\w*):\s*(.*)$/);
    if(first){current={};out.push(current);current[first[1]]=unquote(first[2]);continue;}
    const more=line.match(/^\s+([A-Za-z]\w*):\s*(.*)$/);
    if(more&&current)current[more[1]]=unquote(more[2]);
  }
  return out.filter(o=>o.label||o.entity||o.name).map(o=>({id:o.id,entity:o.entity,label:o.label??o.name??o.entity??"",nature:o.nature,date:o.date,url:o.url&&/^https?:\/\//i.test(o.url)?o.url:undefined}) as import("./types").Source);
}

/* Subtitulos de andamiaje editorial (fuentes, estado, pendientes): no se muestran como subtitulo. */
const SCAFFOLD_HEADINGS=new Set(["fuente primaria","que ha ocurrido","hechos clave","fuentes","estado editorial","el dato que queda abierto","proximos datos a vigilar","lo que todavia no se sabe","lo que todavia no puede afirmarse","lo que no se sabe","que sabemos y que no sabemos","que se conoce","que podemos decir y que no"]);
function isNarrativeHeading(block:string):boolean{
  const match=block.match(/^#{2,3}\s+(.+)$/);
  if(!match)return false;
  const key=match[1].trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  return !SCAFFOLD_HEADINGS.has(key);
}
/* Bloques del cuerpo: parrafos y subtitulos narrativos (## / ###). Los titulos H1 y el andamiaje se descartan. */
function markdownBlocks(markdown:string):string[]{
  const blocks=markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/,'').split(/\r?\n\s*\r?\n/).map(block=>block.trim()).filter(block=>block&&(!block.startsWith("#")||isNarrativeHeading(block)));
  // El contenido antiguo puede conservar una firma textual al final del cuerpo.
  // La firma publica se obtiene siempre del modelo Article y debe ser unica.
  return blocks.filter(block=>!/^\*\*[^*]+\s+·\s+\d{1,2}\s+de\s+[a-záéíóúñ]+\s+de\s+\d{4}(?:\s+·\s+\d{1,2}:\d{2}\s*h)?\s*\*\*$/i.test(block));
}
/* Solo parrafos (sin subtitulos): base de keyFacts, que no cambia. */
function markdownBody(markdown:string):string[]{return markdownBlocks(markdown).filter(block=>!block.startsWith("#"));}
function publicationTimestamp(slug:string,meta:Record<string,string>):string{const explicitTime=meta.time?.match(/^(?:[01]\d|2[0-3]):[0-5]\d$/)?.[0];return `${meta.date}T${explicitTime??LEGACY_PUBLICATION_TIMES[slug]??"00:00"}`;}
function findEditorialImage(slug:string,meta:Record<string,string>):string|undefined{
  const explicitImage=meta.image?.trim();
  if(explicitImage)return explicitImage;
  if(!fs.existsSync(IMAGE_DIR))return undefined;
  const files=new Set(fs.readdirSync(IMAGE_DIR));
  const match=IMAGE_EXTENSIONS.map(extension=>`${slug}${extension}`).find(file=>files.has(file));
  return match?`/images/${match}`:undefined;
}
function loadApprovedArticles():Article[]{if(!fs.existsSync(CONTENT_DIR))return[];const loaded:Array<Article|null>=fs.readdirSync(CONTENT_DIR).filter(file=>file.endsWith(".md")||file.endsWith(".mdx")).map(file=>{const markdown=fs.readFileSync(path.join(CONTENT_DIR,file),"utf8");const meta=parseFrontmatter(markdown);const lists=parseFrontmatterLists(markdown);const section=meta.section?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"") as SectionSlug;const paragraphs=markdownBody(markdown);const blocks=markdownBlocks(markdown);if(!["approved","published"].includes(meta.status)||!meta.title||!meta.date||!VALID_SECTIONS.has(section))return null;const slug=file.replace(/\.(md|mdx)$/,'');const imageSrc=findEditorialImage(slug,meta);return {slug,title:meta.title,dek:meta.description??"",section,publishedAt:publicationTimestamp(slug,meta),author:{name:PUBLICATION_AUTHOR},image:imageSrc?{src:imageSrc,alt:meta.title,width:1200,height:675}:undefined,keyFacts:paragraphs.slice(0,4),body:blocks.map(content=>({type:"fact",content})),sources:(()=>{const structured=parseStructuredSources(markdown);return structured.length?structured:mapSourcesFromFrontmatter(lists.sources);})(),relatedArticles:lists.related_articles,isDemo:false} as Article;});return loaded.filter((article):article is Article=>article!==null).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));}
export const articles:Article[]=loadApprovedArticles();
export const baseArticles:Article[]=articles;
export function getArticleBySlug(slug:string):Article|undefined{return articles.find(article=>article.slug===slug);}
