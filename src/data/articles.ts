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
function markdownBody(markdown:string):string[]{return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/,'').split(/\r?\n\s*\r?\n/).map(block=>block.trim()).filter(block=>block&&!block.startsWith("#"));}
function publicationTimestamp(slug:string,meta:Record<string,string>):string{const explicitTime=meta.time?.match(/^(?:[01]\d|2[0-3]):[0-5]\d$/)?.[0];return `${meta.date}T${explicitTime??LEGACY_PUBLICATION_TIMES[slug]??"00:00"}`;}
function findEditorialImage(slug:string,meta:Record<string,string>):string|undefined{
  const explicitImage=meta.image?.trim();
  if(explicitImage)return explicitImage;
  if(!fs.existsSync(IMAGE_DIR))return undefined;
  const files=new Set(fs.readdirSync(IMAGE_DIR));
  const match=IMAGE_EXTENSIONS.map(extension=>`${slug}${extension}`).find(file=>files.has(file));
  return match?`/images/${match}`:undefined;
}
function loadApprovedArticles():Article[]{if(!fs.existsSync(CONTENT_DIR))return[];const loaded:Array<Article|null>=fs.readdirSync(CONTENT_DIR).filter(file=>file.endsWith(".md")||file.endsWith(".mdx")).map(file=>{const markdown=fs.readFileSync(path.join(CONTENT_DIR,file),"utf8");const meta=parseFrontmatter(markdown);const lists=parseFrontmatterLists(markdown);const section=meta.section?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"") as SectionSlug;const paragraphs=markdownBody(markdown);if(!["approved","published"].includes(meta.status)||!meta.title||!meta.date||!VALID_SECTIONS.has(section))return null;const slug=file.replace(/\.(md|mdx)$/,'');const imageSrc=findEditorialImage(slug,meta);return {slug,title:meta.title,dek:meta.description??"",section,publishedAt:publicationTimestamp(slug,meta),author:{name:PUBLICATION_AUTHOR},image:imageSrc?{src:imageSrc,alt:meta.title,width:1200,height:675}:undefined,keyFacts:paragraphs.slice(0,4),body:paragraphs.map(content=>({type:"fact",content})),sources:mapSourcesFromFrontmatter(lists.sources),relatedArticles:lists.related_articles,isDemo:false} as Article;});return loaded.filter((article):article is Article=>article!==null).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));}
export const articles:Article[]=loadApprovedArticles();
export const baseArticles:Article[]=articles;
export function getArticleBySlug(slug:string):Article|undefined{return articles.find(article=>article.slug===slug);}
