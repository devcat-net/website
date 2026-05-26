# Agent-Templates

Dieses Verzeichnis enthält wiederverwendbare Templates für Claude-Code-Subagenten. Jedes Template ist projektneutral aufgebaut und wird über klar markierte `{{PLATZHALTER}}` an ein konkretes Projekt angepasst.

## Verfügbare Templates

| Template | Datei | Zweck |
| --- | --- | --- |
| Business Analyst | [business-analyst.md](agents/business-analyst.md) | Wandelt User Stories und Epics in strukturierte Use-Case-Dokumente um |
| Solution Architect | [solution-architect.md](agents/solution-architect.md) | Erstellt deutschsprachige Lösungskonzepte (Ist-/Soll-Zustand, Diagramme, Maßnahmenkatalog, Risiken) |
| Realisierungsplan | [realisierungsplan.md](agents/realisierungsplan.md) | Übersetzt freigegebene Lösungskonzepte in atomare, validierbare Schritt-für-Schritt-Pläne |
| Developer – Flutter | [developer-flutter.md](agents/developer-flutter.md) | Implementiert Realisierungspläne / Features schrittweise in Flutter (Riverpod, GoRouter, Quality Gates, Git-Workflow) |
| Developer – Nuxt/TS | [developer-nuxt.md](agents/developer-nuxt.md) | Implementiert Lösungskonzepte / Features schrittweise in Nuxt 3 (Composables, optional Pinia/Figma/Findings) |
| Coding Guidelines – Flutter | [coding-guidelines-flutter.md](rules/coding-guidelines-flutter.md) | Verbindliche Coding-Richtlinien für Flutter/Riverpod-Projekte (Clean Architecture, optional Offline-First) |
| Coding Guidelines – Nuxt/TS | [coding-guidelines-nuxt.md](rules/coding-guidelines-nuxt.md) | Verbindliche Coding-Richtlinien für Nuxt 3 / TypeScript-Projekte (Composable-first, optional Pinia) |

---

## Business-Analyst-Agent

### Was macht der Agent?

Der `business-analyst` Subagent übernimmt die Rolle eines Requirements Engineers. Er nimmt vage Anforderungen entgegen — User Stories, Epics, mündlich formulierte Wünsche — und überführt sie in **strukturierte, technologie-bewusste Use-Case-Dokumente**.

**Eingabe (vom Nutzer):**
- Einzelne User Story (z. B. "Als Nutzer möchte ich meine Gewohnheiten mit Freunden teilen")
- Mehrere User Stories zu einem Feature
- Epic (z. B. "Kalender-Integration mit Habit-Planung")
- Optional: Figma-Links, bestehender Code als Referenz

**Ausgabe (vom Agent):**
- Markdown-Datei pro Use Case unter `docs/usecases/<feature>/UC-…md`
- Vollständige 14-Abschnitte-Struktur: Metadaten, Vorbedingungen, Nachbedingungen, Komponentendiagramm, Sequenzdiagramm (Mermaid), Alternative Abläufe, Fehlerbehandlung, Datenmodell, UI/UX-Spezifikation, Gherkin-Testszenarien, verwandte Use Cases, Implementierungsreferenzen, Änderungshistorie
- Aktualisierter Index in `docs/usecases/README.md`
- Bei Epics: zunächst Übersicht aller resultierenden Use Cases zur Bestätigung, danach Detailausarbeitung

**Arbeitsweise:**
1. Liest README und bestehende Use Cases, um die nächste freie UC-ID zu finden
2. Exploriert die Codebase, um aktuelles Verhalten zu verstehen
3. Stellt gebündelt bis zu 6 Rückfragen (Akteure, Ziel, Scope, Fehlerfälle, Priorität)
4. Erarbeitet den Use Case nach festem Schema
5. Stellt das Ergebnis zur Freigabe vor — keine eigenmächtige Übergabe

Der Agent arbeitet durchgehend **auf Deutsch** und produziert **keinen Code**, sondern reine fachliche Spezifikationen, die als Input für einen nachgelagerten `solution-architect` Agenten dienen.

---

### Template für ein Projekt anpassen

#### Schritt 1: Template kopieren

```bash
cp ai-agentic-software-engineering/claude/templates/agents/business-analyst.md .claude/agents/business-analyst.md
```

#### Schritt 2: Platzhalter ersetzen

Im Kopf der Template-Datei findest du eine vollständige Tabelle aller Platzhalter mit Beispielwerten. Die wichtigsten sind:

| Platzhalter | Beispiel |
| --- | --- |
| `{{PROJECT_NAME}}` | `meals-web`, `Atomin`, `sergei-blog` |
| `{{PROJECT_TYPE}}` | `Nuxt 3 Web-App`, `Flutter Mobile App` |
| `{{TECH_STACK}}` | `Nuxt 3, Vue 3, Pinia, Appwrite` |
| `{{UC_ID_PATTERN}}` | `UC-[NNN]` oder `UC-[FEATURE]-[NNN]` |
| `{{FEATURES_LIST}}` | `Authentication, Meals, Events, Shopping` |
| `{{MODEL}}` | `sonnet` oder `opus` |
| `{{AGENT_MEMORY_PATH}}` | absoluter Pfad zur Agent-Memory |

#### Schritt 3: Optionale Abschnitte entscheiden

Das Template enthält Abschnitte, die nicht jedes Projekt braucht. Pro Projekt entscheiden:

| Abschnitt | Wann behalten? | Wann entfernen? |
| --- | --- | --- |
| Komponentendiagramm | Mobile-Apps, Clean Architecture | Schlanke Web-Projekte |
| Offline-Branch im Sequenzdiagramm | Offline-First-Apps | Reine Online-Web-Apps |
| Datenmodell mit `is_dirty`/`is_deleted` | Apps mit lokaler Persistenz | Stateless-Frontends |
| UI/UX-Widget-Tabelle | Apps mit hauseigenem Design-System | Standard-Material-/Tailwind-UIs |
| Gherkin-Testszenarien | Teams mit BDD-Praxis | Teams mit reinen Unit-/Widget-Tests |

Suchhinweis: Streichbare Abschnitte sind im Template mit `<!-- OPTIONAL: … -->` markiert.

#### Schritt 4: Verifikation

```bash
# Es darf kein Platzhalter mehr übrig sein
grep -n "{{" .claude/agents/business-analyst.md
```

Wenn dieser Befehl Treffer liefert, ist die Anpassung noch nicht abgeschlossen.

---

### Beispielprompt zum Anpassen mit Claude Code

Wenn du dir die Anpassung nicht manuell machen möchtest, kannst du Claude Code damit beauftragen. Beispielprompt für dieses Blog-Projekt:

```text
Bitte passe das Template aus ai-agentic-software-engineering/claude/templates/agents/business-analyst.md für dieses
Projekt an und speichere das Ergebnis als .claude/agents/business-analyst.md.

Projektinfos:
- Projektname: sergei-blog
- Typ: Nuxt 3 Multilingual Blog/Portfolio
- Domäne: Tech-Blog mit Posts, Projekten und Produkten in Deutsch/Englisch
- Tech Stack: Nuxt 3, Vue 3 Composition API, @nuxt/content v3, @nuxtjs/i18n,
  Tailwind CSS, Pinia, TypeScript
- Backend: keines (Content über @nuxt/content aus dem Repo)
- State Management: Pinia (selten genutzt)
- Architektur: Composables + Pages + Components, kein klassisches Backend
- Features: Posts, Projects, Products, i18n (de/en), Search
- UC-ID-Schema: UC-[NNN] (fortlaufende Nummerierung, kein Feature-Prefix)
- MCP-Tools: figma-mcp (falls bereitgestellt)
- Kein Offline-First, kein Premium-Gating, kein hauseigenes Design-System
- Modell: sonnet
- Farbe: blue

Bitte:
1. Alle Platzhalter ersetzen.
2. Optionale Abschnitte entfernen, die nicht zum Projekt passen
   (Komponentendiagramm-Layer "Data Layer" mit LocalDS/RemoteDS, Offline-Branch
   im Sequenzdiagramm, Datenmodell mit is_dirty/is_deleted, UI/UX-Widget-Tabelle
   mit hauseigenem Präfix, Gherkin-Testszenarien).
3. Den Footer-Block mit der Anpassungs-Anleitung und alle HTML-Kommentare
   am Anfang/Ende entfernen.
4. Sicherstellen, dass nach der Anpassung `grep -n "{{" .claude/agents/business-analyst.md`
   keine Treffer mehr liefert.
```

Tipp: Wenn du den Agenten für mehrere Projekte gleichzeitig brauchst, lege die Originaldatei als `business-analyst-template.md` in deinem Dotfiles-Repo ab und ersetze sie projektweit über ein kleines Skript.

---

### Nach der Anpassung: Agent benutzen

Sobald die Datei unter `.claude/agents/business-analyst.md` liegt, ist der Agent in Claude Code aktiv. Beispiel-Aufrufe:

```text
Ich habe eine User Story: Als Blogleser möchte ich Posts nach Tags filtern können.

Bitte starte den business-analyst Agenten und erarbeite daraus einen Use Case.
```

```text
Hier ist ein Epic: "Newsletter-Anmeldung mit Double-Opt-In und Verwaltung über
das User-Profil". Lass den business-analyst Agenten zuerst die Use-Case-Übersicht
aufstellen, bevor wir in Details gehen.
```

Der Agent meldet sich nach jeder Phase und wartet auf deine Freigabe — er führt nichts eigenständig zu Ende.

---

## Solution-Architect-Agent

### Was macht der Agent?

Der `solution-architect` Subagent übernimmt die Rolle eines technischen Architekten. Er nimmt einen abgesteckten Anforderungs- oder Refactoring-Wunsch entgegen, analysiert die Codebase **und das tatsächliche Backend-Schema via MCP**, und erstellt daraus ein vollständiges, deutschsprachiges **Lösungskonzept**.

**Eingabe (vom Nutzer):**
- Feature-Wunsch (z. B. "Wir brauchen Echtzeit-Sync für Einkaufslisten")
- Refactoring-Auftrag (z. B. "Auth-Middleware auf neues Pattern umstellen")
- Schema-Änderung (z. B. "Habit-Notes brauchen Tags")
- Migration / größere architektonische Änderung
- Optional: bestehende Use-Case-Dokumente als Input (z. B. aus dem Business-Analyst)

**Ausgabe (vom Agent):**
- Markdown-Datei unter `docs/loesungskonzept/<thema>-solution.md`
- 9-Abschnitte-Struktur: Management Summary, Ist-Zustand, Soll-Zustand, Technisches Design je Schicht, Design-Entscheidungen, Maßnahmenkatalog mit Aufwandsschätzung (XS–XL), Testplan, Dateiübersicht, Risiken & Mitigation
- Mehrere Mermaid-Diagramme (Klassendiagramm, Sequenzdiagramm, Zustands- oder Architekturdiagramm mit `[NEU]`/`[GEÄNDERT]`-Markern)
- Maßnahmenkatalog mit konkreten Dateipfaden und Abhängigkeiten
- Risiken-Tabelle mit Eintrittswahrscheinlichkeit, Auswirkung und Mitigation

**Arbeitsweise:**
1. Prüft bestehende Lösungskonzepte und Use Cases als Kontext
2. Liest mindestens ein vollständiges Feature als Referenz-Pattern (mit Zeilennummern)
3. Verifiziert das Backend-Schema **verpflichtend via MCP** — keine Vermutungen
4. Entwirft Ist- und Soll-Zustand mit Diagrammen
5. Leitet einen priorisierten Maßnahmenkatalog mit Aufwand und Dateipfaden ab
6. Stellt das Konzept zur Freigabe vor und setzt den Status erst nach Bestätigung

Der Agent arbeitet durchgehend **auf Deutsch**, hält sich strikt an **DRY / KISS / Clean Code** und produziert **keinen produktiven Code** — Codebeispiele im Konzept sind Skizzen zur Illustration. Er ist die natürliche Anschluss-Station nach dem `business-analyst`: Use Cases gehen rein, Lösungskonzepte kommen raus.

---

### Template für ein Projekt anpassen

#### Schritt 1: Template kopieren

```bash
cp ai-agentic-software-engineering/claude/templates/agents/solution-architect.md .claude/agents/solution-architect.md
```

#### Schritt 2: Platzhalter ersetzen

Die wichtigsten Platzhalter (vollständige Liste im Kopf der Template-Datei):

| Platzhalter | Beispiel |
| --- | --- |
| `{{PROJECT_NAME}}` | `meals-web`, `Atomin`, `sergei-blog` |
| `{{PROJECT_TYPE}}` | `Nuxt 3 Web-App`, `Flutter Mobile App` |
| `{{TECH_STACK}}` | `Nuxt 3, Vue 3, Pinia, Appwrite, Tailwind` |
| `{{STATE_MANAGEMENT}}` | `Pinia`, `Riverpod`, `Redux` |
| `{{BACKEND}}` + `{{BACKEND_DETAILS}}` | `Appwrite Cloud` + Project-/DB-IDs (keine Secrets!) |
| `{{ARCHITECTURE_PATTERN}}` | `Composable-first`, `Clean Architecture` |
| `{{MCP_TOOL_REFERENCE}}` | Tabelle der aktiven MCP-Server (z. B. `appwrite-api` + `appwrite-docs`, oder `appwrite-mcp` + `figma-mcp`) |
| `{{HELPER_UTILS}}` | Liste hauseigener Util-Module |
| `{{LOESUNGSKONZEPT_DIR}}` | `docs/loesungskonzept/` |
| `{{AGENT_MEMORY_PATH}}` | absoluter Pfad zur Agent-Memory |
| `{{MODEL}}` / `{{COLOR}}` | `sonnet` / `opus` und Farbcode |

#### Schritt 3: Optionale Bausteine entscheiden

Das Template enthält Sektionen für anspruchsvollere Stacks, die nicht jedes Projekt braucht. Pro Projekt entscheiden:

| Baustein | Wann behalten? | Wann entfernen? |
| --- | --- | --- |
| Offline-First-Block (SyncQueue, ConflictResolver, `is_dirty`/`is_deleted`) | Offline-fähige mobile Apps | Reine Online-/Web-Apps |
| Premium-Gating (RevenueCat, Flavor-Schalter) | Apps mit In-App-Purchases | Apps ohne Paywall |
| Code-Generierung (`build_runner`, Freezed, `@riverpod`) | Flutter/Dart mit Codegen | TS-/Vue-Projekte ohne Codegen |
| Mehrsprachige i18n (>2 Locales mit ARB o. ä.) | Internationale Apps | 1–2 Sprachen |
| UI-Widget-System-Tabelle (`{{UI_WIDGET_PREFIX}}…`) | Hauseigenes Design-System | Generische Material-/Tailwind-UIs |
| ASCII-Architekturdiagramme zusätzlich zu Mermaid | Komplexe Layer-Strukturen | Reine Mermaid-Strategie |

Suchhinweis: Streichbare Bausteine sind im Template mit `<!-- OPTIONAL: … -->` markiert.

#### Schritt 4: Verifikation

```bash
# Es darf kein Platzhalter mehr übrig sein
grep -n "{{" .claude/agents/solution-architect.md
```

Wenn dieser Befehl Treffer liefert, ist die Anpassung noch nicht abgeschlossen.

---

### Beispielprompt zum Anpassen mit Claude Code

Beispielprompt für dieses Blog-Projekt — bewusst minimal, weil es kein klassisches Backend hat und der Solution-Architect entsprechend schlank konfiguriert wird:

```text
Bitte passe das Template aus ai-agentic-software-engineering/claude/templates/agents/solution-architect.md für dieses
Projekt an und speichere das Ergebnis als .claude/agents/solution-architect.md.

Projektinfos:
- Projektname: sergei-blog
- Typ: Nuxt 3 Multilingual Blog/Portfolio
- Beschreibung: Tech-Blog mit Posts, Projekten und Produkten in Deutsch/Englisch,
  Content kommt aus dem Repo via @nuxt/content (kein Backend).
- Tech Stack: Nuxt 3, Vue 3 Composition API, @nuxt/content v3, @nuxtjs/i18n,
  Tailwind CSS, Pinia, TypeScript
- Architektur: Composable-first (kein klassisches Layered Backend)
- State Management: Pinia (selten genutzt)
- Backend: keines (Content über @nuxt/content aus dem Repo)
- Features: Posts, Projects, Products, i18n (de/en), Search
- Naming-Konventionen: PascalCase für Vue-Komponenten, kebab-case für Pages
- UI-Design-System: Tailwind + HeadlessUI (kein hauseigenes Präfix)
- Helper-Utils: useContent (Content-Queries), keine weiteren projektweiten Helfer
- Test-Frameworks: keines aktiv (Vitest geplant)
- i18n: en (default), de (Strategie prefix_except_default)
- MCP-Tools: figma-mcp (falls bereitgestellt) — KEIN Backend-MCP nötig
- Lösungskonzept-Verzeichnis: docs/loesungskonzept/
- Use-Cases-Verzeichnis: docs/usecases/
- Modell: sonnet
- Farbe: blue

Bitte:
1. Alle Platzhalter ersetzen.
2. Folgende optionale Bausteine ersatzlos entfernen, weil das Projekt sie
   nicht hat: Offline-First, Premium-Gating, Code-Generierung (build_runner),
   UI-Widget-Tabelle (kein {{UI_WIDGET_PREFIX}}), ASCII-Architekturdiagramme,
   Backend-Schema-MCP-Spalten (es gibt kein Backend-Schema zu verifizieren —
   stattdessen Hinweis: "Schema-Verifikation entfällt; verifiziere stattdessen
   die Inhaltsschemata in content.config.ts").
3. Phase 2 anpassen: statt Backend-Schema via MCP, "Inhaltsschemata aus
   content.config.ts lesen" als Verifikationsschritt einsetzen.
4. Den Footer mit der Anpassungs-Anleitung und alle HTML-Kommentare
   am Anfang/Ende entfernen.
5. Nach der Anpassung muss `grep -n "{{" .claude/agents/solution-architect.md`
   leer sein.
```

> **Hinweis für dieses Blog-Projekt:** Da es kein klassisches Backend gibt, ist der Solution-Architect hier eingeschränkt sinnvoll. Er eignet sich vor allem für Frontend-Architektur-Entscheidungen (z. B. neuer Content-Type mit Schema-Erweiterung in `content.config.ts`, Filter-/Such-Feature mit komplexer State-Logik, größere Refactorings).

---

### Nach der Anpassung: Agent benutzen

Beispiel-Aufrufe für den Solution-Architect:

```text
Wir wollen einen neuen Content-Type "Tutorials" einführen, der Posts in
Lektionen mit Reihenfolge gruppiert. Bitte erstelle ein Lösungskonzept.
```

```text
Erstelle ein Lösungskonzept für eine clientseitige Volltextsuche über
Posts, Projects und Products mit Filter nach Tag und Sprache.
```

```text
Hier ist UC-008 (Newsletter-Anmeldung) aus docs/usecases/. Bitte erstelle
das passende Lösungskonzept und referenziere die UC-ID explizit.
```

Auch dieser Agent meldet sich nach jeder Phase und wartet auf Freigabe.

---

## Realisierungsplan-Agent

### Was macht der Agent?

Der `realisierungsplan` Subagent ist die **fehlende Brücke** zwischen Solution Architect und Developer. Er nimmt ein freigegebenes Lösungskonzept entgegen und übersetzt es in einen **atomaren, schrittweisen Implementierungsplan**, den der `developer`-Agent danach Schritt für Schritt abarbeitet.

Inspiriert von **Spec-Driven Development (SDD)** und dem GitHub Spec-Kit: Der Plan ist eine enge Leitplanke zwischen Konzept und Code, die verhindert, dass das LLM während der Implementierung improvisiert. Das ist der **Checkpoint 3** im Vier-Agenten-Workflow — der letzte Punkt, an dem der Mensch ohne Code-Review eingreifen kann.

**Eingabe (vom Nutzer/Workflow):**
- Pflicht: freigegebenes Lösungskonzept aus `docs/loesungskonzept/<thema>-solution.md`
- Optional: verwandte Use Cases aus `docs/usecases/` für funktionalen Kontext
- Direkter Zugriff auf die Codebase zur Verifikation der Referenz-Patterns

**Ausgabe (vom Agent):**
- Markdown-Datei unter `docs/plan/<thema>-plan.md` mit Übersicht, optional Phasen-Gruppierung, allen Schritten und globaler Risikotabelle
- Jeder Schritt enthält: Datei(en) mit vollständigem Pfad, Aufgaben-Checkliste, Validierungsbefehl, optional Vorher/Nachher-Skizze, optional manuelle Verifikation (Aktion→erwartetes Ergebnis), optional Cleanup, optional Risikoeinschätzung, explizite Abhängigkeit zu Vorgänger-Schritten
- Drei explizite Versprechen pro Plan: **Atomarität**, **Lauffähigkeit nach jedem Schritt**, **mechanische Validierbarkeit**

**Arbeitsweise (5 Phasen):**
1. Lösungskonzept vollständig lesen, ggf. verwandte Use Cases hinzuziehen
2. Maßnahmenkatalog in atomare Schritte zerlegen, Reihenfolge nach Abhängigkeiten festlegen, Lauffähigkeits-Test pro Schritt mental durchspielen
3. Schritt-Anatomie befüllen — Datei-Pfade, Aufgaben, Validierung, optional Vorher/Nachher, Risiko
4. Plan-Dokument schreiben (`{{PLAN_DIR}}<thema>-plan.md`), Selbst-Check anhand der Atomaritäts-Regeln
5. Plan vorstellen (5–7 Bulletpoints), auf Freigabe warten, bei Korrekturen überarbeiten, nach Freigabe an `developer` übergeben

Der Agent **schreibt keinen produktiven Code** — Codeblöcke im Plan sind ausschließlich Vorher/Nachher-Skizzen zur Illustration. Konkrete Implementierung ist Sache des nachgelagerten Developer-Agenten.

---

### Template für ein Projekt anpassen

#### Schritt 1: Template kopieren

```bash
cp ai-agentic-software-engineering/claude/templates/agents/realisierungsplan.md .claude/agents/realisierungsplan.md
```

#### Schritt 2: Platzhalter ersetzen

Wichtigste Platzhalter (vollständige Liste im Kopf der Template-Datei):

| Platzhalter | Beispiel |
| --- | --- |
| `{{AGENT_NAME}}` / `{{MODEL}}` / `{{COLOR}}` | `realisierungsplan` / `sonnet` / `purple` |
| `{{PROJECT_NAME}}` + `{{PROJECT_TYPE}}` | `meals-web` + `Nuxt 3 Web-App` |
| `{{TECH_STACK}}` + `{{ARCHITECTURE_PATTERN}}` | `Nuxt 3, Vue 3, Pinia, Appwrite` + `Composable-first` |
| `{{BACKEND}}` | `Appwrite` / `Firebase` / `keines (@nuxt/content)` |
| `{{LOESUNGSKONZEPT_DIR}}` / `{{PLAN_DIR}}` | `docs/loesungskonzept/` / `docs/plan/` |
| `{{PRIMARY_BUILD_COMMAND}}` | `npm run build` (Nuxt) / `flutter analyze` (Flutter) |
| `{{VALIDATION_COMMANDS}}` | Liste aller im Projekt verfügbaren Build-/Test-/Check-Befehle |
| `{{DEVELOPER_AGENT_NAME}}` | Name des nachgelagerten Developer-Agenten (z. B. `developer`, `nuxt-developer`) |
| `{{CODING_GUIDELINES_PATH}}` | `.claude/rules/coding-guidelines.md` |
| `{{AGENT_MEMORY_PATH}}` | absoluter Pfad zum Agent-Memory |

#### Schritt 3: Optionale Bausteine entscheiden

| Baustein | Wann behalten? | Wann entfernen? |
| --- | --- | --- |
| `PHASES_GROUPING` (Phasen-Block) | Mittlere/große Pläne mit klar trennbaren Bereichen (DB/Backend/UI) | Kleine Pläne mit ≤ 5 Schritten |
| `VORHER_NACHHER_CODE` (Skizzen im Schritt) | Refactorings bestehender Funktionen, Schema-Migrationen | Reine Neuanlage-Schritte |
| `MANUELLE_VERIFIKATION` (Aktion/Ergebnis-Tabelle) | UI-/UX-relevante Schritte | Reine Codegen-/Boilerplate-Schritte |
| `CLEANUP_BLOCK` (Cleanup-Sektion) | Refactorings, in denen Code obsolet wird | Reine Neuanlage |
| `COMMIT_HINTS` (Commit-Vorschläge) | Teams mit klarer Commit-Konvention | Reine Solo-Workflows ohne Conventional Commits |
| `CODEGEN_HINTS` (build_runner-Hinweise) | Flutter/Dart-Projekte mit `@riverpod`/`@freezed` | Nuxt-/TS-Projekte ohne Codegen |
| `BACKEND_SCHEMA_STEPS` (eigene Schema-Phase) | Projekte mit Backend-Schema-Migrationen | Statischer Content, keine DB |
| `RISK_TABLE` (Risiko pro Schritt + global) | Mittelgroße/große Pläne, kritische Migrationen | Triviale Mini-Pläne |

Suchhinweis: Streichbare Bausteine sind im Template mit `<!-- OPTIONAL: … -->` markiert.

#### Schritt 4: Verifikation

```bash
grep -n "{{" .claude/agents/realisierungsplan.md
```

Muss leer sein, sonst ist die Anpassung nicht abgeschlossen.

---

### Beispielprompt zum Anpassen mit Claude Code (dieses Blog-Projekt)

Beispielprompt für dieses Blog-Projekt — schlank konfiguriert, weil es keinen Backend-Schema-Workflow und keine Codegen-Pipeline gibt:

```text
Bitte passe das Template aus ai-agentic-software-engineering/claude/templates/agents/realisierungsplan.md für dieses
Projekt an und speichere das Ergebnis als .claude/agents/realisierungsplan.md.

Projektinfos:
- Agent-Name: realisierungsplan (Modell: sonnet, Farbe: purple)
- Projektname: sergei-blog
- Typ: Nuxt 3 Multilingual Blog/Portfolio
- Beschreibung: Tech-Blog mit Posts, Projekten und Produkten in Deutsch/Englisch,
  Content via @nuxt/content aus dem Repo (kein klassisches Backend).
- Tech Stack: Nuxt 3, Vue 3 Composition API, @nuxt/content v3, @nuxtjs/i18n,
  Tailwind CSS, Pinia, TypeScript
- Architektur: Composable-first
- Backend: keines (Content über @nuxt/content)
- Features: Posts, Projects, Products, i18n (de/en), Search
- Lösungskonzept-Verzeichnis: docs/loesungskonzept/
- Use-Cases-Verzeichnis: docs/usecases/
- Plan-Verzeichnis: docs/plan/
- Primary Build Command: npm run build
- Validierungsbefehle:
  - npm run build (TypeScript-Build, muss fehlerfrei sein)
  - npx nuxi typecheck (bei Typ-Änderungen)
  - npx prettier --write . (Formatierung)
  - grep -rn 'style="' components/ pages/ (Inline-Styles, muss 0 Treffer haben)
  - grep -rn ': any' composables/ types/ (any-Type, muss 0 Treffer haben)
- Test Command: keiner aktiv
- Codegen Command: keiner
- Developer Agent: nuxt-developer
- Coding-Guidelines: .claude/rules/coding-guidelines.md
- Agent-Memory: ./.claude/agent-memory/realisierungsplan/

Schalter:
- PHASES_GROUPING: ja (Pläne können mehrere Schichten betreffen: Content-Schema,
  Composables, Components, Pages)
- VORHER_NACHHER_CODE: ja (bei Refactorings nützlich)
- MANUELLE_VERIFIKATION: ja (UI-relevante Schritte profitieren stark davon)
- CLEANUP_BLOCK: ja
- COMMIT_HINTS: ja (mit Co-Author "Claude <noreply@anthropic.com>")
- CODEGEN_HINTS: nein (kein build_runner im Projekt)
- BACKEND_SCHEMA_STEPS: nein (kein Backend-Schema, ggf. content.config.ts-
  Schemaänderungen werden als normale Code-Schritte behandelt)
- RISK_TABLE: ja

Bitte:
1. Alle Platzhalter ersetzen.
2. Schalter-abhängige OPTIONAL-Blöcke entsprechend behalten/entfernen.
3. Alle Anpassungs-Kommentare (`<!-- OPTIONAL: … -->`, Beispielblöcke,
   Footer-Anleitung) entfernen.
4. Nach der Anpassung muss `grep -n "{{" .claude/agents/realisierungsplan.md`
   leer sein.
```

---

### Nach der Anpassung: Agent benutzen

Beispiel-Aufrufe für den Realisierungsplan-Agenten:

```text
Das Lösungskonzept für die Volltextsuche unter docs/loesungskonzept/suche-solution.md
ist freigegeben. Bitte nutze den realisierungsplan Agenten und erstelle einen
atomaren Plan unter docs/plan/.
```

```text
Hier ist ein größeres Refactoring-Konzept. Bitte starte den realisierungsplan
Agenten und sorge dafür, dass nach jedem Plan-Schritt der Build grün ist.
```

```text
Der Plan hat in Schritt 5 eine falsche Abhängigkeitsreihenfolge — Schritt 5
setzt voraus, dass Schritt 6 schon gemacht wurde. Bitte nutze den realisierungsplan
Agenten zur Korrektur.
```

Auch dieser Agent meldet sich am Ende mit einer kurzen Vorstellung des Plans und wartet auf Freigabe, bevor er an den Developer-Agenten übergibt.

---

## Coding-Guidelines-Templates

Die Coding-Guidelines sind **keine Agenten**, sondern **Regel-Dokumente**, die ins Projekt unter `.claude/rules/coding-guidelines.md` gelegt werden. Sowohl der `solution-architect` (über `{{CODING_GUIDELINES_PATH}}`) als auch der `nuxt-developer` referenzieren diese Datei. Verbindlich für Agenten und Menschen gleichermaßen.

Es gibt zwei Plattform-spezifische Templates — wähle das passende für dein Projekt.

---

### Coding-Guidelines – Flutter

[`coding-guidelines-flutter.md`](rules/coding-guidelines-flutter.md) deckt Flutter-Apps mit Clean Architecture, Riverpod, GoRouter und Codegen ab. Optionale Bausteine: Offline-First (SQLite + DAOs + SyncManager), Premium-Gating (RevenueCat), Widgetbook und mehrsprachige i18n.

#### Anpassen

```bash
cp ai-agentic-software-engineering/claude/templates/rules/coding-guidelines-flutter.md .claude/rules/coding-guidelines.md
```

Wichtigste Platzhalter:

| Platzhalter | Beispiel |
| --- | --- |
| `{{PROJECT_NAME}}` / `{{PACKAGE_NAME}}` | `Atomin` / `atomin` |
| `{{BACKEND}}` + `{{BACKEND_SDK_IMPORT}}` | `Appwrite` / `package:appwrite/appwrite.dart` |
| `{{UI_WIDGET_PREFIX}}` + `{{UI_WIDGET_DIR}}` | `DevCat` / `lib/common/presentation/widget/` |
| `{{COLORS_CLASS}}` | `AppColors` |
| `{{TEXT_STYLES_APPROACH}}` | `theme` (Theme.of) **oder** `class` (eigene `AppTextStyles`-Klasse) |
| `{{DIMENSIONS_APPROACH}}` | `class` (eigene `AppDimensions`-Klasse) **oder** `loose` (semantische Konstanten je Datei) |
| `{{I18N_LOCALE_COUNT}}` + `{{I18N_LOCALES_LIST}}` | `11` / `app_de.arb, app_en.arb, …` |
| `{{ROUTER_FILE_PATH}}` | `lib/common/router/router_provider.dart` |

Optionale Bausteine — wann behalten?

| Baustein | Wann behalten? | Wann entfernen? |
| --- | --- | --- |
| Sektion 6 (Offline-First-Architektur, DAOs, SyncManager) | Offline-fähige Apps | Reine Online-Apps |
| Sektion 8.4 (Widgetbook-Pflicht) | Projekt nutzt Widgetbook | Kein Widgetbook |
| Sektion 14.9 (Payment / RevenueCat) | App mit In-App-Purchases | Ohne Paywall |
| Typografie-Strategie A oder B | Eine der beiden wählen — die andere streichen | — |
| Dimensions-Strategie A oder B | Eine der beiden wählen — die andere streichen | — |
| DAO-Tests (Sektion 15.2) | Mit lokaler DB | Ohne lokale DB |

#### Beispielprompt zum Anpassen mit Claude Code

```text
Bitte passe das Template aus ai-agentic-software-engineering/claude/templates/rules/coding-guidelines-flutter.md für
unser Projekt an und speichere das Ergebnis als .claude/rules/coding-guidelines.md.

Projektinfos:
- Projektname: Atomin (Package: atomin)
- Beschreibung: Habit-Tracking App mit Offline-Sync und Premium-Features
- Backend: Appwrite (TablesDB)
- UI-Widget-Präfix: DevCat (in lib/common/presentation/widget/)
- Farb-Klasse: AppColors
- Typografie: theme (Theme.of(context).textTheme — KEINE eigene Styles-Klasse)
- Dimensionen: loose (semantische Konstanten je Datei, keine AppDimensions-Klasse)
- i18n: 11 Sprachen (app_de.arb, app_en.arb, app_es.arb, app_fr.arb, app_it.arb,
  app_pl.arb, app_pt.arb, app_ru.arb, app_tr.arb, app_uk.arb, app_pt_BR.arb)
- Router-Pfad: lib/common/router/router_provider.dart
- Error-Classifier: lib/common/utils/error_classifier.dart
- App-Config: lib/common/config/app_config.dart

Schalter (alle ja → Block behalten, nein → Block entfernen):
- Offline-First: ja (SQLite, DAOs, SyncManager, ConflictResolver, is_dirty/is_deleted)
- Premium-Gating: ja (RevenueCat, Flavor-Setup)
- Widgetbook: nein
- Typografie: theme (Variante B mit AppTextStyles-Klasse entfernen)
- Dimensionen: loose (Variante A mit AppDimensions-Klasse entfernen)
- Sealed Auth State: ja

Bitte:
1. Alle Platzhalter ersetzen.
2. Schalter-abhängige OPTIONAL-Blöcke entsprechend behalten/entfernen.
3. Alle Anpassungs-Kommentare (`<!-- OPTIONAL: … -->`, `<!-- VARIANTE A/B: … -->`,
   Beispiel-Trees, Footer-Anleitung) entfernen.
4. Nach der Anpassung muss `grep -n "{{" .claude/rules/coding-guidelines.md` leer sein.
```

---

### Coding-Guidelines – Nuxt 3 / TypeScript

[`coding-guidelines-nuxt.md`](rules/coding-guidelines-nuxt.md) deckt Nuxt-3-Web-Apps mit Composition API, TypeScript, Tailwind und optional Pinia/i18n/Backend ab. Backend-agnostisch — funktioniert für Appwrite, Supabase, Firebase, REST oder statischen Content via `@nuxt/content`.

#### Anpassen

```bash
cp ai-agentic-software-engineering/claude/templates/rules/coding-guidelines-nuxt.md .claude/rules/coding-guidelines.md
```

Wichtigste Platzhalter:

| Platzhalter | Beispiel |
| --- | --- |
| `{{PROJECT_NAME}}` + `{{PROJECT_TYPE}}` | `meals-web` + `Nuxt 3 Web-App` |
| `{{RENDERING_MODE}}` | `SPA (ssr: false)` / `SSR` / `SSG (generate)` |
| `{{BACKEND}}` + `{{BACKEND_CLIENT_COMPOSABLE}}` | `Appwrite Cloud` + `useAppwrite()` — oder `keines` + `useContent()` |
| `{{TYPE_FILE_SUFFIX}}` | `Type.ts` |
| `{{BASE_DOC_TYPE}}` | `AppwriteBaseDocument` (oder leer wenn kein Backend) |
| `{{COMPONENT_NAMING}}` | `camelCaseComponent.vue` / `PascalCase.vue` |
| `{{TAILWIND_TOKEN_HINT}}` | `DCBlue, DCBlueDark, font-headline, font-body` |
| `{{I18N_LOCALES_LIST}}` + `{{I18N_FILE_PATHS}}` | `en-US, de-DE` + `i18n/locales/*.json` |
| `{{IMPORT_ALIAS}}` | `~/` (Nuxt-Standard) |

Optionale Bausteine — wann behalten?

| Baustein | Wann behalten? | Wann entfernen? |
| --- | --- | --- |
| Sektion 4 (State Management Pinia) | Pinia genutzt | Reine Composable/`useState`-Strategie |
| Sektion 5.2 (Permissions-Pattern) | Backend mit Row-Level-Security | REST-API ohne Permissions / statischer Content |
| Sektion 3.3 (i18n) | Mehrsprachiges Projekt | Single-Language |
| Sektion 6 (BASE_DOC_TYPE-Block) | Backend mit gemeinsamer Dokument-Basis | Generische REST/Static-Content |
| HeadlessUI-Hinweis (Sektion 3.2) | HeadlessUI genutzt | Standard-Tailwind ohne HeadlessUI |
| Sektion 7.2 (Store Error-Pattern) | Pinia genutzt | — |

#### Beispielprompt zum Anpassen mit Claude Code (dieses Blog-Projekt)

```text
Bitte passe das Template aus ai-agentic-software-engineering/claude/templates/rules/coding-guidelines-nuxt.md für dieses
Projekt an und speichere das Ergebnis als .claude/rules/coding-guidelines.md.

Projektinfos:
- Projektname: sergei-blog
- Typ: Nuxt 3 Multilingual Blog/Portfolio
- Beschreibung: Tech-Blog mit Posts, Projekten und Produkten in Deutsch/Englisch,
  Content via @nuxt/content aus dem Repo (kein klassisches Backend).
- Rendering: SSR (default)
- Backend: keines (Content über @nuxt/content)
- Backend-Client-Composable: useContent() (eigenes Composable für Content-Queries)
- Komponenten-Konvention: PascalCase.vue
- Type-Suffix: Type.ts
- Basis-Doc-Type: nicht vorhanden (kein gemeinsames Backend-Schema)
- Import-Alias: ~/
- Tailwind-Custom-Tokens: keine projekteigenen Farben/Fonts (Standard Tailwind)
- HeadlessUI: ja
- i18n: en-US (default), de-DE
- Locale-Pfade: i18n/locales/*.json
- Features: Posts, Projects, Products, i18n (de/en), Search

Schalter:
- Backend vorhanden: nein (Sektionen 5.2 Permissions, 6 BASE_DOC_TYPE-Block,
  7.1 Backend-spezifische Beispiele entsprechend reduzieren — Content-Queries
  statt Backend-SDK)
- Pinia: nein (Sektion 4 komplett entfernen; Sektion 7.2 Store Error-Pattern
  ebenfalls entfernen; Layer-Regeln-Zeile für stores/ streichen)
- Custom Utils: minimal (nur useContent.ts in composables/; utils/-Block in
  Sektion 11 mit Hinweis auf composables/useContent.ts statt utils/-Auflistung)
- Permissions-Layer: nein
- i18n: ja

Quality Gates:
- npm run build
- npx nuxi typecheck
- npx prettier --write .
- grep -rn 'style="' components/ pages/
- grep -rn ': any' composables/ types/
- grep -rn 'as any' composables/ types/

Bitte:
1. Alle Platzhalter ersetzen.
2. Schalter-abhängige OPTIONAL-Blöcke entsprechend behalten/entfernen.
3. Alle Anpassungs-Kommentare (`<!-- OPTIONAL: … -->`, Beispielblöcke, Footer-
   Anleitung) entfernen.
4. Nach der Anpassung muss `grep -n "{{" .claude/rules/coding-guidelines.md` leer sein.
```

---

## Developer-Templates

Während die Coding-Guidelines das **Regelwerk** sind, ist der Developer-Agent der **Ausführer**: Er nimmt einen Realisierungsplan, ein Lösungskonzept oder eine Textbeschreibung entgegen und implementiert schrittweise. Er respektiert die Coding-Guidelines, führt nach jedem Step Quality Gates aus und committet eigenständig auf einem Feature-Branch.

Es gibt zwei Plattform-spezifische Developer-Templates — wähle das passende für dein Projekt.

---

### Developer – Flutter

[`developer-flutter.md`](developer-flutter.md) deckt Flutter-Projekte mit Clean Architecture, Riverpod, GoRouter und optional Offline-First-Sync ab. Optionale Bausteine: Backend-Schema-MCP (Appwrite o. ä.), Figma-MCP, Widgetbook, Premium-Gating (RevenueCat), Findings-Auflösung.

#### Anpassen

```bash
cp ai-agentic-software-engineering/claude/templates/agents/developer-flutter.md .claude/agents/developer.md
```

Wichtigste Platzhalter:

| Platzhalter | Beispiel |
| --- | --- |
| `{{AGENT_NAME}}` / `{{MODEL}}` / `{{COLOR}}` | `developer` / `sonnet` / `green` |
| `{{PROJECT_NAME}}` / `{{PACKAGE_NAME}}` | `Atomin` / `atomin` |
| `{{BACKEND}}` + `{{BACKEND_SDK_IMPORT}}` | `Appwrite` / `package:appwrite/appwrite.dart` |
| `{{UI_WIDGET_PREFIX}}` + `{{UI_WIDGET_DIR}}` | `DevCat` / `lib/common/presentation/widget/` |
| `{{COLORS_CLASS}}` | `AppColors` |
| `{{TEXT_STYLES_APPROACH}}` | `theme` **oder** `class` |
| `{{DIMENSIONS_APPROACH}}` | `class` **oder** `loose` |
| `{{I18N_LOCALE_COUNT}}` + `{{I18N_LOCALES_LIST}}` | `11` / `app_de.arb, app_en.arb, …` |
| `{{CODING_GUIDELINES_PATH}}` | `.claude/rules/coding-guidelines.md` |
| `{{ROUTER_FILE_PATH}}` | `lib/common/router/router_provider.dart` |
| `{{AGENT_MEMORY_PATH}}` | absoluter Pfad zum Agent-Memory |

Optionale Bausteine — wann behalten?

| Baustein | Wann behalten? | Wann entfernen? |
| --- | --- | --- |
| Offline-First-Architektur-Sektion + Review 4.5 | Offline-fähige Apps | Reine Online-Apps |
| Premium-Gating-Hinweise + Anti-Pattern-Zeile | App mit In-App-Purchases | Ohne Paywall |
| MCP-Block "Backend Schema MCP" | Projekt mit Appwrite/Supabase/Firebase-MCP | Ohne MCP / statischer Content |
| MCP-Block "Figma MCP" + Review 4.8 | Projekt nutzt Figma-MCP | Ohne Figma |
| Widgetbook-Schritt unter "When a component is MISSING" | Projekt nutzt Widgetbook | Ohne Widgetbook |
| Typografie-Variante A oder B | Eine wählen — die andere streichen | — |
| Dimensions-Variante A oder B | Eine wählen — die andere streichen | — |

#### Beispielprompt zum Anpassen mit Claude Code

```text
Bitte passe das Template aus ai-agentic-software-engineering/claude/templates/agents/developer-flutter.md für unser
Projekt an und speichere das Ergebnis als .claude/agents/developer.md.

Projektinfos:
- Agent-Name: developer (Modell: sonnet, Farbe: green)
- Projektname: Atomin (Package: atomin)
- Beschreibung: Habit-Tracking App mit Offline-Sync und Premium-Features
- Backend: Appwrite (SDK: package:appwrite/appwrite.dart)
- UI-Widget-Präfix: DevCat (in lib/common/presentation/widget/)
- Farb-Klasse: AppColors
- Typografie-Strategie: theme (Theme.of(context).textTheme)
- Dimensions-Strategie: loose (semantische Konstanten je Datei)
- Router: lib/common/router/router_provider.dart
- Error-Classifier: lib/common/utils/error_classifier.dart
- i18n: 11 Sprachen (app_de.arb, app_en.arb, app_es.arb, app_fr.arb, app_it.arb,
  app_pl.arb, app_pt.arb, app_ru.arb, app_tr.arb, app_uk.arb, app_pt_BR.arb)
- Main-Entry: lib/main.dart
- Coding-Guidelines: .claude/rules/coding-guidelines.md
- Styling-Guidelines: .claude/rules/styling-guidelines.md
- Lösungskonzepte: docs/loesungskonzept/
- Realisierungspläne: docs/plan/
- Agent-Memory: /Users/sergeiliebich/Development/DevCat/habitus_new/.claude/agent-memory/developer/

Schalter:
- Offline-First: ja (DAOs, SyncManager, ConflictResolver, is_dirty/is_deleted)
- Premium-Gating: ja (RevenueCat via --dart-define-Keys)
- Appwrite-MCP: ja (proaktive Schema-Verifikation)
- Figma-MCP: ja (proaktive Design-Extraktion)
- Widgetbook: nein
- Typografie: theme (Variante B entfernen)
- Dimensionen: loose (Variante A entfernen)

Bitte:
1. Alle Platzhalter ersetzen (auch {{COLORS_CLASS_FILE}} = app_colors,
   {{UI_WIDGET_PREFIX_LOWER}} = dev_cat).
2. Schalter-abhängige OPTIONAL-Blöcke entsprechend behalten/entfernen.
3. Alle Anpassungs-Kommentare (`<!-- OPTIONAL: … -->`, `<!-- VARIANTE A/B: … -->`,
   Footer-Anleitung) entfernen.
4. Nach der Anpassung muss `grep -n "{{" .claude/agents/developer.md` leer sein.
```

---

### Developer – Nuxt 3 / TypeScript

[`developer-nuxt.md`](developer-nuxt.md) deckt Nuxt-3-Web-Apps mit Composition API, TypeScript, Tailwind und optional Pinia/i18n/Backend ab. Backend-agnostisch — funktioniert für Appwrite, Supabase, Firebase, REST oder statischen Content via `@nuxt/content`. Optionale Bausteine: Pinia, HeadlessUI, i18n, Figma-MCP, Permissions-Layer, Findings-Auflösung.

#### Anpassen

```bash
cp ai-agentic-software-engineering/claude/templates/agents/developer-nuxt.md .claude/agents/developer.md
# oder, wenn du den Namen "nuxt-developer" willst:
cp ai-agentic-software-engineering/claude/templates/agents/developer-nuxt.md .claude/agents/nuxt-developer.md
```

Wichtigste Platzhalter:

| Platzhalter | Beispiel |
| --- | --- |
| `{{AGENT_NAME}}` / `{{MODEL}}` / `{{COLOR}}` | `developer` / `sonnet` / `blue` |
| `{{PROJECT_NAME}}` + `{{PROJECT_TYPE}}` | `meals-web` + `Nuxt 3 Web-App` |
| `{{RENDERING_MODE}}` | `SPA (ssr: false)` / `SSR` / `SSG (generate)` |
| `{{BACKEND}}` + `{{BACKEND_CLIENT_COMPOSABLE}}` | `Appwrite` + `useAppwrite()` — oder `@nuxt/content` + `useContent()` |
| `{{COMPONENT_NAMING}}` | `camelCase + Component.vue` / `PascalCase.vue` |
| `{{TYPE_FILE_SUFFIX}}` | `Type.ts` |
| `{{BASE_DOC_TYPE}}` | `AppwriteBaseDocument` (oder leer wenn kein Backend) |
| `{{IMPORT_ALIAS}}` | `~/` (Nuxt-Standard) |
| `{{I18N_LOCALES_LIST}}` + `{{I18N_FILE_PATHS}}` | `en-US, de-DE` + `i18n/locales/*.json` |
| `{{FEATURES_LIST}}` | `Auth, Meals, Shopping` / `Posts, Projects, Products` |
| `{{CODING_GUIDELINES_PATH}}` | `.claude/rules/coding-guidelines.md` |
| `{{AGENT_MEMORY_PATH}}` | absoluter Pfad zum Agent-Memory |

Optionale Bausteine — wann behalten?

| Baustein | Wann behalten? | Wann entfernen? |
| --- | --- | --- |
| Backend-Architektur-Regeln + Grep-Check 5 | Projekt mit Backend-SDK | Statischer Content / kein Backend |
| Pinia-Block (Architektur 2/6, Phase 1 Schritt 6) | Pinia genutzt | Reine Composable/`useState`-Strategie |
| HeadlessUI-Hinweis | HeadlessUI genutzt | Standard-Tailwind ohne HeadlessUI |
| i18n-Pflicht + Review 4.8 | Mehrsprachiges Projekt | Single-Language |
| Figma-Sektion + Review 4.7 | Figma-Designs vorhanden + MCP verfügbar | Ohne Figma |
| Findings-Auflösung-Sektion | `docs/findings/`-Workflow im Projekt | Ohne Findings-Verzeichnis |
| Permissions-Layer-Hinweis | Backend mit Row-Level-Security | REST ohne Permissions / statisch |

#### Beispielprompt zum Anpassen mit Claude Code (dieses Blog-Projekt)

```text
Bitte passe das Template aus ai-agentic-software-engineering/claude/templates/agents/developer-nuxt.md für dieses Projekt
an und speichere das Ergebnis als .claude/agents/nuxt-developer.md.

Projektinfos:
- Agent-Name: nuxt-developer (Modell: sonnet, Farbe: blue)
- Projektname: sergei-blog (Typ: Nuxt 3 Multilingual Blog/Portfolio)
- Beschreibung: Tech-Blog mit Posts, Projekten und Produkten in Deutsch/Englisch,
  Content via @nuxt/content aus dem Repo (kein klassisches Backend).
- Rendering: SSR (default)
- Backend: @nuxt/content (statisch, kein klassisches Backend)
- Backend-Client-Composable: useContent() (in composables/useContent.ts)
- Komponenten-Konvention: PascalCase.vue
- Type-Suffix: Type.ts
- Basis-Doc-Type: nicht vorhanden
- Import-Alias: ~/
- Tailwind-Token-Hinweis: keine projekteigenen Custom-Tokens (Standard Tailwind)
- i18n: en-US (default, kein Prefix), de-DE (Prefix /de/)
- Locale-Pfade: i18n/locales/en.json, i18n/locales/de.json
- Features: Posts, Projects, Products, i18n (de/en), Search
- Coding-Guidelines: .claude/rules/coding-guidelines.md
- Styling-Guidelines: keine (Tailwind direkt)
- Findings-Verzeichnis: docs/findings/
- Lösungskonzepte: docs/loesungskonzept/
- Agent-Memory: /Users/sergeiliebich/Development/blog/.claude/agent-memory/nuxt-developer/

Schalter:
- Backend-Present: nein (Architektur-Regel 1 auf "Composables besitzen Business-
  Logik und Content-Queries" reduzieren; Architektur-Regel 7 entfernen;
  Grep-Check 5 entfernen oder durch Content-Query-Check ersetzen; Review 4.5
  Backend-Punkte entfernen)
- Pinia: nein (Architektur-Regel 2 + 6 entfernen, Phase 1 Schritt 6 entfernen,
  Review 4.5 Store-Punkt entfernen, Grep-Check stores/ entfernen)
- HeadlessUI: ja
- i18n: ja
- Figma-MCP: nein (komplette Figma-Sektion + Review 4.7 entfernen)
- Findings-Resolution: ja
- Phases-Strict: ja (volle Phase 0-5)
- Permissions-Layer: nein

Bitte:
1. Alle Platzhalter ersetzen.
2. Schalter-abhängige OPTIONAL-Blöcke entsprechend behalten/entfernen.
3. Alle Anpassungs-Kommentare (`<!-- OPTIONAL: … -->`, Footer-Anleitung) entfernen.
4. Nach der Anpassung muss `grep -n "{{" .claude/agents/nuxt-developer.md` leer sein.
```

---

## Zusammenspiel der Templates

Der typische Workflow nutzt alle Templates komplementär — das gleiche Vier-Agenten-Team plus geteiltes Regelwerk, das auch in der Blog-Serie über Agentic Coding beschrieben wird:

1. **Coding-Guidelines** (Flutter oder Nuxt) liegen einmal unter `.claude/rules/coding-guidelines.md` und sind verbindliche Referenz für alle Agenten und Entwickler.
2. **Business Analyst** wandelt eine User Story oder ein Epic in einen Use Case (`docs/usecases/<feature>/UC-…md`). → **Checkpoint 1**: Mensch reviewt den Use Case.
3. **Solution Architect** liest den Use Case, ermittelt den Ist-Zustand via MCP/Codebase, entwirft Soll-Zustand und Maßnahmenkatalog auf Basis der Coding-Guidelines, und schreibt das Konzept (`docs/loesungskonzept/<thema>-solution.md`). → **Checkpoint 2**: Mensch reviewt das Konzept.
4. **Realisierungsplan** übersetzt das Konzept in einen atomaren, validierbaren Plan (`docs/plan/<thema>-plan.md`), in dem nach jedem Schritt der Build grün ist. → **Checkpoint 3**: Mensch reviewt den Plan (Reihenfolge, Abhängigkeiten, Lauffähigkeit).
5. **Developer** (Flutter oder Nuxt) bekommt vom freigegebenen Plan **genau einen Schritt** pro Aufruf als Kontext, referenziert die Coding-Guidelines, setzt um, führt nach jedem Schritt Quality Gates aus und committet pro Step auf einem Feature-Branch. → **Checkpoint 4** (iterativ): Mensch reviewt nach jedem Schritt — kein Big-Bang-Review am Ende.

Die analytischen Agenten (BA, SA, Realisierungsplan) **schreiben keinen produktiven Code** und **warten auf explizite Freigabe**. Der Developer **schreibt produktiven Code**, hält sich aber strikt an die Coding-Guidelines und führt nach jedem Schritt Quality Gates aus, bevor er committet. Die Coding-Guidelines sind das geteilte Regelwerk, das alle Stufen verbindet.

Diese Aufteilung ist bewusst so geschnitten: Jeder Agent hat einen engen Fokus, der Mensch greift auf der Ebene ein, auf der eine Korrektur noch kostenlos ist (Konzept, Plan), und der Developer kann sich auf einen klar abgegrenzten Schritt konzentrieren, ohne den Plan eigenmächtig zu "optimieren".
