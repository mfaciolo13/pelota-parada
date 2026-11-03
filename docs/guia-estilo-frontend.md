# Guía de estilo del frontend

Reglas para escribir código en `apps/mobile` (Expo + React Native + TypeScript). El objetivo es que cualquier pantalla o componente se lea igual, sin importar quién lo escribió.

## 1. Idioma

- Identificadores en inglés: componentes, hooks, funciones, variables, props, tipos.
- Comentarios y textos visibles para el usuario en español.

## 2. Declaración de funciones

Todo es `const` con función flecha. No se usa la palabra `function` en el nivel de módulo ni dentro de hooks.

```tsx
// Bien
export const Chip = ({ label, tone = "neutral" }: ChipProps) => { ... };
export const useTheme = (): Theme => useContext(ThemeContext);

// Mal
export function Chip({ label }: ChipProps) { ... }
```

Los genéricos van antes de los paréntesis: `const makeStyles = <T extends Foo>(...) => { ... }`.

## 3. Exports

| Qué | Cómo se exporta |
| --- | --- |
| Pantallas y layouts en `app/` | `export default` al final del archivo |
| Componentes, hooks y utilidades | `export const` nombrado |

Las pantallas se definen como `const` y se exportan por defecto en una línea aparte, al final:

```tsx
const Index = () => { ... };

export default Index;
```

Expo Router exige el export por defecto en `app/`. En el resto del código se usan exports nombrados para que el autocompletado y los renombres funcionen bien.

## 4. Funciones en props

Evitar funciones anónimas en props. Declarar el handler con nombre y pasarlo por referencia.

```tsx
// Bien
const handleSave = () => { save(form); };
<Button label="Guardar" onPress={handleSave} />

// Evitar
<Button label="Guardar" onPress={() => save(form)} />
```

- Nombrar los handlers `handleXxx` dentro del componente y las props `onXxx`.
- Si el handler necesita un argumento distinto por elemento (por ejemplo en una lista), extraer un componente hijo que reciba el id y arme su propio handler.
- Si el handler pasa a un hijo memorizado, envolverlo con `useCallback`.
- Excepción aceptada: props que por API reciben una función de render, como `style={({ pressed }) => ...}` o `renderItem`.

## 5. Componentes

- Un componente por archivo, con el nombre del archivo igual al del componente.
- Tipar las props con un `type` llamado `<Componente>Props`, declarado arriba del componente.
- Desestructurar las props en el parámetro y dar los valores por defecto ahí.
- Los componentes de presentación van en `ui/`. Las pantallas van en `app/` y solo arman y conectan componentes.
- Mantener las pantallas finas. La lógica de datos o de estado va en hooks propios.

## 6. Estilos y tema

- Los colores, espacios, radios y tipografías salen siempre del tema, nunca se escriben a mano.
- Para estilos estáticos usar `makeStyles` y el hook `useStyles()` que devuelve.
- Evitar objetos de estilo inline. Si el valor depende del tema o de props, calcularlo arriba del `return`.
- Usar los componentes `Text`, `Button`, `Card`, `Field`, `Chip` y `Screen` de `ui/` en lugar de los de React Native cuando exista equivalente.

## 7. Hooks

- Nombre con prefijo `use`.
- Solo se llaman en el nivel superior del componente o de otro hook.
- Un hook hace una cosa. Si crece, se divide.

## 8. Importaciones

- Usar el alias `@/` para todo lo que no sea del mismo directorio.
- Orden: paquetes externos, alias `@/`, rutas relativas, con una línea en blanco entre grupos.
- Importar desde el índice de cada carpeta (`@/ui`, `@/theme`) y no desde el archivo interno.

## 9. Tipos

- Evitar `any`. Usar `unknown` y acotar.
- Preferir `type` sobre `interface`, salvo que se necesite extender.
- No duplicar tipos que ya vienen de `packages/`.

## 10. Calidad antes de abrir el PR

```bash
npx tsc --noEmit -p apps/mobile
npx eslint apps/mobile
```

Ambos comandos tienen que terminar sin errores. El flujo de ramas, commits y PR está en [CONTRIBUTING.md](../CONTRIBUTING.md).
