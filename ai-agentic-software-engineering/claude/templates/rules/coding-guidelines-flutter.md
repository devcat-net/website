<!--
================================================================================
  TEMPLATE: Coding Guidelines – Flutter Mobile App
================================================================================

  Zweck
  -----
  Generisches Template für die verbindlichen Coding-Richtlinien eines Flutter-
  Projekts mit Clean Architecture, Riverpod, Appwrite (oder beliebigem Backend)
  und optionaler Offline-First-Architektur.

  Verwendung
  ----------
  1. Diese Datei nach `.claude/rules/coding-guidelines.md` im Zielprojekt kopieren.
  2. Alle `{{PLATZHALTER}}` ersetzen (siehe Platzhalter-Referenz unten).
  3. Optionale Bausteine (markiert mit `<!-- OPTIONAL: … -->`) entweder ausfüllen
     oder ersatzlos entfernen.
  4. Vor dem Einchecken einmal `grep -n "{{" .claude/rules/coding-guidelines.md`
     ausführen — es darf kein Platzhalter mehr übrig sein.
  5. Bei Bedarf eine separate `styling-guidelines.md` für detaillierte Design-
     Tokens anlegen und am Anfang dieser Datei referenzieren.

  Platzhalter-Referenz
  --------------------
  | Platzhalter                       | Beschreibung                                                       | Beispielwert                                            | Pflicht  |
  |-----------------------------------|--------------------------------------------------------------------|---------------------------------------------------------|----------|
  | {{PROJECT_NAME}}                  | Projektname                                                         | Atomin / Mealkat                                        | ja       |
  | {{PACKAGE_NAME}}                  | Dart-Package-Name                                                   | atomin / mealkat                                        | ja       |
  | {{PROJECT_DESCRIPTION}}           | 1–2 Sätze zum Projekt                                              | Habit-Tracking App mit Offline-Sync                     | ja       |
  | {{BACKEND}}                       | Backend-Name                                                        | Appwrite / Firebase / Supabase / REST                   | ja       |
  | {{BACKEND_SDK_IMPORT}}            | Backend-SDK Import-Pfad                                             | `package:appwrite/appwrite.dart`                        | ja       |
  | {{BACKEND_BASE_ENTITY}}           | Basis-Entity-Klasse aus dem SDK (oder eigene)                       | `models.Row` (Appwrite) / `DocumentSnapshot` (Firestore)| nein     |
  | {{UI_WIDGET_PREFIX}}              | Präfix hauseigener Widgets                                          | DevCat / DC / N                                         | ja       |
  | {{UI_WIDGET_DIR}}                 | Verzeichnis hauseigener Widgets                                     | `lib/common/presentation/widget/` / `lib/ui/`           | ja       |
  | {{COLORS_CLASS}}                  | Name der zentralen Farb-Klasse                                      | AppColors                                               | ja       |
  | {{TEXT_STYLES_APPROACH}}          | Typografie-Strategie: `theme` oder `class`                          | `theme` (Theme.of) / `class` (AppTextStyles)            | ja       |
  | {{TEXT_STYLES_CLASS}}             | Name der Textstyles-Klasse (nur bei Strategie `class`)              | AppTextStyles                                           | nein     |
  | {{DIMENSIONS_APPROACH}}           | Dimensionen-Strategie: `class` oder `loose`                         | `class` (AppDimensions) / `loose` (semantische Konst.)  | ja       |
  | {{DIMENSIONS_CLASS}}              | Name der Dimensions-Klasse (nur bei Strategie `class`)              | AppDimensions                                           | nein     |
  | {{STATE_HOOK_PROVIDER_IMPORT}}    | Riverpod-Import                                                     | `package:hooks_riverpod/hooks_riverpod.dart`            | ja       |
  | {{I18N_LOCALES_LIST}}             | Liste aller .arb-Dateien                                            | `app_de.arb, app_en.arb, app_es.arb …`                  | ja       |
  | {{I18N_LOCALE_COUNT}}             | Anzahl unterstützter Sprachen                                       | 11 / 2                                                  | ja       |
  | {{PROJECT_STRUCTURE_DETAILS}}     | Verzeichnis-Tree                                                    | siehe Beispielblock                                     | ja       |
  | {{ROUTES_EXAMPLE_LIST}}           | Liste der wichtigsten Routen                                        | `/`, `/login`, `/profile`                               | nein     |
  | {{FEATURES_LIST}}                 | Liste der Features                                                  | auth, home, analytics, profile                          | ja       |
  | {{ROUTER_FILE_PATH}}              | Pfad zur GoRouter-Konfiguration                                     | `lib/common/router/router_provider.dart`                | ja       |
  | {{CONFIG_FILE_PATH}}              | Pfad zur App-Config                                                 | `lib/common/config/app_config.dart`                     | nein     |
  | {{ERROR_CLASSIFIER_PATH}}         | Pfad zum Error-Classifier/-Mapper                                   | `lib/common/utils/error_classifier.dart`                | nein     |

  Konfigurations-Schalter
  -----------------------
  Pro Projekt entscheiden:
  - OFFLINE_FIRST:        ja/nein  → Sektionen 6 (Offline-Architektur), DAO-Tests, Dirty-Tracking behalten
  - PREMIUM_GATING:       ja/nein  → RevenueCat-Block in Sektion 14.9 + Anti-Patterns behalten
  - WIDGETBOOK:           ja/nein  → Widgetbook-Pflichtblock in Sektion 8 behalten
  - APP_TEXT_STYLES:      class/theme → eine der beiden Typografie-Strategien wählen, andere entfernen
  - APP_DIMENSIONS:       class/loose → analog für Spacing/Dimensions
  - SEALED_AUTH_STATE:    ja/nein  → Auth-State als Sealed Class oder als Freezed-Union
  - MULTI_LANG_I18N:      ja/nein  → Hinweis "Keys in N Sprachen" oder generisch

================================================================================
-->

# Coding Guidelines – {{PROJECT_NAME}} Flutter App

Verbindliche Referenz für alle Implementierungen, Bugfixes und Refactorings im `{{PACKAGE_NAME}}`-Projekt. Agenten und Entwickler **MÜSSEN** diese Richtlinien einhalten. Bei Widerspruch gilt diese Datei.

> {{PROJECT_DESCRIPTION}}

<!-- OPTIONAL: Hinweis auf separate Styling-Guidelines, wenn vorhanden -->
> **Styling-Details** (Farben, Typografie, Spacing, Komponenten-Spezifikationen) siehe `styling-guidelines.md`.

---

## 1. Projektarchitektur

### 1.1 Verzeichnisstruktur

```
{{PROJECT_STRUCTURE_DETAILS}}
```

<!-- Beispielblock für PROJECT_STRUCTURE_DETAILS (anpassen):
lib/
  app/                      → App-Widget (HabitusApp), Connectivity-Indicator
  common/
    appwrite/               → Backend-Services Singleton, Client-Provider
    database/               → SQLite: LocalDatabase + DAOs        <!-- OPTIONAL: bei Offline-First -->
    enum/                   → Gemeinsame Enums
    helper/                 → Feature-übergreifende Hilfsfunktionen
    notifications/          → Push- und Local-Notifications
    payment/                → RevenueCat-Integration              <!-- OPTIONAL: bei Premium-Gating -->
    presentation/widget/    → {{UI_WIDGET_PREFIX}} Design-System Widgets
    router/                 → GoRouter-Konfiguration
    style/                  → {{COLORS_CLASS}} und weitere Styling-Klassen
    sync/                   → SyncManager, ConflictResolver       <!-- OPTIONAL: bei Offline-First -->
    utils/                  → ErrorClassifier, Validators
    constants/              → Konstanten, Feature-Flags
  features/
    [feature]/
      application/
        models/             → Business-Modelle
          enums/            → Feature-spezifische Enums mit Extensions
        providers/          → Feature-Provider (@riverpod Funktionen)
        repository/         → Repository-Implementierungen (impl)
      data/
        datasource/         → Remote (+ Local bei Offline-First)
        entities/           → Datenbank-Entities
        repository/         → Abstrakte Repository-Interfaces
      presentation/
        controller/         → Riverpod-Controller (@riverpod Klassen)
        hook/               → Custom Flutter Hooks
        screens/            → UI-Screens
        widgets/            → Feature-spezifische Widgets
  l10n/                     → ARB-Dateien + generierte AppLocalizations
-->

### 1.2 Layer-Regeln

| Layer            | Darf importieren                                                  | Darf NICHT importieren                          |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| `presentation/`  | `application/`, `common/`, eigene `widgets/`                      | `data/` direkt                                  |
| `application/`   | `data/entities/`, `common/`                                       | `presentation/`, `data/datasource/`             |
| `data/`          | {{BACKEND}} SDK, eigene Entities, `common/constants/`             | `application/models/`, `presentation/`          |
| `common/`        | Dart/Flutter SDK, externe Packages                                | Feature-spezifische Imports                     |
| `ui/` (optional) | `common/style/`, Flutter SDK                                      | Business-Logik, Provider                        |

### 1.3 Datenfluss

```
Screen → Controller → Repository → Datasource → {{BACKEND}}
                          ↓
                    Entity (fromMap) → Model (fromEntity) → Controller State → UI
```

<!-- OPTIONAL: Erweiterung bei Offline-First (entfernen wenn kein Offline-First):
Screen → Controller → Repository → LocalDataSource + RemoteDataSource
                                          ↓                    ↓
                                     SQLite (DAO)        {{BACKEND}} SDK
                                          ↑
                       SyncManager (Offline-First Synchronisation)
-->

---

## 2. Package und Import-Konventionen

### 2.1 Package-Name

```dart
// RICHTIG – immer absoluter Pfad:
import 'package:{{PACKAGE_NAME}}/common/style/{{COLORS_CLASS_FILE}}.dart';
import 'package:{{PACKAGE_NAME}}/features/home/application/models/habit_model.dart';

// FALSCH – keine relativen Imports:
import '../../../common/style/{{COLORS_CLASS_FILE}}.dart';
import './habit_model.dart';
```

### 2.2 Import-Reihenfolge

```dart
// 1. Dart Core
import 'dart:async';
import 'dart:convert';

// 2. Flutter
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

// 3. Externe Packages (alphabetisch)
import '{{BACKEND_SDK_IMPORT}}';
import 'package:freezed_annotation/freezed_annotation.dart';
import '{{STATE_HOOK_PROVIDER_IMPORT}}';
import 'package:riverpod_annotation/riverpod_annotation.dart';

// 4. Lokale Imports (alphabetisch, package:{{PACKAGE_NAME}}/…)
import 'package:{{PACKAGE_NAME}}/common/style/{{COLORS_CLASS_FILE}}.dart';
import 'package:{{PACKAGE_NAME}}/features/home/application/models/habit_model.dart';
```

- Leere Zeile zwischen jeder Gruppe
- Innerhalb jeder Gruppe alphabetisch sortieren

### 2.3 Dateinamen (snake_case)

| Typ                   | Suffix                 | Beispiel                                  |
| --------------------- | ---------------------- | ----------------------------------------- |
| Screen                | `_screen.dart`         | `home_screen.dart`                        |
| Widget                | beschreibend `.dart`   | `{{UI_WIDGET_PREFIX_LOWER}}_button.dart`  |
| Controller            | `_controller.dart`     | `habit_controller.dart`                   |
| Model                 | `_model.dart`          | `user_model.dart`                         |
| Entity                | `_entity.dart`         | `habit_entity.dart`                       |
| Repository Interface  | `_repository.dart`     | `crud_repository.dart`                    |
| Repository Impl       | `_repository_impl.dart`| `crud_habit_repository_impl.dart`         |
| Datasource            | `_data_source.dart`    | `local_data_source.dart`                  |
| DAO <!-- OPTIONAL --> | `_dao.dart`            | `habit_dao.dart`                          |
| Provider              | `_provider.dart`       | `auth_providers.dart`                     |
| Enum                  | beschreibend           | `cuisine_type.dart`, `day_state.dart`     |
| Utility               | beschreibend           | `validators.dart`, `auth_error_mapper.dart`|

### 2.4 Klassen-Benennungen (PascalCase)

- **Screens**: `HomeScreen`, `HabitEditScreen`
- **{{UI_WIDGET_PREFIX}}-Widgets**: `{{UI_WIDGET_PREFIX}}Button`, `{{UI_WIDGET_PREFIX}}FormField` (Präfix `{{UI_WIDGET_PREFIX}}`)
- **Private Sub-Widgets**: `_HabitListItem`, `_EmptyState` (Underscore-Prefix)
- **Controller**: `HabitController`, `AuthController`
- **Models**: `Habit`, `UserModel`, `SessionModel`
- **Entities**: `HabitEntity`, `ProfileEntity`
- **DAOs** <!-- OPTIONAL -->: `HabitDao`, `SyncQueueDao`
- **Enums**: `DayState`, `SyncStatus` (Werte in camelCase)

---

## 3. State Management (Riverpod)

### 3.1 Provider-Typen

| Typ                                                        | Verwende wenn                                            | Beispiel                              |
| ---------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------- |
| `@riverpod class` mit `FutureOr<T> build()`                | Async CRUD (Standard für Feature-Controller)             | `HabitController`, `RecipesController`|
| `@riverpod class` mit `T build()`                          | Synchroner State (Filter, UI-State)                      | `RecipeFilterController`              |
| `@Riverpod(keepAlive: true) class`                         | Langlebiger State (Auth, Session)                        | `AuthController`, `SessionController` |
| `@riverpod Future<T> func(Ref ref)`                        | Berechnete/abgeleitete Werte                             | `filteredRecipesProvider`             |
| `Provider<T>((ref) => ...)`                                | Dependency Injection (Services, Repos, Clients)          | `routerProvider`, `appwriteClient`    |
| `StateProvider<T?>`                                        | Einfache temporäre Werte                                 | `pendingSharedUrlProvider`            |

### 3.2 Codegen-Workflow

```dart
import '{{STATE_HOOK_PROVIDER_IMPORT}}';

part 'habit_controller.g.dart';

@riverpod
class HabitController extends _$HabitController {
  @override
  FutureOr<List<Habit>> build() async {
    final repo = await ref.read(crudHabitRepositoryProvider.future);
    return (await repo.getAll()).map(Habit.fromEntity).toList();
  }
}
```

- Nach Änderungen an `@riverpod`-Klassen: `dart run build_runner build --delete-conflicting-outputs`
- `.g.dart`-Dateien MÜSSEN eingecheckt werden
- `@Riverpod(keepAlive: true)` NUR bei explizitem Bedarf (z. B. Auth/Session-State)
- AutoDispose ist Standard und räumt State auf, wenn kein Widget mehr zuhört

### 3.3 ref.watch vs ref.read

- `ref.watch(provider)` – NUR in `build()`-Methoden (reaktive Abonnements)
- `ref.read(provider)` – In Event-Handlern, Lifecycle-Methoden, Controller-Methoden
- `ref.listen(provider, callback)` – In `build()` für Seiteneffekte (SnackBar, Navigation)

```dart
// RICHTIG:
Widget build(BuildContext context, WidgetRef ref) {
  final habits = ref.watch(habitControllerProvider); // watch in build
  ref.listen(syncManagerProvider, (_, next) { /* Seiteneffekte */ });

  return ElevatedButton(
    onPressed: () => ref.read(habitControllerProvider.notifier).create(habit),
    child: const Text('Create'),
  );
}

// FALSCH:
onPressed: () => ref.watch(habitControllerProvider) // watch außerhalb build
```

### 3.4 State-Updates in Controllern

```dart
// Vollständiger Reload (nach Create):
Future<void> create(Habit habit) async {
  state = const AsyncValue.loading();
  try {
    final repo = await ref.read(crudHabitRepositoryProvider.future);
    await repo.add(habit.toEntity());
    ref.invalidateSelf(); // Neu laden via build()
  } catch (e, st) {
    state = AsyncValue.error(e, st);
  }
}

// Optimistisches Update (nach Delete):
Future<void> delete(Habit habit) async {
  try {
    final repo = await ref.read(crudHabitRepositoryProvider.future);
    await repo.delete(habit.toEntity());
    state = AsyncValue.data(
      state.value!.where((h) => h.id != habit.id).toList(),
    );
  } catch (e, st) {
    state = AsyncValue.error(e, st);
  }
}
```

<!-- OPTIONAL: Timer-Cleanup bei langlebigen Controllern -->
### 3.5 Timer-Cleanup in Controllern

```dart
@riverpod
class HabitController extends _$HabitController {
  Timer? _debounceTimer;

  @override
  FutureOr<List<Habit>> build() async {
    ref.onDispose(() {
      _debounceTimer?.cancel();
      _debounceTimer = null;
    });
    // ...
  }
}
```

---

## 4. Datenmodelle

### 4.1 Wann Freezed, wann manuell?

| Ansatz                  | Verwende für                                          | Merkmale                                       |
| ----------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| **Freezed**             | Auth, Session, Profile, Value Objects, einfache CRUDs | Unveränderlich, code-generated `copyWith/==`   |
| **Manuell mutable**     | Domain-Modelle mit komplexer Logik (z. B. Habit)      | `late`-Felder, eigene Methoden                 |

### 4.2 Freezed Model

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
abstract class UserModel with _$UserModel {
  const UserModel._(); // nötig für custom Methoden

  const factory UserModel({
    required String id,
    required String email,
    required String name,
    required DateTime createdAt,
    required DateTime updatedAt,
    @Default(false) bool emailVerified,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
```

- `@Default(...)` für Fallback-Werte statt required
- `const UserModel._();` für custom Methoden/Getter
- Generiert automatisch: `copyWith()`, `==`, `hashCode`, `toString()`
- `.freezed.dart` und `.g.dart` einchecken

### 4.3 Manuelles Domain-Model

```dart
class Habit {
  late String id;
  late String name;
  late List<DateTime> finishedDates;

  Habit(); // Parameterloser Konstruktor

  factory Habit.fromEntity(HabitEntity entity) => Habit()
    ..id = entity.id
    ..name = entity.name
    ..finishedDates = entity.finishedDates;

  factory Habit.empty() => Habit()
    ..id = ''
    ..name = ''
    ..finishedDates = [];

  HabitEntity toEntity() { /* ... */ }

  Habit copyWith({String? name, List<DateTime>? finishedDates}) => Habit()
    ..id = id
    ..name = name ?? this.name
    ..finishedDates = finishedDates ?? List.from(this.finishedDates);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Habit && id == other.id && name == other.name;

  @override
  int get hashCode => Object.hash(id, name);
}
```

### 4.4 Entity-Klasse

<!-- Wenn das Backend-SDK keine Basis-Entity-Klasse liefert ({{BACKEND_BASE_ENTITY}} leer), diese Sektion vereinfachen. -->

```dart
import '{{BACKEND_SDK_IMPORT}}';

class HabitEntity {
  final String id;
  final String name;
  final DateTime startDate;

  HabitEntity({
    required this.id,
    required this.name,
    required this.startDate,
  });

  factory HabitEntity.fromMap(Map<String, dynamic> map) => HabitEntity(
    id: map['\$id'] as String? ?? '',
    name: map['name'] as String? ?? '',
    startDate: DateTime.parse(map['startDate'] as String),
  );

  Map<String, dynamic> toMap() => {
    'name': name,
    'startDate': startDate.toIso8601String(),
    // Backend-System-Felder ($id etc.) NICHT einschließen
  };
}
```

### 4.5 Sealed Classes für State-Hierarchien

```dart
sealed class AuthState {
  const AuthState();
}

final class AuthLoggedIn extends AuthState {
  final UserModel user;
  const AuthLoggedIn({required this.user});
}

final class AuthLoggedOut extends AuthState {
  const AuthLoggedOut();
}

final class AuthError extends AuthState {
  final String message;
  const AuthError({required this.message});
}
```

Verwendung mit exhaustivem Pattern Matching:

```dart
return switch (authState) {
  AuthLoggedIn(:final user) => HomeScreen(user: user),
  AuthLoggedOut() => const AuthScreen(),
  AuthError(:final message) => ErrorText(message),
};
```

### 4.6 Enum-Pattern

```dart
enum CuisineType { italian, chinese, mexican, indian }

extension CuisineTypeExtension on CuisineType {
  String get displayName => switch (this) {
        CuisineType.italian => 'Italienisch',
        CuisineType.chinese => 'Chinesisch',
        CuisineType.mexican => 'Mexikanisch',
        CuisineType.indian  => 'Indisch',
      };

  static List<CuisineType> get allValues => CuisineType.values;
}
```

---

## 5. Repository-Pattern

### 5.1 Zweischichtiges Repository

```
data/repository/        → Abstrakte Interfaces (CrudRepository<T>)
application/repository/ → Implementierungen (CrudHabitRepositoryImpl)
```

### 5.2 Abstraktes Interface

```dart
// lib/features/home/data/repository/crud_repository.dart
abstract class CrudRepository<T> {
  Future<List<T>> getAll();
  Future<T?> getById(String id);
  Future<void> add(T entity);
  Future<void> update(T entity);
  Future<void> delete(T entity);
  Future<void> deleteAll();
}
```

### 5.3 Repository-Implementierung

```dart
@riverpod
Future<CrudHabitRepositoryImpl> crudHabitRepository(Ref ref) async {
  final remoteDataSource = ref.watch(remoteDataSourceProvider);
  // OPTIONAL bei Offline-First:
  final localDataSource = ref.watch(localDataSourceProvider);
  final syncManager = ref.watch(syncManagerProvider.notifier);

  return CrudHabitRepositoryImpl(
    remoteDataSource: remoteDataSource,
    localDataSource: localDataSource, // OPTIONAL
    syncManager: syncManager,         // OPTIONAL
  );
}

class CrudHabitRepositoryImpl implements CrudRepository<HabitEntity> {
  final RemoteDataSource remoteDataSource;
  // OPTIONAL bei Offline-First:
  final LocalDataSource localDataSource;
  final SyncManager syncManager;

  @override
  Future<List<HabitEntity>> getAll() async {
    // OPTIONAL bei Offline-First: Erst lokal, dann remote
    final localData = await localDataSource.getAllHabits();
    if (localData.isNotEmpty) return localData;

    final remoteData = await remoteDataSource.fetchHabits();
    for (final entity in remoteData) {
      await localDataSource.upsertHabit(entity, isDirty: false);
    }
    return remoteData;
  }

  @override
  Future<void> add(HabitEntity entity) async {
    // OPTIONAL: Offline-First-Pfad
    await localDataSource.insertHabit(entity, isDirty: true);
    syncManager.triggerSync();
  }
}
```

---

<!-- OPTIONAL: Komplette Sektion 6 (Offline-First) entfernen, wenn das Projekt rein online arbeitet. -->
## 6. Offline-First-Architektur

### 6.1 DAOs (Data Access Objects)

DAOs kapseln alle lokalen DB-Operationen. Sie liegen in `lib/common/database/`:

```dart
class HabitDao {
  final LocalDatabase _localDatabase;

  HabitDao(this._localDatabase);

  Future<List<HabitEntity>> getAllHabits() async {
    final db = await _localDatabase.database;
    final maps = await db.query(
      'habits',
      where: 'is_deleted = ?',
      whereArgs: [0],
      orderBy: 'created_at DESC',
    );
    return maps.map(mapToHabitEntity).toList();
  }

  Future<String> insertHabit(HabitEntity habit, {bool isDirty = true}) async {
    final db = await _localDatabase.database;
    final map = habit.toMap()..['is_dirty'] = isDirty ? 1 : 0;
    await db.insert('habits', map, conflictAlgorithm: ConflictAlgorithm.replace);
    return habit.id;
  }
}
```

### 6.2 SyncManager-Integration

Controller beobachten den SyncManager-State für automatische UI-Updates:

```dart
@override
FutureOr<List<Habit>> build() async {
  ref.listen(syncManagerProvider, (previous, next) {
    if (previous?.status == SyncStatus.syncing &&
        next.status == SyncStatus.success) {
      _debounceTimer?.cancel();
      _debounceTimer = Timer(const Duration(milliseconds: 300), () {
        if (!ref.mounted) return;
        ref.invalidateSelf();
      });
    }
  });
  // ...
}
```

### 6.3 Dirty-State-Tracking

- Jede lokale Mutation setzt `is_dirty = 1` in der Datenbank
- SyncManager verarbeitet die Sync-Queue beim nächsten Online-Übergang
- Nach erfolgreichem Sync wird `is_dirty = 0` gesetzt
- Soft-Deletes: `is_deleted = 1` statt physikalischem Löschen

---

## 7. Datasources

### 7.1 Remote Datasource ({{BACKEND}})

```dart
class RemoteDataSource {
  final BackendServices _services;

  RemoteDataSource(this._services);

  Future<List<HabitEntity>> fetchHabits() async {
    try {
      final result = await _services.databases.listDocuments(
        databaseId: _databaseId,
        collectionId: _collectionId,
      );
      return result.documents.map((d) => HabitEntity.fromMap(d.data)).toList();
    } on BackendException catch (e) {
      if (e.code == 401) rethrow; // Auth-Fehler weitergeben
      rethrow;
    }
  }
}
```

<!-- OPTIONAL: Local Datasource (SQLite) — entfernen wenn kein Offline-First -->
### 7.2 Local Datasource (SQLite)

```dart
class LocalDataSource {
  final HabitDao _habitDao;
  final SyncQueueDao _syncQueueDao;

  LocalDataSource(this._habitDao, this._syncQueueDao);

  Future<String> createHabit(HabitEntity habit) async {
    final id = await _habitDao.insertHabit(habit, isDirty: true);
    await _syncQueueDao.addToQueue(SyncQueueItem(
      entityType: EntityType.habit,
      entityId: habit.id,
      operation: SyncOperation.create,
      data: habit.toMap(),
      createdAt: DateTime.now(),
    ));
    return id;
  }
}
```

### 7.3 Auth-Error-Handling

```dart
// Wrapper für Datasource-Calls, die 401 abfangen sollen:
Future<T> withAuthErrorHandling<T>(
  Ref ref,
  Future<T> Function() call,
) async {
  try {
    return await call();
  } on BackendException catch (e) {
    if (e.code == 401) {
      ref.read(sessionControllerProvider.notifier).invalidateSession();
    }
    rethrow;
  }
}
```

---

## 8. UI und Widgets

### 8.1 Widget-Typ-Auswahl

| Widget-Typ                | Verwende wenn                                                                  |
| ------------------------- | ------------------------------------------------------------------------------ |
| `StatelessWidget`         | Kein State, kein Provider (Icons, einfache Layout-Helfer)                      |
| `ConsumerWidget`          | Provider-Zugriff nötig                                                         |
| `HookConsumerWidget`      | Provider + Flutter Hooks (`useState`, `useTextEditingController`)              |
| `ConsumerStatefulWidget`  | Lifecycle + Provider (selten — nur wenn Hooks nicht ausreichen)                |

### 8.2 Screen-Aufbau

```dart
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final habitsAsync = ref.watch(habitControllerProvider);

    return Scaffold(
      body: habitsAsync.when(
        data: (habits) => _HabitList(habits: habits),
        loading: () => const {{UI_WIDGET_PREFIX}}LoadingIndicator(),
        error: (error, _) => {{UI_WIDGET_PREFIX}}ErrorMessage(
          message: ErrorClassifier.getUserFriendlyMessage(error),
        ),
      ),
    );
  }
}

class _HabitList extends StatelessWidget {
  final List<Habit> habits;
  const _HabitList({required this.habits});

  @override
  Widget build(BuildContext context) { /* ... */ }
}
```

**Regeln:**

- Hauptklasse public, Unter-Widgets private (`_HabitList`, `_EmptyState`)
- AsyncValue IMMER mit `.when(data:, loading:, error:)` — alle drei Fälle
- `{{UI_WIDGET_PREFIX}}LoadingIndicator` für Loading-States
- `{{UI_WIDGET_PREFIX}}ErrorMessage` für Fehler-States
- Build-Methoden > 80 Zeilen in private Sub-Widgets aufteilen

### 8.3 {{UI_WIDGET_PREFIX}} Design-System – Pflicht

> **PFLICHT:** Neue Screens MÜSSEN bestehende {{UI_WIDGET_PREFIX}}-Komponenten verwenden.
> Keine neuen Widgets erstellen, wenn eine Komponente bereits existiert.
> Bei fehlenden Komponenten: Entwickler fragen, **niemals** eigenständig neu erstellen.

**Verfügbare {{UI_WIDGET_PREFIX}}-Widgets** (`{{UI_WIDGET_DIR}}`):

| Widget                                | Verwendung                          |
| ------------------------------------- | ----------------------------------- |
| `{{UI_WIDGET_PREFIX}}Button`          | Primary Action Buttons              |
| `{{UI_WIDGET_PREFIX}}OutlineButton`   | Secondary/Outline Buttons           |
| `{{UI_WIDGET_PREFIX}}TextField`       | Text-Eingabefelder                  |
| `{{UI_WIDGET_PREFIX}}FormField`       | Formular-Eingabefelder mit Label    |
| `{{UI_WIDGET_PREFIX}}Dropdown`        | Dropdown-Auswahl                    |
| `{{UI_WIDGET_PREFIX}}Card`            | Card-Container                      |
| `{{UI_WIDGET_PREFIX}}AppBar`          | Custom App Bar                      |
| `{{UI_WIDGET_PREFIX}}LoadingIndicator`| Loading-Spinner                     |
| `{{UI_WIDGET_PREFIX}}ErrorMessage`    | Inline Fehler-Anzeige               |
| `{{UI_WIDGET_PREFIX}}ErrorWidget`     | Fullscreen Fehler-Widget            |
| `{{UI_WIDGET_PREFIX}}ModalBottomSheet`| Bottom Sheet Modal                  |
| `{{UI_WIDGET_PREFIX}}Snackbar`        | Snackbar (success/error/warning/info)|
| … weitere projektspezifisch ergänzen … | …                                  |

<!-- OPTIONAL: Widgetbook-Pflicht – nur wenn das Projekt Widgetbook nutzt -->
### 8.4 Widgetbook

Jede neue {{UI_WIDGET_PREFIX}}-Komponente MUSS in `widgetbook/main.dart` als `WidgetbookComponent` mit mindestens einem `WidgetbookUseCase` hinterlegt werden. Komponente in die passende Kategorie einsortieren (z. B. *Simple Widgets*, *Form Widgets*, *Layout & Navigation*, *Content Widgets*, *Icons*).

### 8.5 Snackbars

```dart
// RICHTIG:
{{UI_WIDGET_PREFIX}}Snackbar.success(context, AppLocalizations.of(context)!.saveSuccess);
{{UI_WIDGET_PREFIX}}Snackbar.error(context, AppLocalizations.of(context)!.saveError);
{{UI_WIDGET_PREFIX}}Snackbar.warning(context, AppLocalizations.of(context)!.noConnection);
{{UI_WIDGET_PREFIX}}Snackbar.info(context, AppLocalizations.of(context)!.syncRunning);

// FALSCH:
ScaffoldMessenger.of(context).showSnackBar(SnackBar(...)); // direkt
```

`context.mounted` wird vom Widget intern automatisch geprüft.

### 8.6 Bottom Sheets

```dart
// RICHTIG:
{{UI_WIDGET_PREFIX}}ModalBottomSheet.show(
  context: context,
  child: MyBottomSheetContent(),
);

// FALSCH:
showModalBottomSheet(context: context, builder: (_) => ...); // direkt
```

---

## 9. Styling und Design System

### 9.1 Farben — ausschließlich `{{COLORS_CLASS}}`

```dart
// RICHTIG:
color: {{COLORS_CLASS}}.primaryColor
backgroundColor: {{COLORS_CLASS}}.surfaceColor
borderColor: {{COLORS_CLASS}}.errorColor

// FALSCH:
color: Colors.purple          // Material-Farbe
color: Color(0xFFAE5DFF)      // Hardcoded Hex
color: Colors.white           // Stattdessen: {{COLORS_CLASS}}.onSurfaceColor
```

Transparenz: `{{COLORS_CLASS}}.onSurface.withValues(alpha: 0.3)`.

Falls eine benötigte Farbe nicht in `{{COLORS_CLASS}}` existiert: NICHT hardcoden, sondern den Entwickler fragen, ob die Farbe in `{{COLORS_CLASS}}` ergänzt werden soll.

### 9.2 Typografie

<!-- VARIANTE A: Theme.of(context).textTheme (Strategie `theme`) — entfernen wenn nicht benutzt -->
**Strategie A: Material Theme**

```dart
// RICHTIG:
style: Theme.of(context).textTheme.bodyLarge
style: Theme.of(context).textTheme.titleMedium
style: Theme.of(context).textTheme.bodyMedium!.copyWith(color: {{COLORS_CLASS}}.primaryColor)

// FALSCH:
style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500) // Hardcoded
```

<!-- VARIANTE B: Zentrale Klasse {{TEXT_STYLES_CLASS}} (Strategie `class`) — entfernen wenn nicht benutzt -->
**Strategie B: Zentrale `{{TEXT_STYLES_CLASS}}`**

```dart
// RICHTIG:
style: {{TEXT_STYLES_CLASS}}.bodyContent
style: {{TEXT_STYLES_CLASS}}.cardTitle.copyWith(color: {{COLORS_CLASS}}.onPrimary)

// FALSCH:
style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)  // Hardcoded
style: Theme.of(context).textTheme.bodyLarge                  // Theme-Zugriff
style: GoogleFonts.poppins(fontSize: 14)                      // Direkte Google Fonts
```

> **Hinweis**: `{{TEXT_STYLES_CLASS}}`-Getter mit `GoogleFonts` sind NICHT `const`. Widgets, die `{{TEXT_STYLES_CLASS}}` nutzen, können daher NICHT `const` sein.

### 9.3 Spacing und Dimensionen

<!-- VARIANTE A: Zentrale Klasse {{DIMENSIONS_CLASS}} (Strategie `class`) — entfernen wenn nicht benutzt -->
**Strategie A: Zentrale `{{DIMENSIONS_CLASS}}`**

```dart
// RICHTIG:
SizedBox(height: {{DIMENSIONS_CLASS}}.gapL)
EdgeInsets.all({{DIMENSIONS_CLASS}}.paddingXL)
BorderRadius.circular({{DIMENSIONS_CLASS}}.radiusL)
SizedBox(width: {{DIMENSIONS_CLASS}}.iconSizeM)

// FALSCH:
SizedBox(height: 16)                     // Hardcoded
EdgeInsets.all(24)                       // Hardcoded
BorderRadius.circular(16)                // Hardcoded
```

`{{DIMENSIONS_CLASS}}`-Werte sind `static const double` – verwendbar in `const`-Kontexten.

<!-- VARIANTE B: Semantische Konstanten lose (Strategie `loose`) — entfernen wenn nicht benutzt -->
**Strategie B: Semantische Konstanten je Datei**

```dart
// Bevorzugte Werte (Material Design 3):
// Padding: 8, 12, 16, 20, 24
// Border Radius: 8, 12, 14, 16, 20, 24
// Icon Size: 16, 20, 24, 28, 32

// Bei wiederholter Nutzung: private Konstante in der Datei anlegen:
static const _cardPadding = EdgeInsets.all(16.0);
static const _borderRadius = BorderRadius.all(Radius.circular(14.0));
```

### 9.4 Zusammenfassung: Keine Hardcoded Values

| Kategorie       | Quelle                                      | NIEMALS                                                       |
| --------------- | ------------------------------------------- | ------------------------------------------------------------- |
| Farben          | `{{COLORS_CLASS}}.*`                        | `Colors.*`, `Color(0xFF…)`, Hex-Werte                         |
| Typografie      | Strategie A/B siehe oben                    | `TextStyle(…)`, `GoogleFonts.*` direkt im Widget              |
| Padding/Gap     | Strategie A/B siehe oben                    | Nackte Zahlen ohne semantischen Bezug                         |
| Border-Radius   | Strategie A/B siehe oben                    | `BorderRadius.circular(12)` mit nackten Zahlen                |
| Icon-Größen     | Strategie A/B siehe oben                    | `size: 24` mit nackten Zahlen                                 |

---

## 10. Error Handling

### 10.1 Schicht-spezifische Strategie

| Schicht        | Strategie                                                                  |
| -------------- | -------------------------------------------------------------------------- |
| **Datasource** | Exceptions weiterwerfen, 401 ggf. separat behandeln                        |
| **Repository** | try-catch für nicht-kritische Nebeneffekte                                 |
| **Controller** | try-catch, State auf `AsyncValue.error(e, st)`                             |
| **UI**         | `.when(error: …)`, `{{UI_WIDGET_PREFIX}}ErrorMessage`/`{{UI_WIDGET_PREFIX}}Snackbar` |

### 10.2 ErrorClassifier / Mapper

```dart
import 'package:{{PACKAGE_NAME}}/common/utils/error_classifier.dart';

if (ErrorClassifier.isNetworkError(e)) { /* ... */ }
if (ErrorClassifier.isAuthError(e)) { /* ... */ }

final message = ErrorClassifier.getUserFriendlyMessage(e);
```

Pfad: `{{ERROR_CLASSIFIER_PATH}}` (anpassen).

### 10.3 Controller Error-Pattern

```dart
Future<void> createHabit(Habit habit) async {
  state = const AsyncValue.loading();
  try {
    final repo = await ref.read(crudHabitRepositoryProvider.future);
    await repo.add(habit.toEntity());
    ref.invalidateSelf();
  } on BackendException catch (e, st) {
    if (kDebugMode) print('❌ [HabitController.create] $e');
    state = AsyncValue.error(e, st);
  } catch (e, st) {
    if (kDebugMode) print('❌ [HabitController.create] Unexpected: $e');
    state = AsyncValue.error(e, st);
  }
}
```

### 10.4 Auth-Fehler (401)

```dart
on BackendException catch (e) {
  if (e.code == 401) {
    ref.read(sessionControllerProvider.notifier).invalidateSession();
    rethrow;
  }
  rethrow;
}
```

---

## 11. Lokalisierung (i18n) – PFLICHT

**Alle** benutzersichtbaren Strings MÜSSEN über `AppLocalizations` bereitgestellt werden.

```dart
// RICHTIG:
Text(AppLocalizations.of(context)!.habitCreated)
{{UI_WIDGET_PREFIX}}Snackbar.success(context, AppLocalizations.of(context)!.saveSuccess)

// FALSCH:
Text('Habit erstellt')        // Hardcoded String
Text('Habit created')         // Hardcoded String (auch Englisch)
```

Neue Strings in **allen** `.arb`-Dateien in `lib/l10n/` eintragen ({{I18N_LOCALE_COUNT}} Sprachen):
{{I18N_LOCALES_LIST}}

---

## 12. Navigation (GoRouter)

Router-Konfiguration: `{{ROUTER_FILE_PATH}}`

```dart
// RICHTIG:
context.go('/');
context.push('/profile');

// FALSCH:
Navigator.push(context, MaterialPageRoute(...));
Navigator.of(context).pushNamed('/profile');
```

Neue Routen als `GoRoute` im `routes`-Array hinzufügen.

Aktuelle Routen (Beispiel): {{ROUTES_EXAMPLE_LIST}}

Auth-Redirects werden über `SessionController` und `ValueNotifier<SessionState?>` gesteuert.

---

## 13. Formular-Handling

```dart
class HabitEditScreen extends HookConsumerWidget {
  const HabitEditScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final nameController = useTextEditingController(text: '');
    final nameError = useState<String?>(null);
    final l10n = AppLocalizations.of(context)!;

    return Column(
      children: [
        {{UI_WIDGET_PREFIX}}FormField(
          label: l10n.habitName,
          controller: nameController,
          errorText: nameError.value,
          onChanged: (_) => nameError.value = null,
        ),
        {{UI_WIDGET_PREFIX}}Button(
          buttonText: l10n.save,
          onPressed: () {
            if (nameController.text.trim().isEmpty) {
              nameError.value = l10n.fieldRequired;
              return;
            }
            ref.read(habitControllerProvider.notifier)
               .create(Habit.empty()..name = nameController.text.trim());
          },
        ),
      ],
    );
  }
}
```

---

## 14. Code-Qualität und Best Practices

### 14.1 Dart-Spezifisch

- `final` für alle nicht reassignierbaren Variablen
- Named Parameters bevorzugen; `required` wo kein sinnvoller Default existiert
- `const` Konstruktoren und Widgets konsequent einsetzen (reduziert Rebuilds)
- `super.key` statt `Key? key` im Konstruktor
- Sealed Classes für endliche State-Hierarchien
- Pattern Matching mit `switch` Expressions für Sealed Classes und Enums
- Single Quotes (`'text'`), String Interpolation (`'Name: $name'`)
- Trailing Commas bei Parameterlisten (bessere Formatierung)
- Keine `dynamic` Typen – immer explizite Typisierung
- `late` nur wenn Initialisierung vor erstem Zugriff garantiert ist

### 14.2 Widget Best Practices

- Build-Methoden > 80 Zeilen → private Sub-Widgets auslagern
- `const` Widget-Konstruktoren wo möglich
- `MainAxisSize.min` bei `Column`/`Row` in Bottom Sheets
- `ListView.builder` statt `ListView(children: [...])` für > 5 dynamische Elemente
- `MediaQuery.of(context).padding.bottom` für Safe-Area-Berechnungen
- **Kein `setState()`** – Riverpod und Hooks verwenden

### 14.3 Performance

- `ref.watch()` NUR in `build()`, `ref.read()` für Event-Handler
- `const` Widgets konsequent für statische Inhalte
- `ListView.builder` / `ListView.separated` für dynamische Listen (lazy loading)
- Teure Berechnungen in Provider auslagern, nicht in build-Methoden
- `select()` für granulare Rebuilds:

```dart
final name = ref.watch(habitControllerProvider.select(
  (habits) => habits.value?.firstOrNull?.name,
));
```

### 14.4 Null Safety

- Nullable Typen (`String?`) nur wenn `null` eine gültige Business-Bedeutung hat
- `??` für Fallbacks, `?.` für optionale Zugriffe
- **Kein `!` (force unwrap)** außer in Tests oder wenn logisch unmöglich `null`
- In `fromMap()`-Factories defensives Parsing: `map['key'] as String? ?? ''`

### 14.5 Async/Await

- Immer `async/await` statt `.then()`-Chains
- `try/catch` auf der niedrigsten sinnvollen Schicht
- Parallele Calls mit `Future.wait([])`
- Kein fire-and-forget ohne Fehlerbehandlung
- `ref.mounted` prüfen nach jedem `await` in Widgets/Controllern

### 14.6 Immutability

- Freezed-Models: immer `copyWith()` für Updates
- Listen: spread-Operator `[...list, newItem]` statt `list.add()`
- Für mutable Domain-Models: `copyWith()` implementieren

### 14.7 Debug Logging

```dart
if (kDebugMode) {
  print('🔄 [ControllerName.methodName] Starting operation...');
  print('✅ [ControllerName.methodName] Success: $result');
  print('❌ [ControllerName.methodName] Error: $e');
  print('⚠️ [ControllerName.methodName] Warning: $message');
}
```

### 14.8 DartDoc-Kommentare

```dart
/// Creates a new habit with offline-first support.
///
/// Works both online and offline — the repository handles sync logic.
/// Throws [Exception] if the free-tier habit limit is reached.
Future<void> create(Habit habit) async { /* ... */ }
```

- Öffentliche APIs mit `///` DartDoc versehen
- Controller-Klassen: State-Transitions dokumentieren
- Inline-Kommentare (`//`) nur für nicht-offensichtliche Logik
- Keine Kommentare, die nur den Code wiederholen

<!-- OPTIONAL: Premium-/Payment-Block entfernen wenn nicht relevant -->
### 14.9 Payment- / Premium-Features

- RevenueCat wird nur aktiviert, wenn `--dart-define=REVENUECAT_APPLE_KEY` und `REVENUECAT_GOOGLE_KEY` beim Build gesetzt sind
- Ohne diese Keys wird die RevenueCat-Initialisierung automatisch übersprungen
- App-Konfiguration ({{BACKEND}}-IDs, Titel): `{{CONFIG_FILE_PATH}}` (`abstract final class AppConfig`)

---

## 15. Testing

### 15.1 Teststruktur

```
test/
  features/
    home/
      application/    → Unit Tests für Models, Repositories
      data/           → DAO Tests (sqflite_ffi)        <!-- OPTIONAL -->
      presentation/   → Widget Tests für Screens/Controller
  common/
    sync/             → SyncManager/ConflictResolver Tests  <!-- OPTIONAL -->
    database/         → LocalDatabase Tests                  <!-- OPTIONAL -->
```

<!-- OPTIONAL: DAO-Tests nur bei lokaler DB -->
### 15.2 DAO Tests (SQLite FFI)

```dart
void main() {
  setUpAll(() {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  });

  group('HabitDao Tests', () {
    late LocalDatabase database;
    late HabitDao habitDao;

    setUp(() async {
      database = LocalDatabase();
      habitDao = HabitDao(database);
      await database.clearAllData();
    });

    test('inserts and retrieves habit', () async {
      final habit = _createTestHabit();
      await habitDao.insertHabit(habit);
      final retrieved = await habitDao.getHabitById(habit.id);
      expect(retrieved?.name, equals(habit.name));
    });
  });
}
```

### 15.3 Test Commands

```bash
flutter test                 # Alle Tests
flutter test --coverage      # Mit Coverage
```

---

## 16. Build und Codegen

```bash
# Code generieren (nach Änderungen an @riverpod, @freezed, @JsonSerializable)
dart run build_runner build --delete-conflicting-outputs

# Watch-Mode während der Entwicklung:
dart run build_runner watch

# App analysieren:
flutter analyze

# App starten:
flutter run -t lib/main.dart
```

- Generierte `.g.dart` und `.freezed.dart` Dateien MÜSSEN eingecheckt werden
- `--delete-conflicting-outputs` bei Konflikten durch umbenannte Provider

---

## 17. Checkliste für neue Features

1. [ ] Feature-Ordner: `lib/features/[name]/application/`, `data/`, `presentation/`
2. [ ] Entity in `data/entities/` mit `fromMap()`, `toMap()`
3. [ ] <!-- OPTIONAL --> DAO in `lib/common/database/` (wenn SQLite nötig) mit Dirty-State-Tracking
4. [ ] Domain-Model in `application/models/` mit `fromEntity()`, `toEntity()`, `empty()`, `copyWith()`
5. [ ] Abstraktes Repository-Interface in `data/repository/`
6. [ ] Repository-Impl in `application/repository/`
7. [ ] Remote Datasource in `data/datasource/remote_data_source.dart`
8. [ ] <!-- OPTIONAL --> Local Datasource in `data/datasource/local_data_source.dart`
9. [ ] Controller in `presentation/controller/` mit `@riverpod` + `part '*.g.dart'`
10. [ ] Screen in `presentation/screens/` als `ConsumerWidget` oder `HookConsumerWidget`
11. [ ] Route in `{{ROUTER_FILE_PATH}}` hinzufügen
12. [ ] Alle benutzersichtbaren Strings in alle `.arb`-Dateien ({{I18N_LOCALE_COUNT}} Sprachen)
13. [ ] `dart run build_runner build --delete-conflicting-outputs` ausführen
14. [ ] Prüfen: Import-Reihenfolge, nur `package:{{PACKAGE_NAME}}/...`
15. [ ] Prüfen: `{{COLORS_CLASS}}.*` für alle Farben, keine hardcodierten Hex-Werte
16. [ ] Prüfen: `AsyncValue.when()` mit allen drei Fällen (data, loading, error)
17. [ ] Prüfen: `{{UI_WIDGET_PREFIX}}Snackbar.*` statt direktem `ScaffoldMessenger`
18. [ ] <!-- OPTIONAL --> Widgetbook-Eintrag für neue UI-Komponenten in `widgetbook/main.dart`
19. [ ] Tests für neue DAOs und Repository-Logik schreiben

---

## 18. Anti-Patterns (NIEMALS verwenden)

| Anti-Pattern                                | Stattdessen                                                        |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `setState()`                                | Riverpod-Controller oder `useState` Hook                           |
| `Colors.purple`, `Color(0xFFAE5DFF)`        | `{{COLORS_CLASS}}.primaryColor`                                    |
| `TextStyle(fontSize: 16)`                   | Theme oder `{{TEXT_STYLES_CLASS}}` (je nach Strategie)             |
| Hardcoded Dimensionen                       | `{{DIMENSIONS_CLASS}}.*` oder semantische Konstanten               |
| `Navigator.push()`                          | `context.go()` / `context.push()` (GoRouter)                       |
| `showModalBottomSheet()` direkt             | `{{UI_WIDGET_PREFIX}}ModalBottomSheet.show()`                      |
| `ScaffoldMessenger…showSnackBar()` direkt   | `{{UI_WIDGET_PREFIX}}Snackbar.success/error/warning/info()`        |
| `Icons.add` (Material Icons)                | Projektspezifische Icons oder `{{UI_WIDGET_PREFIX}}SquareButton`   |
| Hardcodierte Strings im Widget              | `AppLocalizations.of(context)!.key`                                |
| `dynamic` Typen                             | Explizite Typisierung                                              |
| `!` Force-Unwrap                            | `??` Fallback oder expliziter Null-Check                           |
| `.then()` Chains                            | `async/await`                                                      |
| Relative Imports (`../`)                    | `package:{{PACKAGE_NAME}}/...`                                     |
| `list.add(item)` auf Model-Listen           | `[...list, item]` (Spread, neues Objekt)                           |
| Direct {{BACKEND}}-Calls in Controllern     | Immer über Repository → Datasource                                 |
| Blocking `ref.read()` ohne `.future`        | `await ref.read(provider.future)`                                  |

---

<!--
================================================================================
  Anpassungs-Anleitung (nach dem Kopieren ins Zielprojekt durchgehen)
================================================================================

  1. Kopf
     - Titel und Beschreibung anpassen.
     - Hinweis auf `styling-guidelines.md` behalten/entfernen.

  2. Projektarchitektur (Sektion 1)
     - {{PROJECT_STRUCTURE_DETAILS}}: vollständigen Verzeichnis-Tree einfügen.
     - Layer-Regeln-Tabelle: bei Bedarf ergänzen (z. B. `ui/`-Layer falls vorhanden).
     - Bei Offline-First: Datenfluss-Diagramm um SyncManager-Pfad erweitern.

  3. Package & Imports (Sektion 2)
     - {{PACKAGE_NAME}} überall (auch in den Beispielen) ersetzen.
     - {{BACKEND_SDK_IMPORT}} setzen.
     - Dateinamen-Tabelle: DAO-Zeile entfernen bei kein Offline-First.

  4. State Management (Sektion 3)
     - {{STATE_HOOK_PROVIDER_IMPORT}} bei Bedarf anpassen (alternative Riverpod-Pakete).
     - Timer-Cleanup-Beispiel (3.5) bei Bedarf entfernen.

  5. Datenmodelle (Sektion 4)
     - {{BACKEND_BASE_ENTITY}} setzen oder Entity-Beispiel anpassen.

  6. Repository / Datasource (Sektion 5+7)
     - OPTIONAL-Zeilen bei Offline-First behalten oder löschen.

  7. Offline-First (Sektion 6)
     - Gesamte Sektion entfernen wenn nicht relevant.

  8. UI (Sektion 8)
     - {{UI_WIDGET_PREFIX}}, {{UI_WIDGET_DIR}}: Werte setzen.
     - Widget-Tabelle 8.3: Projektliste der hauseigenen Widgets einsetzen.
     - 8.4 Widgetbook: bei nicht-Nutzung entfernen.

  9. Styling (Sektion 9)
     - {{COLORS_CLASS}} setzen.
     - Eine der Typografie-Strategien (Theme vs. {{TEXT_STYLES_CLASS}}) löschen.
     - Eine der Dimensions-Strategien ({{DIMENSIONS_CLASS}} vs. semantische Konstanten) löschen.
     - 9.4-Tabelle entsprechend bereinigen.

  10. i18n (Sektion 11)
      - {{I18N_LOCALE_COUNT}} und {{I18N_LOCALES_LIST}} setzen.

  11. Navigation (Sektion 12)
      - {{ROUTER_FILE_PATH}} und {{ROUTES_EXAMPLE_LIST}} setzen.

  12. Premium (Sektion 14.9)
      - Bei Projekten ohne Payments: kompletten Abschnitt entfernen.

  13. Testing (Sektion 15)
      - DAO-Test-Block bei nicht-SQLite entfernen.

  14. Checkliste & Anti-Patterns (Sektion 17, 18)
      - Optional-Zeilen entsprechend der Projekt-Schalter behalten/streichen.

  15. Final Check
      - `grep -n "{{" .claude/rules/coding-guidelines.md` darf keine Treffer liefern.
      - Alle HTML-Kommentare ("OPTIONAL", "VARIANTE A/B", "Beispielblock", diese Anleitung) entfernen.

================================================================================
-->
