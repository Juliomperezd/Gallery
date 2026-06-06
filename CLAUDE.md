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
  index.html    ← galería masonry (10 cols) + lightbox + filtros + notas
  upload.html   ← drag & drop upload con tags por batch + sugerencias
  config.js     ← credenciales Supabase + PIN (ya rellenas)
  auth.js       ← overlay de PIN (usa GALLERY_PIN de config.js)
  CLAUDE.md     ← este archivo
```

## Supabase — proyecto "Julio Gallery"
- URL: `https://kqupemycgbpzzkzrsxtw.supabase.co`
- Bucket: `images` (público)
- Tabla: `image_meta` (filename TEXT PK, tags TEXT[], notes TEXT)
- Tabla: `tag_meta` (tag TEXT PK, description TEXT)

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
ALTER TABLE image_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON image_meta FOR SELECT USING (true);
CREATE POLICY "public insert" ON image_meta FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON image_meta FOR UPDATE USING (true);
CREATE POLICY "public delete" ON image_meta FOR DELETE USING (true);
```

## Features implementadas
- [x] Galería masonry 10 columnas (vista de pájaro), responsive
- [x] Soporte de vídeos: autoplay muted loop en grid, controles en lightbox
- [x] Click en imagen/vídeo → lightbox a tamaño completo
- [x] Tags: se añaden en upload (por batch) y se editan desde el lightbox
- [x] Sugerencias de tags existentes como botones pill (upload + editor del lightbox)
- [x] Notas por imagen: campo editable inline en el lightbox, guardado en Supabase
- [x] Filtro por tags en barra sticky (pills, 18px) bajo el header
- [x] Click en tag dentro del lightbox → filtra la galería
- [x] Borrar imagen/vídeo desde el lightbox (borra storage + metadata)
- [x] Upload drag & drop múltiple con progreso
- [x] Drag & drop en index.html → redirige a upload.html con archivos precargados (via IndexedDB)
- [x] Drag & drop en upload.html → sube automáticamente sin pulsar botón
- [x] Tags Manager: crear/renombrar/borrar tags con descripciones y recuento de imágenes
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
