# Refs Gallery — Proyecto

## Qué es esto
Galería compartida de imágenes de referencia para 4 personas (sin autenticación). Acceso por link. Inspiración visual: tinyui.org.

## Stack
- **Frontend**: Vanilla HTML + CSS + JS, sin build step
- **Storage + DB**: Supabase (proyecto "Julio Gallery")
- **Hosting**: pendiente de subir a GitHub Pages
- **Mobile**: iOS Shortcut para subir desde el Share Sheet nativo

## Archivos
```
/Desktop/Gallery/
  index.html    ← galería masonry (10 cols) + lightbox + filtro por tags + borrar
  upload.html   ← drag & drop upload con tags por batch
  config.js     ← credenciales Supabase (ya rellenas)
  CLAUDE.md     ← este archivo
```

## Supabase — proyecto "Julio Gallery"
- URL: `https://kqupemycgbpzzkzrsxtw.supabase.co`
- Bucket: `images` (público)
- Tabla: `image_meta` (filename TEXT PK, tags TEXT[])

### SQL ya ejecutado
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
ALTER TABLE image_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON image_meta FOR SELECT USING (true);
CREATE POLICY "public insert" ON image_meta FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON image_meta FOR UPDATE USING (true);
CREATE POLICY "public delete" ON image_meta FOR DELETE USING (true);
```

## Features implementadas
- [x] Galería masonry 10 columnas (vista de pájaro), responsive
- [x] Click en imagen → lightbox con imagen a tamaño completo
- [x] Tags: se añaden en upload (por batch) y se editan desde el lightbox
- [x] Filtro por tags en barra sticky bajo el header
- [x] Click en tag dentro del lightbox → filtra la galería
- [x] Borrar imagen desde el lightbox (borra storage + metadata)
- [x] Upload drag & drop múltiple con progreso

## Pendiente
- [ ] Subir a GitHub y activar GitHub Pages (para URL pública compartible)
- [ ] Crear iOS Shortcut "Add to Refs" (ver instrucciones abajo)

## Deploy en GitHub Pages (próximo paso)
1. Crear repo en GitHub → subir los 3 archivos (index.html, upload.html, config.js)
2. Settings → Pages → Source: main, `/` root
3. URL resultante: `https://{user}.github.io/{repo}/`

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
