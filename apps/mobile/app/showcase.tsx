import { useState, type ReactNode } from "react";
import { View } from "react-native";

import {
  colorTokens,
  makeStyles,
  ThemeProvider,
  typography,
  useTheme,
  type ColorName,
  type Scheme,
  type TypographyName,
} from "@/theme";
import { Button, Card, Chip, Field, Screen, Text } from "@/ui";

const Showcase = () => {
  const [scheme, setScheme] = useState<Scheme | undefined>(undefined);
  return (
    <ThemeProvider scheme={scheme}>
      <Content scheme={scheme} onSchemeChange={setScheme} />
    </ThemeProvider>
  );
};

const useStyles = makeStyles((t) => ({
  section: { gap: t.spacing.s3, marginBottom: t.spacing.s8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: t.spacing.s2, alignItems: "center" },
  spaceBetween: { justifyContent: "space-between" },
  colorSample: { width: 72, gap: t.spacing.s1 },
  swatch: { height: 40, borderRadius: t.radius.md, borderWidth: t.stroke.hair, borderColor: t.colors.line },
  grow: { flex: 1 },
}));

type ContentProps = { scheme?: Scheme; onSchemeChange: (scheme?: Scheme) => void };

const Content = ({ scheme, onSchemeChange }: ContentProps) => {
  const t = useTheme();
  const styles = useStyles();
  const [name, setName] = useState("");
  const [fee, setFee] = useState("20000");
  const [notice, setNotice] = useState("");

  const handleSystemScheme = () => {
    onSchemeChange(undefined);
  };
  const handleLightScheme = () => {
    onSchemeChange("light");
  };
  const handleDarkScheme = () => {
    onSchemeChange("dark");
  };

  return (
    <Screen>
      <View style={styles.section}>
        <Text variant="displayTitle">Design system</Text>
        <Text color="mute">Tema {t.scheme === "dark" ? "oscuro" : "claro"}. Tokens y componentes base.</Text>
        <View style={styles.row}>
          <Button label="Sistema" size="sm" variant={scheme === undefined ? "primary" : "ghost"} onPress={handleSystemScheme} />
          <Button label="Claro" size="sm" variant={scheme === "light" ? "primary" : "ghost"} onPress={handleLightScheme} />
          <Button label="Oscuro" size="sm" variant={scheme === "dark" ? "primary" : "ghost"} onPress={handleDarkScheme} />
        </View>
      </View>

      <Section title="Tipografia">
        {(Object.keys(typography) as TypographyName[]).map((variant) => (
          <View key={variant}>
            <Text variant={variant} uppercase={variant === "displaySection"}>
              {TYPOGRAPHY_SAMPLES[variant]}
            </Text>
            <Text variant="secondary" color="mute">
              {variant} · {typography[variant].fontSize}/{typography[variant].lineHeight}
            </Text>
          </View>
        ))}
      </Section>

      <Section title="Color">
        <View style={styles.row}>
          {(Object.keys(colorTokens) as ColorName[]).map((color) => (
            <View key={color} style={styles.colorSample}>
              <View style={[styles.swatch, { backgroundColor: t.colors[color] }]} />
              <Text variant="overline" numberOfLines={1}>
                {color}
              </Text>
              <Text variant="overline" color="mute">
                {t.colors[color]}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Boton">
        <View style={styles.row}>
          <Button label="Ya pague la fecha, avisar" />
          <Button label="Crear cuenta" variant="lime" />
          <Button label="Ver estado de todas las fechas" variant="outline" />
        </View>
        <View style={styles.row}>
          <Button label="Rechazar" variant="soft" />
          <Button label="Dar de baja y avisar" variant="danger" />
          <Button label="Desestimar" variant="ghost" />
          <Button label="Publicar fecha 4" disabled />
          <Button label="Guardando..." loading />
        </View>
        <View style={styles.row}>
          <Button label="Copiar alias" variant="outline" size="sm" />
          <Button label="Invitar por link" variant="outline" size="sm" />
          <Button label="Publicar fecha 4" size="lg" style={styles.grow} />
        </View>
        <Card variant="dark">
          <View style={styles.row}>
            <Button label="Compartir" variant="glass" size="sm" />
            <Button label="Mirar torneos" variant="lime" size="sm" />
          </View>
        </Card>
      </Section>

      <Section title="Etiqueta">
        <View style={styles.row}>
          <Chip label="Habilitado · 2°" tone="ok" />
          <Chip label="Pagado" tone="ok" />
          <Chip label="Informado · a confirmar" tone="warn" />
          <Chip label="Inscripcion abierta" tone="warn" />
          <Chip label="Vencido" tone="bad" />
          <Chip label="W.O. por deuda" tone="bad" />
          <Chip label="Fecha 3" tone="info" />
          <Chip label="Arbitro · J. Cabrera" tone="info" />
          <Chip label="Finalizado" tone="neutral" />
          <Chip label="Sin horario" tone="neutral" />
        </View>
        <Card variant="dark">
          <View style={styles.row}>
            <Chip label="La Previa · capitan: vos" tone="lime" />
            <Chip label="Organizas vos · Fecha 4" tone="lime" />
            <Chip label="Cordoba" tone="glass" />
          </View>
        </Card>
      </Section>

      <Section title="Tarjeta">
        <Card>
          <Text variant="title">Tarjeta estandar</Text>
          <Text variant="secondary" color="mute">
            Fondo card, borde line, radio 16, padding 16. Se separa del fondo con borde, no con sombra.
          </Text>
        </Card>
        <Card variant="raised">
          <Text variant="overline" color="mute" uppercase>
            Proximo partido · Fecha 3
          </Text>
          <Text variant="displayTime">jue 21:00</Text>
          <Text variant="title">Los Pibes vs La Previa</Text>
        </Card>
        <Card variant="debt">
          <View style={[styles.row, styles.spaceBetween]}>
            <Text variant="overline" color="badFg" uppercase>
              Deuda acumulada
            </Text>
            <Chip label="1 fecha vencida" tone="bad" />
          </View>
          <Text variant="displayTime" color="badFg">
            $25.000
          </Text>
          <Text variant="secondary" color="badFg">
            Fecha 2 ($20.000) + multa ($5.000).
          </Text>
        </Card>
        <Card variant="active">
          <Text variant="title">Tu review</Text>
          <Text variant="secondary" color="mute">
            Borde green 1.5: el bloque que te pertenece o esta en edicion.
          </Text>
        </Card>
        <Card variant="dark">
          <Text variant="overline" color="onPitchMute" uppercase>
            En juego
          </Text>
          <Text variant="displayTable" color="onPitch">
            Copa Apertura 2026
          </Text>
          <Text variant="secondary" color="onPitchMute">
            Fecha 3 de 9 · sos 2°
          </Text>
        </Card>
        <Card variant="placeholder">
          <Text variant="title" color="mute">
            Union Vecinal vs San Martin
          </Text>
          <Text variant="secondary" color="mute">
            Pendiente: todavia sin datos, esperando al organizador.
          </Text>
        </Card>
      </Section>

      <Section title="Campo de texto">
        <Field
          label="Nombre del torneo"
          placeholder="Copa Apertura 2026"
          hint="Como lo van a buscar los equipos."
          value={name}
          onChangeText={setName}
        />
        <Field label="Nombre del equipo" value="Los Pibes" editable={false} />
        <Field
          label="Mail"
          value="mayco@gmail"
          error='Falta el dominio del mail, por ejemplo "@gmail.com".'
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Cuota por fecha"
          prefix="$"
          value={fee}
          onChangeText={setFee}
          keyboardType="numeric"
          hint="Lo que paga cada equipo antes de jugar."
        />
        <Field
          label="Aviso al plantel"
          multiline
          maxLength={140}
          value={notice}
          onChangeText={setNotice}
          placeholder="Si no pagas antes del jueves, la fecha 3 se pierde por walkover."
        />
      </Section>
    </Screen>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <Text variant="displaySection" uppercase>
        {title}
      </Text>
      {children}
    </View>
  );
};

const TYPOGRAPHY_SAMPLES: Record<TypographyName, string> = {
  displayGoals: "3 - 2",
  displayTime: "21:00",
  displayTitle: "Copa Apertura 2026",
  displayTable: "F3 · 12",
  displaySection: "Postulaciones · 2",
  title: "Los Pibes vs La Previa",
  button: "Ya pague la fecha, avisar",
  body: "Si no pagas antes del jueves, la fecha 3 se pierde por walkover.",
  secondary: "Confirmado por el organizador el 22/10",
  label: "Pagado",
  overline: "FECHA 3 · CUOTA",
};

export default Showcase;
