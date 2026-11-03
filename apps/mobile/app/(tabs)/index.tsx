import { Link } from "expo-router";

import { useTheme } from "@/theme";
import { Button, Screen, Text } from "@/ui";

const Index = () => {
  const t = useTheme();
  return (
    <Screen contentStyle={{ justifyContent: "center", alignItems: "center", gap: t.spacing.s4 }}>
      <Text variant="displayTitle">Potrero</Text>
      <Text color="mute" align="center">
        Todavia no hay pantallas.
      </Text>
      {__DEV__ && (
        <Link href="/showcase" asChild>
          <Button label="Ver design system" variant="lime" />
        </Link>
      )}
    </Screen>
  );
};

export default Index;
