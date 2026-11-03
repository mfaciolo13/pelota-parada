# @potrero/mobile

App móvil para organizadores y equipos. Expo + expo-router, también corre en web.

## Cómo levantarla

Desde la raíz del repo:

```sh
npm install
npm run start --workspace @potrero/mobile      # Expo Go o build de desarrollo
npm run web --workspace @potrero/mobile        # en el navegador
```

## Design system y tema

Los tokens y componentes base viven en [theme/](theme/) y [ui/](ui/). La fuente de verdad es la página **Tokens** del [Figma](https://www.figma.com/design/rHZdibYb6E9orNdce1Y2Qm/POTRERO?node-id=1-99). La pantalla [app/showcase.tsx](app/showcase.tsx) muestra todos los tokens y componentes y sirve para compararlos con el Figma. Solo existe en desarrollo: la ruta está protegida con `__DEV__` en el layout raíz y el botón de Inicio que la abre no se renderiza en otros builds.

El tema es propio: solo `StyleSheet.create` y hooks, sin librerías de estilos. Soporta esquema claro y oscuro siguiendo el del sistema.

### Tokens (`theme/tokens.ts`)

| Export | Qué es |
| --- | --- |
| `colorTokens` | Cada color del Figma con su valor `light` y `dark`. `colors.light` y `colors.dark` son las paletas ya armadas. |
| `spacing` | `s1` 4, `s2` 8, `s3` 12, `s4` 16, `s5` 20, `s6` 24, `s8` 32, `s14` 56. Más `touch` 44 (alto mínimo tocable), `tabBottom` 22 y `webContainer` 1160. |
| `radius` | `sm` 9, `md` 12, `field` 14, `lg` 16, `xl` 20, `pill` 999. |
| `stroke` | `hair` 1, `field` 1.5, `icon` 2, `iconSm` 2.2. |
| `typography` | Estilos de texto con familia, tamaño e interlineado. `display*` usan Barlow Condensed; el resto Inter. |
| `shadow.raise` | Sombra de la tarjeta destacada. |

Los nombres de color son los del Figma (`bg`, `card`, `ink`, `mute`, `pitch`, `lime`, `green`, `okFg`/`okBg`, `badFg`/`badBg`, etc.). `tokens.ts` no importa react-native, así que se testea en Node.

### Fuentes

Se cargan con `expo-font` desde `@expo-google-fonts/barlow-condensed` e `@expo-google-fonts/inter` (solo los pesos que usa el tema: Barlow Condensed 700 y 800, Inter 400 y 700). El layout raíz ([app/_layout.tsx](app/_layout.tsx)) llama a `useThemeFonts()` y mantiene el splash hasta que estén cargadas. No hace falta hacer nada más para usarlas: `typography` ya apunta a los nombres registrados.

### Usar el tema en un componente

```tsx
import { makeStyles, useTheme } from "@/theme";
import { Card, Text } from "@/ui";

const useStyles = makeStyles((t) => ({
  row: { flexDirection: "row", gap: t.spacing.s2, padding: t.spacing.s4 },
  badge: { backgroundColor: t.colors.okBg, borderRadius: t.radius.pill },
}));

export function Ejemplo() {
  const t = useTheme();          // tema actual: colors, spacing, radius, stroke, typography, shadow, scheme
  const styles = useStyles();    // StyleSheet.create con el tema, cacheado por esquema

  return (
    <Card style={styles.row}>
      <Text variant="title">Los Pibes</Text>
      <Text variant="secondary" color="mute" style={{ color: t.colors.okFg }}>
        Pagado
      </Text>
    </Card>
  );
}
```

- `useTheme()` devuelve el tema del esquema actual. Usarlo para valores puntuales en línea.
- `makeStyles(fn)` recibe el tema y devuelve un hook de estilos. Llama a `StyleSheet.create` una vez por esquema. Es la forma preferida para estilos estáticos.
- `ThemeProvider` ya está en el layout raíz. Acepta `scheme="light" | "dark"` para forzar un esquema en una subárbol (la pantalla showcase lo usa para el toggle).

### Componentes base (`ui/`)

| Componente | Para qué | Props principales |
| --- | --- | --- |
| `Text` | Todo texto de la app. | `variant` (clave de `typography`, por defecto `body`), `color` (clave de color, por defecto `ink`), `align`, `uppercase`. |
| `Button` | Acciones. Siete variantes del Figma. | `label`, `variant` (`primary`, `lime`, `outline`, `soft`, `danger`, `ghost`, `glass`), `size` (`sm`, `md`, `lg`), `loading`, `disabled`, `fullWidth`, `onPress`. |
| `Card` | Bloques de contenido. | `variant` (`default`, `raised`, `debt`, `active`, `dark`, `placeholder`), `padding` (clave de `spacing` o `none`). |
| `Chip` | Etiquetas de estado y rol. | `label`, `tone` (`ok`, `warn`, `bad`, `info`, `neutral`, `lime`, `glass`). |
| `Field` | Campos de texto con etiqueta, ayuda y error. | `label`, `hint`, `error`, `prefix` (por ejemplo `"$"`), `multiline`, `maxLength` (muestra contador si es multilínea) y todas las props de `TextInput`. |
| `Screen` | Contenedor de pantalla: fondo, área segura, scroll y ancho máximo en web. | `scroll` (por defecto `true`), `edges`, `contentStyle`. |

`glass` y `lime` (en `Button` y `Chip`) están pensados para ir sobre fondo `pitch`, por ejemplo dentro de `<Card variant="dark">`.

### Agregar o cambiar un token

1. Cambiarlo primero en el Figma.
2. Actualizar `theme/tokens.ts` con el mismo nombre.
3. Revisar la pantalla showcase y correr `npm run test --workspace @potrero/mobile`.

## Lint, tipos y tests

```sh
npm run lint --workspace @potrero/mobile
npm run typecheck --workspace @potrero/mobile
npm run test --workspace @potrero/mobile
```

Las rutas tipadas de expo-router se generan en `.expo/types` al correr `expo start`. Si `typecheck` falla por una ruta nueva, levantá la app una vez para regenerarlas.
