<!--
================================================================================
  TEMPLATE: Coding Guidelines – Nuxt 3 / TypeScript Web App
================================================================================

  Zweck
  -----
  Generisches Template für die verbindlichen Coding-Richtlinien eines Nuxt 3
  Projekts mit Composition API, TypeScript und optionalem Pinia State Management.
  Backend-agnostisch (Appwrite, Supabase, Firebase, REST, Headless CMS oder
  reines Static-Content via @nuxt/content).

  Verwendung
  ----------
  1. Diese Datei nach `.claude/rules/coding-guidelines.md` im Zielprojekt kopieren.
  2. Alle `{{PLATZHALTER}}` ersetzen (siehe Platzhalter-Referenz unten).
  3. Optionale Bausteine (markiert mit `<!-- OPTIONAL: … -->`) entweder ausfüllen
     oder ersatzlos entfernen.
  4. Vor dem Einchecken einmal `grep -n "{{" .claude/rules/coding-guidelines.md`
     ausführen — es darf kein Platzhalter mehr übrig sein.

  Platzhalter-Referenz
  --------------------
  | Platzhalter                       | Beschreibung                                                       | Beispielwert                                            | Pflicht  |
  |-----------------------------------|--------------------------------------------------------------------|---------------------------------------------------------|----------|
  | {{PROJECT_NAME}}                  | Projektname                                                         | meals-web / sergei-blog                                 | ja       |
  | {{PROJECT_TYPE}}                  | App-Typ                                                             | Nuxt 3 Web-App / Multilingual Blog/Portfolio            | ja       |
  | {{PROJECT_DESCRIPTION}}           | 1–2 Sätze zum Projekt                                              | Frei formulieren                                        | ja       |
  | {{RENDERING_MODE}}                | Rendering-Modus                                                     | SPA (`ssr: false`) / SSR (default) / SSG (generate)     | ja       |
  | {{BACKEND}}                       | Backend-Name (oder "keines")                                        | Appwrite Cloud / Supabase / @nuxt/content (statisch)    | ja       |
  | {{BACKEND_CLIENT_COMPOSABLE}}     | Composable/Util für Backend-Zugriff                                 | `useAppwrite()` / `useSupabaseClient()` / `useContent()`| nein     |
  | {{TYPE_FILE_SUFFIX}}              | Suffix für Type-Dateien                                             | `Type.ts` (z. B. `mealType.ts`)                         | ja       |
  | {{BASE_DOC_TYPE}}                 | Basis-Interface für Backend-Dokumente                               | `AppwriteBaseDocument` / `SupabaseRow`                  | nein     |
  | {{COMPONENT_NAMING}}              | Vue-Komponenten-Konvention                                          | `camelCaseComponent.vue` / `PascalCase.vue`             | ja       |
  | {{HELPER_UTILS_LIST}}             | Aufzählung hauseigener Utils                                        | siehe Beispielblock                                     | nein     |
  | {{TAILWIND_TOKEN_HINT}}           | Hinweis auf Custom Tokens in tailwind.config                        | `DCBlue, DCBlueDark, font-headline` / „keine custom Tokens“ | nein |
  | {{I18N_LOCALES_LIST}}             | Liste der Locales                                                   | `en-US, de-DE`                                          | nein     |
  | {{I18N_FILE_PATHS}}               | Pfad der Locale-Dateien                                             | `i18n/locales/*.json`                                   | nein     |
  | {{PROJECT_STRUCTURE_DETAILS}}     | Verzeichnis-Tree                                                    | siehe Beispielblock                                     | ja       |
  | {{IMPORT_ALIAS}}                  | Pfad-Alias                                                          | `~/` (Standard Nuxt) / `@/`                             | ja       |
  | {{QUALITY_GATES_LIST}}            | Liste der Quality-Gate-Befehle                                      | siehe Beispielblock                                     | ja       |
  | {{FEATURES_LIST}}                 | Liste der Features                                                  | Auth, Meals, Shopping / Posts, Projects, Products       | ja       |

  Konfigurations-Schalter
  -----------------------
  Pro Projekt entscheiden:
  - BACKEND_PRESENT:     ja/nein  → Backend-spezifische Sektionen behalten/entfernen
  - PINIA_USED:          ja/nein  → Sektion 4 (State Management) behalten/entfernen
  - CUSTOM_UTILS:        ja/nein  → Util-Helfer-Block in Sektion 1 + Imports
  - I18N_USED:           ja/nein  → Lokalisierungs-Block behalten/entfernen
  - PERMISSIONS_LAYER:   ja/nein  → Permissions-Pattern (Backend mit Row-Level-Security)
  - HEADLESS_UI:         ja/nein  → HeadlessUI-Hinweise behalten/entfernen
  - SSR_MODE:            spa/ssr/ssg → Hinweise je nach Rendering-Modus

================================================================================
-->

# Coding Guidelines — {{PROJECT_NAME}} {{PROJECT_TYPE}}

Verbindliche Referenz für alle Implementierungen, Bugfixes und Refactorings im `{{PROJECT_NAME}}`-Projekt. Alle Änderungen MÜSSEN diesen Richtlinien folgen.

> {{PROJECT_DESCRIPTION}}

---

## 1. Projektarchitektur

### 1.1 Verzeichnisstruktur

```
{{PROJECT_STRUCTURE_DETAILS}}
```

<!-- Beispielblock für PROJECT_STRUCTURE_DETAILS (anpassen):
├── components/          # Vue-Komponenten ({{COMPONENT_NAMING}})
│   └── ui/              # Generische UI-Bausteine (kein Feature-Bezug)
├── composables/         # Wiederverwendbare Logik + Backend-Calls (useXxx.ts)
├── stores/              # Pinia Stores                                    <!-- OPTIONAL -->
├── types/               # TypeScript-Interfaces (xxx{{TYPE_FILE_SUFFIX}})
├── pages/               # Dateibasiertes Routing (kebab-case)
│   └── [param].vue      # Dynamische Routen
├── middleware/          # Route Guards (xxx.global.ts)
├── plugins/             # Nuxt Plugins (NN.name.client.ts — numeriert)
├── layouts/             # default.vue, empty.vue, …
├── utils/               # Reine Hilfsfunktionen ohne Vue-State
│   └── (projektspezifische Helfer — siehe {{HELPER_UTILS_LIST}})
├── content/             # @nuxt/content – Markdown-Inhalte (optional)
└── i18n/locales/        # Locale-Dateien                                  <!-- OPTIONAL -->
-->

### 1.2 Layer-Regeln (PFLICHT)

| Layer                    | Darf                                                  | Darf NICHT                                       |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------------ |
| `pages/` + `components/` | Stores, Composables, `$t()`                           | {{BACKEND}} SDK direkt                           |
| `stores/`                | Composables, `utils/`                                 | {{BACKEND}} SDK direkt                           |
| `composables/`           | `{{BACKEND_CLIENT_COMPOSABLE}}`, `utils/`, andere Composables | Stores (Circular Dependency)             |
| `utils/`                 | Externe Packages, einander                            | Vue-State (`ref`, `reactive`), Stores            |

### 1.3 Datenfluss

```
Page/Component
  → Store (Loading/Error-State) oder Composable direkt
    → Composable (Business-Logik, Backend-Calls)
      → {{BACKEND}} SDK
        → Validierung über utils/ (Type-Guard)
          → TypeScript Interface
```

---

## 2. Dateibenennungen

| Typ          | Konvention                       | Beispiel                              |
| ------------ | -------------------------------- | ------------------------------------- |
| Component    | {{COMPONENT_NAMING}}             | siehe Konvention                      |
| UI-Component | `PascalCase.vue`                 | `CloseButton.vue`, `Calendar.vue`     |
| Composable   | `useXxx.ts`                      | `useMeals.ts`, `useAuth.ts`           |
| Store        | `xxxStore.ts`                    | `authStore.ts`, `teamStore.ts`        |
| Type         | `xxx{{TYPE_FILE_SUFFIX}}`        | `mealType.ts`, `shoppingType.ts`      |
| Util         | beschreibend                     | `errorHandler.ts`, `imageHelpers.ts`  |
| Page         | kebab-case                       | `meal-detail.vue`, `shopping.vue`     |
| Middleware   | `xxx.global.ts`                  | `auth.global.ts`                      |
| Plugin       | `NN.name.client.ts`              | `01.pinia-init.client.ts`             |

---

## 3. Komponenten-Standards (PFLICHT)

### 3.1 Script Setup

```vue
<script setup lang="ts">
// ✅ RICHTIG — immer <script setup lang="ts">
interface Props {
  meal: MealDBType;
  isEditable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isEditable: false,
});

const emit = defineEmits<{
  select: [meal: MealDBType];
  close: [];
}>();
</script>

<!-- ❌ FALSCH -->
<script lang="ts">
export default defineComponent({
  /* Options API */
});
</script>
```

**Regeln:**

- `<script setup lang="ts">` immer — kein Options API, kein `defineComponent()`
- `withDefaults(defineProps<Props>(), {})` für Props mit Default-Werten
- Typsichere Emits: `defineEmits<{ eventName: [arg: Type] }>()`
- Props über `props.xyz` referenzieren oder direkt destructuren mit `toRefs(props)`

### 3.2 Tailwind CSS

```vue
<!-- ✅ RICHTIG -->
<button
  class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
  {{ $t('save') }}
</button>

<!-- ❌ FALSCH -->
<button style="background: #1a3a5c; padding: 8px 16px;">Save</button>
<button :style="{ backgroundColor: color }">Save</button>
```

- Ausschließlich Tailwind-Klassen — kein `style=""` Attribut
- Custom Design Tokens aus `tailwind.config.js`: {{TAILWIND_TOKEN_HINT}}
- Responsive: `sm:`, `md:`, `lg:`-Präfixe — Mobile First
- Prettier sortiert Klassen automatisch via `prettier-plugin-tailwindcss`

<!-- OPTIONAL: HeadlessUI-Hinweis -->
- HeadlessUI-Komponenten ausschließlich mit Prefix `Headless` verwenden (`HeadlessDialog`, `HeadlessMenu`)

<!-- OPTIONAL: Sektion 3.3 entfernen wenn keine Mehrsprachigkeit -->
### 3.3 Internationalisierung

```vue
<!-- ✅ RICHTIG -->
<h1>{{ $t('meals') }}</h1>
<p>{{ $t('mealDescriptionHint') }}</p>

<!-- ❌ FALSCH -->
<h1>My Meals</h1>
<p>Add a short description for your meal.</p>
```

- Alle sichtbaren UI-Strings via `$t('camelCaseKey')`
- Keys: camelCase (`addMeal`, `mealDescription`, `saveMealSuccess`)
- Neue Keys immer in **alle** Locale-Dateien: {{I18N_LOCALES_LIST}}
- Pfad: {{I18N_FILE_PATHS}}
- Keine hartcodierten Strings in Templates oder Script-Blöcken

---

<!-- OPTIONAL: Komplette Sektion 4 entfernen wenn Pinia nicht genutzt wird -->
## 4. State Management (Pinia)

### 4.1 Store-Aufbau

```typescript
// stores/mealStore.ts
import { defineStore } from "pinia";
import { useMeals } from "{{IMPORT_ALIAS}}composables/useMeals";
import type { MealDBType } from "{{IMPORT_ALIAS}}types/mealType";

export const useMealStore = defineStore("meal", {
  state: () => ({
    meals: [] as MealDBType[],
    loading: {
      fetch: false,
      create: false,
      delete: false,
    },
    error: {
      fetch: false,
      create: false,
      delete: false,
    },
    errorMessages: {
      fetch: "",
      create: "",
      delete: "",
    },
  }),

  getters: {
    isLoadingAny(): boolean {
      return Object.values(this.loading).some(Boolean);
    },
    hasAnyError(): boolean {
      return Object.values(this.error).some(Boolean);
    },
  },

  actions: {
    async fetchMeals() {
      this.loading.fetch = true;
      this.error.fetch = false;
      try {
        const { fetch } = useMeals();
        this.meals = await fetch();
      } catch (error) {
        this.error.fetch = true;
        this.errorMessages.fetch = (error as Error).message;
      } finally {
        this.loading.fetch = false;
      }
    },

    clearError(key: keyof typeof this.error) {
      this.error[key] = false;
      this.errorMessages[key] = "";
    },
  },
});
```

**Regeln:**

- Stores **delegieren** an Composables — kein direkter Backend-Code im Store
- Loading/Error/ErrorMessages als strukturierte Objekte mit matching Keys
- `finally`-Block für Loading-Reset sicherstellen
- `clearError()` und `clearErrors()` Hilfsmethoden bereitstellen
- `storeToRefs()` für reaktives Destructuring in Components:

```typescript
const { meals, loading } = storeToRefs(useMealStore());
```

### 4.2 Store-Zugriff (PFLICHT)

```typescript
// ✅ RICHTIG — innerhalb von Composables/Middleware
const store = safeGetStore(() => useMealStore());
if (!store) return;

// ✅ RICHTIG — in Components/Pages (direkt aufrufen)
const mealStore = useMealStore();

// ❌ FALSCH — auf Modul-Ebene (Pinia noch nicht initialisiert)
const mealStore = useMealStore(); // außerhalb von setup/functions
export const store = useMealStore();
```

- `safeGetStore()` aus `utils/storeHelpers.ts` für Middleware, Plugins und Composables
- `isPiniaReady()` als Guard-Check bevor Store-Zugriff in kritischen Pfaden

---

## 5. Composable-Pattern

### 5.1 Aufbau

```typescript
// composables/useMeals.ts
import { ref } from "vue";
import { safeAsync, logError, withRetry } from "{{IMPORT_ALIAS}}utils/errorHandler";
import { validateAndCastDocuments } from "{{IMPORT_ALIAS}}utils/validationHelpers";
import type { MealDBType } from "{{IMPORT_ALIAS}}types/mealType";

const meals = ref<MealDBType[] | null>(null);

export const useMeals = () => {
  const client = {{BACKEND_CLIENT_COMPOSABLE}};
  const config = useRuntimeConfig();

  const fetch = async (): Promise<MealDBType[]> => {
    const { data, error } = await safeAsync(() =>
      client.listDocuments(/* ... */),
    );
    if (error) {
      logError(error, "useMeals.fetch");
      return [];
    }
    const validated = validateAndCastDocuments<MealDBType>(data.documents);
    meals.value = validated;
    return validated;
  };

  return { meals, fetch };
};
```

**Regeln:**

- Composables besitzen **alle** Backend-API-Calls via `{{BACKEND_CLIENT_COMPOSABLE}}` — kein anderer Layer
- `ref<Type | null>(null)` für async geladene Daten
- `safeAsync()` für nullable Operationen, `withRetry()` für timing-sensitive Calls
- Responses immer mit Type-Guard/Validator validieren vor Type-Casting
- Rückgabe als Objekt `{ state, methods }`, kein Array-Destructuring

<!-- OPTIONAL: Permissions-Block – nur bei Backend mit Row-Level-Security/Permissions -->
### 5.2 Permissions (Pflicht bei Datenbankoperationen)

```typescript
import { Permission, Role } from "{{BACKEND}}";
const teamStore = useTeamStore();
const authStore = useAuthStore();

const permissions = [
  Permission.read(Role.team(teamStore.team.$id)),
  Permission.update(Role.user(authStore.account.$id)),
  Permission.delete(Role.user(authStore.account.$id)),
];
```

- Immer Team-Scope für Read-Zugriff + User-Scope für Write/Delete
- Niemals `Role.any()` für sensible Daten

---

## 6. TypeScript

### 6.1 Type-Definitionen

```typescript
// types/mealType.ts

<!-- OPTIONAL: Basis-Interface entfernen, wenn kein gemeinsames Backend-Schema vorhanden -->
// Basis für alle Backend-Dokumente — einmal definieren, nie duplizieren
export interface {{BASE_DOC_TYPE}} {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

// Domain-Interface (reine Business-Logik)
export interface Meal {
  name: string;
  description: string;
  tags: string[];
  ingredients: ShoppingItem[];
  imageUrl: string;
  imageId: string;
}

// DB-Typ = Domain + Backend-Basis via Intersection
export type MealDBType = Meal &
  {{BASE_DOC_TYPE}} & {
    ingredients: ShoppingItemDBType[];
  };
```

**Regeln:**

- Kein `any` — bei dynamischen Typen `unknown` + Type Guard verwenden
- `{{BASE_DOC_TYPE}}` (falls vorhanden) für alle DB-Modelle via Intersection erweitern
- Interfaces für Props, Emits, Store-State, API-Responses
- Enums für feste Wertmengen (z. B. Status, Kategorie)
- Backend-Responses **immer** validieren:

```typescript
// ✅ RICHTIG
const meal = validateAndCastDocument<MealDBType>(doc);

// ❌ FALSCH
const meal = doc as MealDBType;
const meal = doc as any;
```

---

## 7. Error Handling

### 7.1 Zentralisiertes Pattern

```typescript
import { safeAsync, withRetry, logError, createAppError } from '{{IMPORT_ALIAS}}utils/errorHandler'

// safeAsync — für nicht-kritische Operationen (gibt null zurück statt zu werfen)
const { data, error } = await safeAsync(() => client.listDocuments(/* ... */))
if (error) {
  logError(error, 'useMeals.fetch')
  return []
}

// withRetry — für timing-sensitive Operationen (Auth, File Upload)
const session = await withRetry(
  () => client.createSession(email, password),
  { maxRetries: 3, baseDelay: 1000 },
)

// createAppError — für manuelle Fehler mit Kontext
throw createAppError(new Error('Team not found'), 'Team muss vorhanden sein')
```

**Regeln:**

- `createAppError()`, `safeAsync()`, `withRetry()`, `logError()` aus `utils/errorHandler.ts`
- Backend-Calls immer in `safeAsync()` oder `try/catch` mit `logError()`
- Kein Rethrow ohne Wrapping — rohe Backend-Errors nie direkt weiterschmeißen
- `withRetry()` für: Auth-Session-Validation, File-Uploads, Network-Calls bei App-Start

<!-- OPTIONAL: Sektion 7.2 entfernen wenn Pinia nicht genutzt -->
### 7.2 Store Error-Pattern

```typescript
async createMeal(meal: Meal) {
  this.loading.create = true
  this.error.create = false
  try {
    const { create } = useMeals()
    await create(meal)
  } catch (error) {
    this.error.create = true
    const appError = createAppError(error, 'Meal konnte nicht erstellt werden')
    this.errorMessages.create = appError.message
    logError(appError, 'mealStore.createMeal')
  } finally {
    this.loading.create = false
  }
}
```

---

## 8. Vue 3 Best Practices

### 8.1 Reaktivität

```typescript
// ✅ computed() für abgeleiteten State
const filteredMeals = computed(() =>
  meals.value?.filter((m) => m.name.includes(searchQuery.value)) ?? [],
)

// ✅ Immutable State-Updates — spreaden statt in-place mutieren
meals.value = [...meals.value, newMeal]
meals.value = meals.value.map((m) => (m.$id === id ? { ...m, name } : m))

// ❌ Direkte Mutation
meals.value.push(newMeal)
meals.value[0].name = 'new'

// ✅ watch() nur für echte Side-Effects
watch(userId, async (id) => { if (id) await fetchUserData(id) })

// ❌ watch() für abgeleiteten State — stattdessen computed()
watch([meals, filter], () => { filteredMeals.value = meals.value.filter(...) })
```

### 8.2 Templates

```vue
<!-- ✅ v-for immer mit :key (eindeutige ID, nicht Index) -->
<MealCard v-for="meal in meals" :key="meal.$id" :meal="meal" />

<!-- ❌ Index als Key -->
<MealCard v-for="(meal, index) in meals" :key="index" />

<!-- ✅ Komplexe Logik in computed auslagern -->
<span>{{ formattedDate }}</span>
<!-- computed property -->

<!-- ❌ Logik im Template -->
<span>{{ new Date(meal.$createdAt).toLocaleDateString('de-DE') }}</span>
```

---

## 9. DRY / KISS / Clean Code

### DRY — Don't Repeat Yourself

- Wiederholte Backend-Logik in Composables extrahieren, nie duplizieren
- Gleiche Validierungslogik gehört in `utils/validationHelpers.ts`
- Gleiche Fehlerbehandlung nutzt `utils/errorHandler.ts`
- Gemeinsame UI-Muster als eigene Component auslagern
- `{{BASE_DOC_TYPE}}` einmal definieren — überall importieren

### KISS — Keep It Simple, Stupid

- Einfachste Implementierung die die Anforderung erfüllt
- Keine vorzeitigen Abstraktionen — drei ähnliche Zeilen sind besser als eine überdachte Abstraktion
- Keine Feature-Flags oder Backward-Compatibility-Shims wenn direktes Ändern möglich ist
- Keine generischen „Wrapper" für einfache Operationen

### Clean Code

- Aussagekräftige Namen — keine Abkürzungen außer etablierten (`id`, `url`, `i18n`, `db`)
- Eine Funktion = eine Aufgabe
- Keine Magic Strings/Numbers — Konstanten oder Enum-Werte nutzen
- Keine auskommentierten Code-Blöcke
- Keine ungenutzten Imports oder Variablen
- Funktionen kurz halten (max. ~30 Zeilen) — bei Überschreitung aufteilen

---

## 10. Plugins und Middleware

### 10.1 Plugin-Struktur

```typescript
// plugins/02.auth.client.ts
export default defineNuxtPlugin({
  name: "auth-init",
  dependsOn: ["pinia-init"], // Reihenfolge über dependsOn, nicht nur über Nummerierung
  async setup() {
    if (import.meta.server) return; // Client-only Plugins explizit guarden

    const pinia = getActivePinia();
    if (!pinia) {
      console.error("Pinia not available in auth-init plugin");
      return;
    }
    // init logic...
  },
});
```

### 10.2 Middleware-Struktur

```typescript
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  if (!isPiniaReady()) return; // Safe guard

  const auth = safeGetStore(() => useAuthStore());
  if (!auth) return;

  const publicRoutes = ["/login", "/registration", "/forgotpw"];
  if (publicRoutes.includes(to.path)) return;

  const isValid = await auth.validSession();
  if (!isValid)
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
});
```

---

## 11. Hauseigene Helpers

{{HELPER_UTILS_LIST}}

<!-- Beispielblock für HELPER_UTILS_LIST (anpassen oder Sektion entfernen):

- `utils/errorHandler.ts` — `createAppError`, `withRetry`, `safeAsync`, `logError`
- `utils/validationHelpers.ts` — `validateAndCastDocument`, `safeJsonParse`
- `utils/storeHelpers.ts` — `safeGetStore`, `isPiniaReady`, `waitForStore`
- `utils/cacheHelpers.ts` — `SmartDataFetcher`, `OptimisticUpdater`
- `utils/imageCompressor.ts` — Browser-seitige Bildkomprimierung
-->

**Regeln zum Hinzufügen neuer Helpers:**

- Neue Util-Module nur, wenn ≥ 2 Stellen sie nutzen
- Keine Vue-Reaktivität in `utils/` (kein `ref`/`reactive`)
- Pure Funktionen bevorzugen — Side-Effects nur explizit dokumentieren
- TypeScript-Generics für wiederverwendbare Validierungen/Caches

---

## 12. Anti-Patterns (NICHT verwenden)

| Anti-Pattern                                            | Stattdessen                                              |
| ------------------------------------------------------- | -------------------------------------------------------- |
| `style=""` Attribut                                     | Tailwind-Klassen                                         |
| `{{BACKEND_CLIENT_COMPOSABLE}}` in Components/Pages     | Nur in Composables                                       |
| Store auf Modul-Ebene aufrufen                          | `safeGetStore()` in utils/middleware, direkt in setup()  |
| `as any` oder `as Type` ohne Validierung                | `validateAndCastDocument<T>()`                           |
| Hartcodierte UI-Strings                                 | `$t('key')`                                              |
| `watch()` für berechneten State                         | `computed()`                                             |
| Options API / `defineComponent()`                       | `<script setup lang="ts">`                               |
| `v-for` ohne `:key` oder mit Index-Key                  | `:key="item.$id"`                                        |
| Relative Imports (`../`)                                | Alias `{{IMPORT_ALIAS}}composables/...`                  |
| `any` Type                                              | `unknown` + Type Guard                                   |
| Backend-Response ohne Validierung casten                | `validateAndCastDocument<T>()`                           |
| `console.log` in Produktion                             | `logError()` aus `errorHandler.ts`                       |
| Direkte State-Mutation (`array.push()`)                 | Immutable Updates (`[...array, item]`)                   |

---

## 13. Quality Gates (nach JEDER Änderung)

{{QUALITY_GATES_LIST}}

<!-- Beispielblock für QUALITY_GATES_LIST (anpassen):

```bash
# 1. TypeScript Build — Muss fehlerfrei durchlaufen
npm run build

# 2. Type Check — bei Typ-Änderungen
npx nuxi typecheck

# 3. Prettier Formatierung
npx prettier --write .

# 4. Inline-Styles — Muss 0 Treffer haben
grep -rn 'style="' components/ pages/

# 5. any-Type — Muss 0 Treffer haben
grep -rn ': any' composables/ stores/ types/ utils/
grep -rn 'as any' composables/ stores/ types/ utils/

# 6. Direkter Backend-Zugriff in UI — Muss 0 Treffer haben
grep -rn '{{BACKEND_CLIENT_COMPOSABLE}}' components/ pages/
```
-->

---

## 14. Checkliste neue Features

1. [ ] Type-Interface in `types/xxx{{TYPE_FILE_SUFFIX}}` definieren (ggf. `{{BASE_DOC_TYPE}}` erweitern)
2. [ ] Composable `composables/useXxx.ts` mit allen Backend-Calls erstellen
3. [ ] <!-- OPTIONAL --> Store `stores/xxxStore.ts` mit Loading/Error-State-Pattern anlegen
4. [ ] Store delegiert an Composable — kein direkter {{BACKEND}}-Zugriff
5. [ ] Component `components/xxx*.vue` mit `<script setup lang="ts">`
6. [ ] Page `pages/xxx.vue` — nur Stores/Composables aufrufen
7. [ ] <!-- OPTIONAL --> i18n-Keys in alle Locale-Dateien ({{I18N_LOCALES_LIST}})
8. [ ] <!-- OPTIONAL --> Permissions: Team-/User-Scope bei allen DB-Operationen
9. [ ] Error Handling: `safeAsync()` / `withRetry()` + `logError()` an allen kritischen Stellen
10. [ ] Quality Gates ausführen: Build, TypeCheck, Prettier, grep-Checks

---

<!--
================================================================================
  Anpassungs-Anleitung (nach dem Kopieren ins Zielprojekt durchgehen)
================================================================================

  1. Kopf
     - Titel, {{PROJECT_NAME}}, {{PROJECT_TYPE}}, {{PROJECT_DESCRIPTION}} setzen.

  2. Projektarchitektur (Sektion 1)
     - {{PROJECT_STRUCTURE_DETAILS}}: vollständigen Tree einfügen.
     - Layer-Regeln-Tabelle: ggf. Zeile für `stores/` entfernen, wenn Pinia nicht genutzt.
     - Datenfluss: bei statischem Content (z. B. @nuxt/content) den Backend-Schritt anpassen.

  3. Backend-Referenzen
     - {{BACKEND}} setzen oder durch "keines" ersetzen.
     - {{BACKEND_CLIENT_COMPOSABLE}}: bei keinem Backend Sektion 5 vereinfachen oder ersetzen.

  4. Komponenten-Standards (Sektion 3)
     - {{TAILWIND_TOKEN_HINT}}: Liste der Custom Tokens oder Hinweis "keine".
     - 3.3 (i18n): entfernen bei nicht-mehrsprachigen Projekten.
     - HeadlessUI-Hinweis entfernen wenn nicht genutzt.

  5. Pinia (Sektion 4)
     - Komplette Sektion entfernen, wenn Pinia nicht genutzt wird.
     - Andernfalls Beispiele auf eigene Stores anpassen.

  6. Composables (Sektion 5)
     - Permissions-Block 5.2 entfernen, wenn das Backend keine Row-Level-Security/Permissions hat.

  7. Types (Sektion 6)
     - {{BASE_DOC_TYPE}}: setzen oder Block entfernen.
     - {{TYPE_FILE_SUFFIX}}: an Projekt-Konvention anpassen.

  8. Helpers (Sektion 11)
     - {{HELPER_UTILS_LIST}}: tatsächliche Util-Module aufzählen oder Sektion entfernen.

  9. Quality Gates (Sektion 13)
     - {{QUALITY_GATES_LIST}}: projektspezifische Befehle einsetzen.

  10. Anti-Patterns & Checkliste (Sektion 12, 14)
      - Optional-Zeilen entsprechend der Projekt-Schalter behalten/streichen.

  11. Final Check
      - `grep -n "{{" .claude/rules/coding-guidelines.md` darf keine Treffer liefern.
      - Alle HTML-Kommentare ("OPTIONAL", "Beispielblock", diese Anleitung) entfernen.

================================================================================
-->
