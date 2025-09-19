# Feature: Section-Aware Ask (MVP)

## Goal

Memungkinkan user bertanya tentang materi **langsung dari halaman lesson** dengan konteks section (heading) yang dipilih, lalu melihat jawaban AI di **dialog**.

## Implementation Phases

### Phase 1: UI Components & Context Setup
**Target**: Build foundational UI components and state management

- [ ] Create React Context Provider untuk manage section context state
- [ ] Implement chip component untuk display selected section context
- [ ] Add onClick handler ke heading action button di PortableText
- [ ] Integrate context chip dengan FloatingInput component
- [ ] Test context selection and chip display functionality

### Phase 2: Dialog System
**Target**: Implement dialog untuk display AI responses

- [ ] Create AI Response Dialog component dengan shadcn/ui Dialog
- [ ] Implement loading state dan streaming text display
- [ ] Add dialog trigger dari FloatingInput submit
- [ ] Handle dialog open/close states
- [ ] Test complete UI flow: select context → ask question → view response

### Phase 3: Backend Integration
**Target**: Connect frontend dengan AI processing backend

- [ ] Create API endpoint di Hono backend untuk process AI requests
- [ ] Implement section content extraction dari Sanity
- [ ] Setup streaming response dengan Vercel AI SDK
- [ ] Add authentication dan rate limiting
- [ ] Test end-to-end AI response flow

### Phase 4: Polish & Production Ready
**Target**: Error handling, optimization, dan final testing

- [ ] Add comprehensive error handling
- [ ] Implement loading states dan user feedback
- [ ] Add accessibility features (keyboard navigation, ARIA labels)
- [ ] Performance optimization dan testing
- [ ] Documentation dan deployment preparation

## Existing Components

### FloatingInput Component
**Location**: `app/components/ai-elements/floating-input.tsx`
**Status**: ✅ Complete - Ready for integration
**Features**:
- Floating bottom input dengan modern design
- Support untuk leftSlot (perfect untuk context chips)
- Built-in form handling dan submit functionality
- Responsive design dengan hover/focus animations
- shadcn/ui compatible styling

### PortableText Renderer
**Location**: `app/components/ui/portable-text-renderer.tsx`
**Status**: ⚠️ Partial - Action button exists but no onClick handler
**Current State**:
- LinkableHeading component dengan action button (Zap icon)
- Button positioned absolute dengan hover animations
- Missing: onClick handler untuk set section context
**Required Changes**:
- Add onClick handler yang calls context provider
- Pass section data (title, _key) ke context

### Action Button Implementation
**Location**: `app/components/ui/portable-text-renderer.tsx:L290-L299`
**Current Code**:
```tsx
<Button
  className=" -left-12 absolute top-0 text-green-500 opacity-0 group-hover/h1:opacity-100"
  size={'icon'}
  variant={'ghost'}
>
  <Zap
    className="transition-colors ease-in-out group-hover/h1:fill-green-500 group-hover/h1:text-green-500"
    size={16}
  />
</Button>
```
**Needs**: onClick handler dan context integration

## Scope (MVP)

* ✅ Floating input di bawah halaman (sticky bottom) - **Component ready**
* ⚠️ Portable Text renderer untuk lesson - **Component exists, needs onClick integration**
  * ⚠️ Komponen heading diberi action button - **Button exists, needs handler**
  * ⏳ Klik action button → **set konteks** (section terpilih) ke floating input sebagai **chip**
  * ⏳ Hanya **1 chip aktif** (replace, tidak di-append)
* ⏳ User tetap bisa bertanya **tanpa konteks** (tanpa chip)
* ⏳ Submit pertanyaan → buka **dialog**:
  * ⏳ Tampilkan loading → stream teks jawaban → selesai
* ✅ Tidak ada chat history, thread, atau multi-turn - **By design**

## Out of Scope (MVP)

* RAG global, vector DB, quiz interaktif, Socratic mode.
* Pin di bawah heading, notes/artifacts drawer, atau rekomendasi lanjutan.
* Multi-context (multi chip) dan follow-up thread.

## UX Alur Ringkas

1. User klik icon action button di heading → floating input menampilkan chip “Header A”.
2. User edit/tambah pertanyaan (opsional) → tekan Enter / klik Kirim.
3. Dialog terbuka: **Loading…** → **Jawaban AI** (stream).
4. Tombol di dialog (MVP): **Close**. (Opsional: **Simpan sebagai catatan**).

### States & Behavior

* **Chip** bisa dihapus (X) untuk bertanya tanpa konteks.
* Klik header lain → chip **diganti** (replace).
* Refresh halaman: tidak ada auto-render jawaban lama (ephemeral).
* A11y: Enter untuk submit, Esc untuk menutup dialog.

## Technical Architecture

### State Management dengan React Context

```ts
// Context untuk manage section-aware state
type AskContext = {
  lessonId: string;
  sectionKey?: string;
  title?: string;
} | null;

type AskContextState = {
  context: AskContext;
  setContext: (context: AskContext) => void;
  clearContext: () => void;
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

// Provider component
const AskContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [context, setContextState] = useState<AskContext>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  const setContext = useCallback((newContext: AskContext) => {
    setContextState(newContext);
  }, []);
  
  const clearContext = useCallback(() => {
    setContextState(null);
  }, []);
  
  return (
    <AskContext.Provider value={{ context, setContext, clearContext, isDialogOpen, setDialogOpen }}>
      {children}
    </AskContext.Provider>
  );
};
```

### Frontend Integration

* **RR7 SSR**: Lesson page render PortableText dengan AskContextProvider wrapper
* **PortableText components**: 
  * ✅ Icon button sudah ada di heading
  * ⏳ Tambah `onClick()` handler yang memanggil `setContext({ lessonId, sectionKey, title })`
* **FloatingInput integration**:
  * ⏳ Consume context untuk display chip
  * ⏳ Support chip removal (clear context)
  * ✅ Submit handler sudah tersedia
* **Dialog System**:
  * ⏳ Create AI Response Dialog component
  * ⏳ Integrate dengan context state untuk open/close
  * ⏳ Stream response display dengan loading states

### API Integration

* **Submit Flow**:
  * `POST /api/agent/ask` body: `{ prompt: string, lessonId: string, sectionKey?: string }`
  * Buka dialog, tampilkan stream (Vercel AI SDK `useCompletion` / `useChat` single-turn)

### Backend (Hono + Vercel AI SDK)

* Endpoint minimal: `POST /api/agent/ask`

  * Auth via Clerk (wajib login).
  * Jika `sectionKey` ada:

    * Fetch konten lesson dari Sanity (ambil **array blocks**).
    * **Slice di server**: ambil block si heading (match `_key === sectionKey`) **+ beberapa block sesudahnya** sampai ketemu heading berikutnya (atau max N blok). (Simple & reliable.)
  * Compose prompt:

    * System: “jawab ringkas, bullet-first, contoh praktis, Bahasa Indonesia casual”.
    * User: `heading title + plainText potongan section (jika ada) + pertanyaan user`.
  * Stream teks balik ke FE.
* **Tanpa** vector search / RAG di MVP (biar simpel & murah).

### Logging & Guardrails

* **Rate limit** per user/lesson/section (mis. Upstash Ratelimit) — low effort: 10/min.
* **Token cap** output (mis. 220–300 kata).
* **Event**: `agent.ask.mini` (userId, lessonId, sectionKey|null, duration, tokens).

## Data & Persistensi

* **MVP paling sederhana**: **tidak perlu schema** — jawaban hanya muncul di dialog dan hilang setelah ditutup/refresh.
* **Jika ingin opsi “Simpan sebagai catatan”** (lightweight):

  * Ya, buat **schema minimal** di Sanity (aiArtifact), tapi cukup **teks saja**:

  ```ts
  // /sanity/schemas/aiArtifact.ts (minimal)
  export default {
    name: 'aiArtifact', type: 'document', title: 'AI Artifact',
    fields: [
      { name: 'userId', type: 'string' },
      { name: 'lesson', type: 'reference', to: [{ type: 'lesson' }] },
      { name: 'sectionKey', type: 'string' },          // optional untuk anchor
      { name: 'type', type: 'string', initialValue: 'explainer' },
      { name: 'text', type: 'text' },                  // jawaban AI (plain markdown/text)
      { name: 'createdAt', type: 'datetime',
        initialValue: () => new Date().toISOString() },
    ],
  };
  ```

  * Endpoint tambahan (opsional): `POST /api/artifacts` (create 1 dokumen).

> **Jawaban pertanyaan lo:** “perlu schema type di Sanity?”
> **MVP murni** (tampil di dialog saja) → **tidak perlu**.
> Kalau lo mau tombol **“Simpan sebagai catatan”** → **iya, perlu** schema minimal seperti di atas.

## Acceptance Criteria (MVP)

* [ ] Icon “Tanya” muncul di setiap `h1` (atau `h2` bila diinginkan).
* [ ] Klik icon → chip context muncul di floating input (replace, bukan append).
* [ ] User bisa submit **dengan/ tanpa chip**.
* [ ] Dialog menampilkan loading lalu **stream jawaban teks**.
* [ ] Tidak ada error fatal ketika Sanity tidak mengembalikan section (agent menyatakan “konteks tidak cukup”).
* [ ] (Jika aktif) klik “Simpan sebagai catatan” membuat dokumen `aiArtifact` di Sanity.

## Risiko & Mitigasi

* **Konteks terlalu pendek** → jawaban generik
  Mitigasi: slice 5–8 block setelah heading; fallback “konteks tidak cukup”.
* **Biaya token** → batasi panjang konteks (max chars) + output cap.
* **UX bising** → 1 chip saja + dialog modal (bukan panel chat).
