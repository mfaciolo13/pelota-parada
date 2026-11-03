# Verificación de identidad con DNI y selfie

Spike del issue #94, parte de #41 (RF-03). Investigación hecha el 3 de noviembre de 2026.

## Contexto

Para inscribir equipos y cobrar inscripciones, potrero necesita saber que el organizador y los capitanes son quienes dicen ser. La verificación pide una foto del DNI y una selfie, y las compara.

Los precios y las condiciones salen de las páginas de cada proveedor y de comparativas de terceros. Varias comparativas las publican competidores, así que los números de un proveedor que vienen de otro se marcan como no confirmados. Antes de contratar hay que validar todo con el proveedor.

## Servicios comparados

| | Didit | Sumsub | Veriff | AWS Rekognition |
| --- | --- | --- | --- | --- |
| Qué es | Plataforma de KYC completa | Plataforma de KYC completa | Plataforma de KYC completa | Solo comparación de caras |
| Costo | USD 0,33 por verificación completa. Sin mínimo mensual | USD 1,35 (Basic) o 1,85 (Compliance) por verificación, con mínimo mensual de USD 149 y 299 | Entre USD 1,49 y 2,05 por verificación, con mínimo mensual. Una fuente da cifras muy distintas y se descartó | USD 0,001 por comparación de imágenes. Liveness aparte (no confirmado) |
| Capa gratuita | 500 verificaciones completas por mes, sin tarjeta | No confirmado: dos fuentes se contradicen | No confirmada | 1.000 imágenes por mes durante los primeros 12 meses |
| DNI argentino | Sí. Verifica el documento y lo cruza contra RENAPER | Sí. Figura entre los documentos soportados y tiene flujo sin documento para Argentina | No se encontró información | No aplica: no lee documentos |
| Comparación biométrica | Sí: face match 1:1 y liveness (USD 0,05 y 0,10 por chequeo suelto) | Sí, con liveness | No confirmado | Sí (`CompareFaces`) |
| Integración con Expo | SDK `@didit-protocol/sdk-react-native` | No confirmado | `@veriff/react-native-sdk`. Compatibilidad con Expo no confirmada | SDK de AWS en el backend. La captura en el celular la resolveríamos nosotros |
| Integración con Node | API REST: el backend crea la sesión con una API key y recibe el resultado por webhook | No confirmado | No confirmado | SDK oficial de AWS para Node |
| Qué datos guarda | Procesa la selfie en tiempo real. La retención de la sesión la define el cliente. Los plazos exactos están en la política biométrica | No confirmado | No confirmado | Las imágenes que se envían a `CompareFaces` no se guardan. Los vectores de caras que se indexan sí |

### Notas por servicio

**Didit.** Es el único con precios públicos completos y capa gratuita que alcanza para el volumen esperado de un torneo amateur. El SDK usa módulos nativos, así que no corre en Expo Go y exige un development build. Solo soporta la New Architecture de React Native. Su página de precios avisa que los precios cambian el 1 de noviembre de 2026, así que hay que revisar las tarifas vigentes. Por separado, la consulta de DNI contra RENAPER cuesta USD 0,20 por intento respondido.

**Sumsub.** Cubre bien el DNI, pero el costo por verificación es entre cuatro y seis veces el de Didit y exige un mínimo mensual. No se confirmó su SDK de React Native ni su capa gratuita.

**Veriff.** No se encontró documentación sobre el DNI argentino. Con los datos disponibles no se puede evaluar. Los precios son similares a los de Sumsub.

**AWS Rekognition.** No verifica documentos: solo compara dos caras. Habría que leer el DNI y detectar fraudes por otro lado, y construir la captura de la selfie en la app. Es la opción más barata por imagen, pero la que más trabajo implica.

**Truora e Incode.** Se buscaron y quedaron afuera. No encontramos precios públicos de Truora. Incode soporta DNI argentino contra fuentes oficiales, pero sin precios públicos.

## Decisión

### Servicio

Se propone **Didit** como primera opción. Es el único que cumple los cinco criterios con información verificable: costo y capa gratuita públicos, DNI argentino con RENAPER, comparación biométrica incluida, SDK para Expo y API para Node.

Falta validar con una prueba de concepto:

- Que el flujo funcione en un development build de Expo.
- Los plazos de retención de la sesión (sección 5 de la [política biométrica](https://didit.me/legal/biometric-data-policy)).
- Las tarifas vigentes después del 1 de noviembre de 2026.

### Revisión automática o manual

Se propone **revisión automática con cola manual para los casos dudosos**.

- La verificación se aprueba o rechaza sola cuando el servicio devuelve un resultado concluyente.
- Los resultados dudosos (documento ilegible, coincidencia facial baja, sesión en revisión) pasan a una cola de revisión manual.

Como hay cola manual, **se agrega el requisito de una cola de revisión para administradores**: un listado de verificaciones pendientes, donde el admin ve el resultado y aprueba o rechaza. Hay que crear su historia de usuario.

### Datos del DNI

Solo se guardan los **últimos 4 dígitos del DNI**. Esto no lo confirma el proveedor: es una restricción de diseño nuestra.

- Didit devuelve el número completo en el webhook. El backend lo trunca antes de persistir y no guarda el payload crudo.
- La tabla de usuarios guarda `dniLast4` y no el número completo.
- Se guarda además el estado de la verificación y el identificador de sesión del proveedor.
- No se guardan imágenes del documento ni de la selfie. Si el proveedor las retiene, se configura el plazo mínimo.

### Alcance del informe

El servicio elegido incluye comparación biométrica, así que **el alcance del informe tiene que ampliarse**. La selfie y su comparación con el documento son datos biométricos, que se consideran sensibles. Hay que revisar qué exige la Ley 25.326 de protección de datos personales y redactar el consentimiento que ve el usuario antes de verificar. Esto quedó fuera de esta investigación.

## Criterios de aceptación del issue

- [x] Comparar al menos tres servicios en los cinco ejes.
- [x] Decidir revisión automática o manual y sumar el requisito de cola de admin.
- [x] Documentar la decisión en `docs/`.
- [x] Dejar establecido que solo se guardan los últimos 4 dígitos. Es una regla de diseño, a implementar y testear en el backend.
- [x] Actualizar el alcance del informe por la comparación biométrica. Queda señalado, sin redactar.

## Fuentes

- [Didit: precios](https://didit.me/pricing)
- [Didit: verificación en Argentina](https://didit.me/solutions/countries/argentina/)
- [Didit: SDK de React Native](https://docs.didit.me/integration/native-sdks/react-native-sdk.md)
- [Didit: política de datos biométricos](https://didit.me/legal/biometric-data-policy)
- [Sumsub: precios (Costbench)](https://costbench.com/software/kyc-aml/sumsub/)
- [Sumsub: verificación sin documento](https://docs.sumsub.com/docs/non-doc-identity-verification)
- [Veriff: precios (TrustRadius)](https://www.trustradius.com/products/veriff/pricing)
- [Amazon Rekognition: precios](https://aws.amazon.com/rekognition/pricing/)
