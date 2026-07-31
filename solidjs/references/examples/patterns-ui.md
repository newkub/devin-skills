---
title: UI Patterns
description: UI patterns สำหรับ SolidJS
---

# UI Patterns

UI patterns สำหรับ SolidJS

## Portal for Modals

```tsx
import { Portal, createSignal, Show } from 'solid-js';

function Modal() {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Show when={isOpen()}>
        <Portal mount={document.getElementById('modal-root')}>
          <div class="modal-overlay">
            <div class="modal">
              <h2>Modal Content</h2>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
```

## Dynamic Component Loading

```tsx
import { Dynamic, createSignal, lazy } from 'solid-js';

const ComponentA = lazy(() => import('./ComponentA'));
const ComponentB = lazy(() => import('./ComponentB'));

function DynamicLoader() {
  const [current, setCurrent] = createSignal('A');

  return (
    <div>
      <button onClick={() => setCurrent('A')}>Load A</button>
      <button onClick={() => setCurrent('B')}>Load B</button>
      <Dynamic 
        component={current() === 'A' ? ComponentA : ComponentB} 
      />
    </div>
  );
}
```

## mergeProps for Composing Props

```tsx
import { mergeProps } from 'solid-js/web';

function Button(props) {
  const baseProps = {
    class: 'btn',
    type: 'button'
  };
  
  const merged = mergeProps(baseProps, props);
  
  return <button {...merged} />;
}

// Usage
<Button class="btn-primary" onClick={handleClick}>
  Click me
</Button>
```

## splitProps for Prop Separation

```tsx
import { splitProps } from 'solid-js/web';

function Card(props) {
  const [local, others] = splitProps(props, ['title', 'description']);
  
  return (
    <div class="card" {...others}>
      <h2>{local.title}</h2>
      <p>{local.description}</p>
    </div>
  );
}

// Usage
<Card 
  title="Card Title" 
  description="Card description"
  class="custom-class"
  data-id="123"
/>
```

## children Helper for Slots

```tsx
import { children } from 'solid-js';

function Card(props) {
  const header = children(() => props.header);
  const body = children(() => props.body);
  const footer = children(() => props.footer);
  
  return (
    <div class="card">
      <div class="card-header">{header()}</div>
      <div class="card-body">{body()}</div>
      <div class="card-footer">{footer()}</div>
    </div>
  );
}

// Usage
<Card 
  header={<h2>Title</h2>}
  body={<p>Content</p>}
  footer={<button>Action</button>}
/>
```

## Index vs For Comparison

```tsx
import { For, Index, createSignal } from 'solid-js';

function ListComparison() {
  const [items, setItems] = createSignal([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]);

  return (
    <div>
      <h3>For (keyed by id)</h3>
      <For each={items()}>
        {(item) => (
          <div>
            <input 
              value={item.name} 
              onInput={(e) => {
                setItems(items => 
                  items.map(i => 
                    i.id === item.id ? { ...i, name: e.target.value } : i
                  )
                );
              }}
            />
          </div>
        )}
      </For>
      
      <h3>Index (index-based)</h3>
      <Index each={items()}>
        {(item, index) => (
          <div>
            <input 
              value={item().name} 
              onInput={(e) => {
                setItems(items => {
                  const newItems = [...items()];
                  newItems[index()] = { ...newItems[index()], name: e.target.value };
                  return newItems;
                });
              }}
            />
          </div>
        )}
      </Index>
    </div>
  );
}
```
