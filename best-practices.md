# Best Practices für Angular-Webanwendungen

Diese README bietet eine Sammlung von Best Practices, die bei der Entwicklung von Angular-Anwendungen helfen, effizient, skalierbar und wartbar zu bleiben.

---

## Inhaltsverzeichnis

1. [Change Detection optimieren](#1-change-detection-optimieren)  
2. [Props-Objekte als Input verwenden](#2-props-objekte-als-input-verwenden)  
3. [Den `async` Pipe nutzen](#3-den-async-pipe-nutzen)  
4. [Signals verwenden](#4-signals-verwenden)  
5. [Komponenten Lazy Loaden](#5-komponenten-lazy-loaden)  
6. [Empfohlene Dependencies](#6-empfohlene-dependencies)  
7. [Version Management mit Changesets](#7-version-management-mit-changesets)  

---

## 1. Change Detection optimieren

**Empfehlung:** Setze `ChangeDetectionStrategy.OnPush` für alle Komponenten.  

**Warum?**  
Der `OnPush`-Strategie hilft, die Change Detection nur bei Änderungen der Eingabewerte (Inputs) oder des lokalen States der Komponente auszuführen. Dies spart Ressourcen und verbessert die Performance.

```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{ title }}</div>`
})
export class ExampleComponent {
  @Input() title: string;
}
```

---

## 2. Props-Objekte als Input verwenden

**Empfehlung:** Übergeben Sie ganze Objekte anstelle einzelner Properties als Inputs.  

**Warum?**  
Das Reduzieren einzelner Properties zu einem einzigen Objekt minimiert die Change Detection und sorgt für sauberen und wartbaren Code. 

```typescript
@Component({
  selector: 'app-user',
  template: `<p>{{ user.name }}</p>`
})
export class UserComponent {
  @Input() user: { name: string, age: number };
}
```

Bei Verwendung von Signals in Verbindung mit Observables, trifft dieser Punkt nur bedingt zu, da die Change Detection hinsichtlich Signals optimiert wurde.

---

## 3. Den `async` Pipe nutzen

**Empfehlung:** Vermeiden Sie manuelles `subscribe` und verwenden Sie stattdessen den `async` Pipe.  

**Warum?**  
Der `async` Pipe übernimmt das automatische Abonnieren und Aufräumen von Observables und reduziert das Risiko von Speicherlecks.

```typescript
@Component({
  selector: 'app-data',
  template: `<div>{{ data$ | async }}</div>`
})
export class DataComponent {
  data$ = this.dataService.getData();
}
```

**Falls ein manuelles `subscribe` notwendig ist:**  
Nutzen Sie den `OnDestroy` Lifecycle Hook oder das `takeUntilDestroyed` Pattern.

---

## 4. Signals verwenden

**Empfehlung:** Verwenden Sie `Signals`, wenn verfügbar, und konvertieren Sie Observables zu `Signals`.  

**Warum?**  
`Signals` bieten eine deklarative API, die effizienter und leichter zu handhaben ist als Observables. Sie reduzieren Boilerplate-Code und verbessern die Lesbarkeit.

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-example',
  template: `<p>{{ data() }}</p>`
})
export class ExampleComponent {
  data = toSignal(this.dataService.getData());
}
```

---

## 5. Komponenten Lazy Loaden

**Empfehlung:** Verwenden Sie Lazy Loading für Komponenten, um die Performance und Ladezeiten zu optimieren.  

### Beispiel: Lazy Loading mit Standalone Components
```typescript
const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) }
];
```

---

## 6. Empfohlene Dependencies

Diese Tools und Libraries helfen bei der Entwicklung und Skalierung moderner Angular-Anwendungen:  

- **[effect-ts](https://github.com/Effect-TS/core):** Funktionale Programmierung mit TypeScript.  
- **[moize](https://github.com/planttheidea/moize):** Memoization-Library für effizientes Caching.  
- **[NX](https://nx.dev):** Toolkit für Monorepos und skalierbare Projektstruktur.  
- **[Remote Data TS](https://github.com/devexperts/remote-data-ts):** Modellierung von asynchronen Datenzuständen.  
- **[Changesets](https://github.com/changesets/changesets):** Einfaches Version Management für Monorepos.  

---

## 7. Verwenden Sie `trackBy` in `*ngFor`

**Empfehlung:** Verwenden Sie die `trackBy`-Funktion bei der Verwendung von `*ngFor`, um die Performance bei der Iteration über große Listen zu verbessern.

**Warum?**  
Ohne `trackBy` überprüft Angular die gesamte Liste auf Änderungen. Mit einer `trackBy`-Funktion kann Angular Elemente effizienter tracken und nur geänderte Elemente aktualisieren.

### Beispiel:
```typescript
@Component({
  selector: 'app-list',
  template: `
    <ul>
      <li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
    </ul>
  `
})
export class ListComponent {
  @Input() items: { id: number, name: string }[] = [];

  trackById(index: number, item: { id: number }): number {
    return item.id;
  }
}
```

---

## 8. Nutzung von `trackBy` mit der neuen Control Flow Syntax in Angular 18

Mit der neuen Syntax ersetzt die deklarative `for`-Direktive das herkömmliche `*ngFor`. Die `trackBy`-Logik bleibt relevant und kann direkt integriert werden.

### Beispiel:
```typescript
@Component({
  selector: 'app-list-angular-18',
  template: `
    <ng-container *for="let item of items; track item.id">
      <li>{{ item.name }}</li>
    </ng-container>
  `
})
export class ListComponent {
  @Input() items: { id: number, name: string }[] = [];
}
```

### Erklärung:
- **`track item.id`:** Hier wird direkt angegeben, dass Angular die `id`-Eigenschaft des Objekts als eindeutigen Schlüssel verwenden soll. Dies vereinfacht die bisherige Verwendung von `trackBy`.

### Vorteile:
- **Lesbarkeit:** Die neue Syntax ist klarer und fügt sich besser in moderne Angular-Templates ein.
- **Weniger Boilerplate:** Es entfällt die Notwendigkeit, eine separate `trackByFn` im Code zu definieren, wenn der Schlüsselfeldname feststeht.