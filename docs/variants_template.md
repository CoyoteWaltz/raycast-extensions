# URL Template Design (URL Editor Pro)

## Design Goals

The URL template system is designed to:

* Allow users to generate URL variants **without entering an edit form**
* Be fully **keyboard-driven**
* Generate multiple URL variants **from the current page URL**
* Display results as a **list** for quick selection
* Support **query removal** and **path shortening**
* Be powerful for advanced users, yet easy to understand

---

## Template Philosophy

* Templates describe **what the URL looks like**
* Expansion rules describe **how many URLs are generated**
* The system favors **string templates** over DSLs
* Complexity lives in the implementation, not in the user’s mental model

---

## Template Syntax

### Basic Format

Templates use a Mustache-style syntax:

```
{{variable}}
```

Example:

```
{{protocol}}://{{host}}{{path}}
```

---

## Built-in Variables

### URL Components

| Variable       | Description                  |
| -------------- | ---------------------------- |
| `{{url}}`      | Original full URL            |
| `{{protocol}}` | `http` / `https`             |
| `{{host}}`     | Hostname (e.g. `github.com`) |
| `{{hostname}}` | Alias of `host`              |
| `{{port}}`     | Port number (if any)         |
| `{{path}}`     | Full path without query      |
| `{{query}}`    | Original query string        |
| `{{hash}}`     | URL hash                     |

---

### Path Variables

#### Path Segments

```
/raycast/extensions/pull/22745
→ ["raycast", "extensions", "pull", "22745"]
```

#### Path Level Selection

```
{{path:1}}    → /raycast
{{path:2}}    → /raycast/extensions
{{path:-1}}   → full path
```

---

## Path Expansion (Core Feature)

### `{{path:*}}` — Automatic Hierarchy Expansion

```
{{protocol}}://{{host}}{{path:*}}
```

**Behavior**

* Expands from the first path segment to the full path
* Path depth is detected dynamically
* Generates one URL per level

**Example**

Current URL:

```
https://github.com/raycast/extensions/pull/22745
```

Generated URLs:

```
https://github.com/raycast
https://github.com/raycast/extensions
https://github.com/raycast/extensions/pull
https://github.com/raycast/extensions/pull/22745
```

---

## Query Handling

### Default Behavior

* `{{path}}` **does not include query parameters**

### Explicit Control (Optional / Roadmap)

```
{{path+query}}          // keep query
{{query:remove}}        // remove query
{{query:keep(a,b)}}     // whitelist parameters
```

---

## Template Groups

Templates are designed to be used in **groups** and triggered via keyboard shortcuts.

```json
{
  "name": "Shorten URL",
  "trigger": "⌘S",
  "templates": [
    "{{protocol}}://{{host}}",
    "{{protocol}}://{{host}}{{path:*}}"
  ]
}
```

**User Flow**

1. Copy or input URL
2. Trigger template group via shortcut
3. Navigate generated list with arrow keys
4. Press Enter to copy

---

## UI / UX Recommendations

* Display generated URLs in a Raycast list
* Show only the shortened path in the title
* Optional subtitle:

```
Generated from path hierarchy (4 levels)
```

This makes expansion behavior transparent to users.

---

## Implementation Notes

### Parsing Flow

1. Parse URL using `new URL(input)`
2. Split path into segments
3. Build template context
4. Detect expansion variables (`*`)
5. Render and expand templates
6. Deduplicate results
7. Render list

### Template Output Type

```ts
type TemplateResult = string | string[];
```

---

## Why This Design Works

* No DSL or scripting required
* Low cognitive load for users
* Powerful enough for advanced workflows
* Easy to extend in future versions
* Perfectly aligned with Raycast’s keyboard-first UX

---

## Future Extensions (Optional)

* Range expansion: `{{path:1..*}}`
* Filters: `{{path:* | max(3)}}`
* Domain-aware variables (e.g. GitHub repo paths)
* Custom user-defined variables

---

> **`{{path:*}}` solves 80% of real-world use cases**
> while keeping the system simple, predictable, and fast.
