# Refs Gallery — Proyecto

## Qué es esto
Galería compartida de imágenes y vídeos de referencia para 4 personas (con PIN). Acceso por link. Inspiración visual: tinyui.org.

## Stack
- **Frontend**: Vanilla HTML + CSS + JS, sin build step
- **Storage + DB**: Supabase (proyecto "Julio Gallery")
- **Hosting**: GitHub Pages → `https://juliomperezd.github.io/Gallery/`
- **Mobile**: iOS Shortcut para subir desde el Share Sheet nativo

## Archivos
```
/Desktop/Gallery/
  index.html    ← galería masonry (10 cols) + lightbox + filtros + notas + modal de upload
  links.html    ← página de links (URL + título + descripción + categorías), filtros por categoría, CRUD
  upload.html   ← página standalone (mantenida para compatibilidad, no es el flujo principal)
  config.js     ← credenciales Supabase + PIN (ya rellenas)
  auth.js       ← overlay de PIN (usa GALLERY_PIN de config.js)
  CLAUDE.md     ← este archivo
```

## Supabase — proyecto "Julio Gallery"
- URL: `https://kqupemycgbpzzkzrsxtw.supabase.co`
- Bucket: `images` (público)
- Tabla: `image_meta` (filename TEXT PK, tags TEXT[], notes TEXT, flow_id TEXT)
- Tabla: `tag_meta` (tag TEXT PK, description TEXT)
- Tabla: `flows` (id TEXT PK, name TEXT, created_at TIMESTAMPTZ)
- Tabla: `links` (id BIGINT PK identity, url TEXT, title TEXT, description TEXT, categories TEXT[], created_at TIMESTAMPTZ)

### SQL ejecutado
```sql
-- Storage policies
CREATE POLICY "public read"   ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "public insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "public delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- image_meta table
CREATE TABLE image_meta (
  filename TEXT PRIMARY KEY,
  tags TEXT[] DEFAULT '{}'
);
ALTER TABLE image_meta ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE image_meta ADD COLUMN IF NOT EXISTS flow_id TEXT;
ALTER TABLE image_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON image_meta FOR SELECT USING (true);
CREATE POLICY "public insert" ON image_meta FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON image_meta FOR UPDATE USING (true);
CREATE POLICY "public delete" ON image_meta FOR DELETE USING (true);

-- flows table
CREATE TABLE IF NOT EXISTS flows (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON flows FOR SELECT USING (true);
CREATE POLICY "public insert" ON flows FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON flows FOR UPDATE USING (true);
CREATE POLICY "public delete" ON flows FOR DELETE USING (true);

-- links table
CREATE TABLE IF NOT EXISTS links (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON links FOR SELECT USING (true);
CREATE POLICY "public insert" ON links FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON links FOR UPDATE USING (true);
CREATE POLICY "public delete" ON links FOR DELETE USING (true);
```

## Features implementadas
- [x] Galería masonry 10 columnas (vista de pájaro), responsive
- [x] Soporte de vídeos: autoplay muted loop en grid, controles en lightbox
- [x] Click en imagen/vídeo → lightbox a tamaño completo
- [x] Tags: se añaden en upload (por batch) y se editan desde el lightbox
- [x] Renombrar tag globalmente desde el editor (botón ✎ → window.prompt → actualiza todas las imágenes y tag_meta)
- [x] Subtags jerárquicos con `/` (ej: `component/button`). Filter bar agrupa por padre con barra secundaria de hijos al activar
- [x] Sugerencias de tags existentes como botones pill (upload + editor del lightbox)
- [x] Notas por imagen: campo editable inline en el lightbox, guardado en Supabase
- [x] Filtro por tags en barra sticky bajo el header
- [x] Click en tag dentro del lightbox → filtra la galería
- [x] Borrar imagen/vídeo desde el lightbox (borra storage + metadata)
- [x] Upload como modal drawer (panel derecho) dentro de index.html — botón "+ Upload" o drag & drop sobre la galería lo abre. Al cerrar recarga la galería automáticamente
- [x] Tags Manager: crear/renombrar/borrar tags con descripciones y recuento de imágenes
- [x] Flows: batch de imágenes agrupadas en 1 celda con badge de conteo. Click abre todas las imágenes en tira horizontal scrolleable, con tags y Edit/Delete por imagen
- [x] Flow card: badge de conteo arriba a la derecha + tira de miniaturas (11px) en la parte inferior con degradado oscuro
- [x] Tag description panel: muestra el nombre del tag como título encima de la descripción al filtrar
- [x] Tags Manager: botón "rename" por tag para renombrar globalmente (además del ✎ de descripción)
- [x] Export: botón "Export" en el header descarga un backup ZIP de toda la librería. Usa JSZip (CDN esm.sh). Estructura: una carpeta por tag (subtags `a/b` → carpetas anidadas) con copia de cada imagen en cada tag que tenga, carpeta `_uncategorized` para las sin tags, y `metadata.json` en la raíz con tags/notas/flows/descripciones para restaurar. Overlay de progreso con cancelar. Pagina el storage list (>500 items)
- [x] Links: página `links.html` con tarjetas (URL + título + descripción + categorías), filtros por categoría (multi-categoría tipo tags), CRUD vía drawer derecho. Categorías por defecto: Design systems, Components, Portfolios. Botón "Links" en el header de la galería + botón "← Gallery" para volver
- [x] PIN de acceso (auth.js)
- [x] Desplegado en GitHub Pages

## Pendiente
- [ ] Crear iOS Shortcut "Add to Refs" (ver instrucciones abajo)

## iOS Shortcut "Add to Refs"
Aparece en el Share Sheet de Fotos. Sube directo al bucket de Supabase.

**Acciones en la app Shortcuts:**
1. **Receive [Images] from [Share Sheet]** — stop if no input
2. **Format Date** — Current Date, formato: `yyyyMMddHHmmss`
3. **Text** — `ref_[Formatted Date]_[Shortcut Input]`
4. **Get Contents of URL**:
   - URL: `https://kqupemycgbpzzkzrsxtw.supabase.co/storage/v1/object/images/[Text]`
   - Method: POST
   - Headers: `Authorization` → `Bearer sb_publishable_WYmpyFGZ6bad4Jy6GfHACQ_ytBufjhb` · `x-upsert` → `false`
   - Request Body: File → Shortcut Input
5. **Show Notification** — `Uploaded to Refs ✓`

**Distribuir**: Shortcut → Share → Copy iCloud Link → mandar a los otros 3.
