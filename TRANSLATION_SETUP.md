# Google Cloud Translation — Setup Guide

The Federal Ministry of Defence website ships with a production-ready translation layer powered by the **Google Cloud Translation API (v2)**. It supports **English, Hausa, Igbo, Yoruba, French, Spanish and Chinese (Simplified)** out of the box, caches every translation in `localStorage`, falls back gracefully to English on any failure, and updates the page live without a reload.

---

## 1. Enable the API in Google Cloud Console

1. Open the Cloud Console — <https://console.cloud.google.com/>.
2. Create (or select) a project for the Ministry, e.g. `fmod-website-prod`.
3. Enable billing on the project (Cloud Translation is a metered service).
4. Open the API library — <https://console.cloud.google.com/apis/library/translate.googleapis.com> — and click **Enable**.

## 2. Create an API key

1. Open **APIs & Services → Credentials** — <https://console.cloud.google.com/apis/credentials>.
2. Click **+ Create credentials → API key**.
3. Copy the generated key string (looks like `AIzaSy…`).

## 3. Restrict the key

1. Click the key → **Edit API key**.
2. Under **Application restrictions** choose **HTTP referrers** and add `https://defence.gov.ng/*` and `https://*.defence.gov.ng/*`. For local testing add `http://localhost/*` and `http://127.0.0.1/*`.
3. Under **API restrictions** → **Restrict key** → tick **Cloud Translation API**.

## 4. Paste the key into the site config

Open `website/assets/js/config.js` and put the key on the API-key line:

```js
window.MOD_CONFIG = {
  GOOGLE_TRANSLATE_API_KEY: "AIzaSy…paste-your-key-here",
  LANGUAGES: { "en": "English", "ha": "Hausa", "ig": "Igbo", "yo": "Yoruba", "fr": "Français", "es": "Español", "zh-CN": "中文 (简体)" },
  DEFAULT_LANG: "en",
};
```

That is the only file you need to touch.

## 5. (Optional) Environment-variable injection

If you build through CI/CD and want the key in an environment variable rather than committed to git:

```sh
# In your build step:
sed "s|__GT_KEY__|${GOOGLE_TRANSLATE_API_KEY}|" \
    website/assets/js/config.template.js \
  > website/assets/js/config.js
```

…where `config.template.js` has `GOOGLE_TRANSLATE_API_KEY: "__GT_KEY__"`.

## 6. Required packages

The site is **static HTML + vanilla JS** — no `npm install` required. Everything is bundled:

- `assets/js/config.js` — settings (only file you edit)
- `assets/js/i18n.js` — translation runtime
- `assets/js/partials.js` — injects the `<select class="lang-select">` dropdown into every page

---

## How it works

```
config.js  ─►  sets MOD_CONFIG.GOOGLE_TRANSLATE_API_KEY + languages
i18n.js    ─►  reads saved language from localStorage
                walks every visible text node + placeholder/aria-label/alt/title
                dedupes phrases, batches 100 per request, caches every result
                swaps text in place, MutationObserver re-translates new content
                falls back to English if the key is missing or any request fails
```

### Public API

```js
MOD_I18N.translatePage("fr");                    // translate live, no reload
await MOD_I18N.translateText("Welcome", "ha");   // translate a single string
MOD_I18N.current;                                // current language code
```

### Adding more languages

Edit one object — everything else reads from it:

```js
LANGUAGES: {
  "en":  "English",
  "ha":  "Hausa",
  "ar":  "العربية",      // ← add new language
  "pt":  "Português",
}
```

The dropdown rebuilds itself.

### What gets translated

All visible text in navbar, buttons, forms, headings, descriptions, footer, cards, modals, notifications — plus `placeholder`, `aria-label`, `alt` and `title` attributes. New nodes injected at runtime (chatbot replies, async news) are picked up by a `MutationObserver`.

### What is skipped

`<code>`, `<pre>`, `<script>`, `<style>`, anything under `[data-i18n-skip]`, the language dropdown itself, pure numbers/punctuation.

### Performance & quota

- One batched request per language, not per phrase. Most pages translate in 1 API call.
- Cache survives navigation — second switch is instant.
- Cloud Translation bills ≈ $20 per 1M characters. With caching, a full site translated into six secondary languages typically uses ~600 000 characters one-time.

### Accessibility

- The dropdown is a native `<select>` — full keyboard & screen-reader support.
- A live region announces "Translating…" while a request is in flight.
- `<html lang="…">` is updated to the chosen language so screen readers switch voice profiles.

### Fallback chain

1. localStorage cache hit → instant.
2. Cloud Translation API success → translate, cache.
3. Cloud Translation API failure → log warning, leave English in place.
4. New DOM nodes → MutationObserver runs the same chain.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Dropdown shows but nothing translates | DevTools → Network. A 403 means the key is missing/wrong/restricted. |
| 429 / "Quota exceeded" | Cloud Console → Quotas — raise the daily cap. |
| Translations look stale after a content edit | Cache keys on the English string. New copy = new request on next switch. To purge: `localStorage.removeItem("mod-i18n-cache-v1")`. |

That's it — drop your key into `assets/js/config.js`, deploy, and the dropdown does the rest.
