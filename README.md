
# Fintech Engagement OS

**Versión del Documento:** 1.0.0  
**Estado:** Producción  
**Autor:** Chief Product & Engineering Architect

---

## 1. Visión General del Producto

### 1.1 Definición
**Fintech Engagement OS** es una plataforma SaaS B2B de orquestación de compromisos financieros. Permite a las empresas gestionar el ciclo de vida de los pagos y la relación con el cliente desde una etapa preventiva hasta la escalación, utilizando una línea de tiempo visual, automatización estratégica y analítica asistida por IA.

### 1.2 Problema que Resuelve
Las empresas tradicionales gestionan cobros y renovaciones mediante procesos manuales, hojas de cálculo desconectadas o CRMs genéricos que no entienden la temporalidad de una deuda o compromiso. Esto genera fricción con el cliente, pérdida de ingresos por falta de seguimiento y ceguera operativa sobre qué estrategias funcionan.

### 1.3 Propuesta de Valor
*   **Visibilidad Temporal:** Transformamos listas estáticas de deudores en una línea de tiempo dinámica basada en el "Lag" (días de retraso/anticipación).
*   **Separación Táctica/Estratégica:** Desacoplamos el *qué* (Playbooks) del *cómo* (Frameworks) para iterar estrategias sin romper la operación.
*   **Economía Transparente:** Modelo de costos granular donde cada acción (WhatsApp, Email, IA) tiene un precio claro y optimizable por volumen.
*   **Inteligencia Tokenizada:** Acceso a analítica avanzada y generación de contenido mediante un modelo de consumo por tokens.

---

## 2. Principios de Diseño del Producto

1.  **Modularidad Atómica:** Un Framework debe poder existir independientemente de una Campaña. Un Playbook se compone de piezas reutilizables.
2.  **Transparencia Radical de Costos:** El usuario debe ver el impacto económico de activar una automatización *antes* de lanzarla (Simuladores).
3.  **IA como Copiloto (Knowledge Base):** La IA no es una caja negra que toma decisiones sola; es un asistente que genera artefactos (gráficos, textos) que el usuario valida y archiva en su base de conocimiento.
4.  **Diseño Orientado al "Lane" (Carril):** La UI y la lógica de negocio giran en torno al estado del cliente en el tiempo (Preventivo, Día de Pago, Post Pago, etc.).
5.  **Resiliencia en la Ejecución:** Si un canal falla (ej. WhatsApp caído), el sistema debe tener lógica de fallback definida en el Framework.

---

## 3. Arquitectura Funcional

La plataforma se divide en cuatro capas lógicas:

### 3.1 Capa de Ejecución (Core)
*   **Campañas:** Lotes de usuarios importados (Input).
*   **Tickets (Compromisos):** La unidad atómica de trabajo. Un usuario tiene un ticket con fecha de vencimiento.
*   **Timeline:** El motor que mueve los tickets entre estados (Stages) basado en el tiempo y eventos de pago.
*   **Frameworks:** Motores de reglas tácticas que ejecutan acciones (enviar SMS, Email) basadas en triggers temporales.

### 3.2 Capa de Estrategia
*   **Playbooks:** El cerebro. Define qué Framework se aplica en qué etapa según el perfil de riesgo del cliente.
*   **Reglas de Asignación:** Lógica que decide qué Playbook asignar a una Campaña (ej. "Si Deuda > $500 -> Playbook Alto Riesgo").

### 3.3 Capa de Inteligencia
*   **Global AI Chat:** Interfaz conversacional omnipresente.
*   **Reportes Avanzados (Knowledge Base):** Repositorio histórico de los análisis generados por la IA.
*   **Reportes Operativos:** Dashboards estáticos de rendimiento (KPIs, SLAs).

### 3.4 Capa de Negocio
*   **Billing Engine:** Calculadora en tiempo real de costos de plataforma + costos de ejecución (consumo).
*   **Marketplace:** Sistema para comprar capacidad extra (Add-ons) o Tokens de IA.

---

## 4. Modelo de Datos Conceptual

Entidades principales y sus relaciones:

*   **Empresa (Tenant):** Entidad raíz. Tiene Configuración y Billing.
*   **Campaña:** Agrupador temporal de Clientes (ej. "Suscripción Marzo").
*   **Cliente:** Posee Datos Personales, Perfil de Riesgo y una lista histórica de Tickets.
*   **Ticket:** Instancia de una deuda/compromiso. Tiene Estado (Paid, Open), Resultado (On Time, Late) y Actividades.
*   **Framework:** Colección de Acciones. Pertenece a un "Lane" (Etapa).
*   **Acción:** Configuración unitaria (Canal, Template, Timing, Costo).
*   **Playbook:** Mapa de ruta. Relaciona 1 Etapa -> N Frameworks.
*   **Token Transaction:** Registro de consumo de IA.

---

## 5. Frameworks y Playbooks

Esta distinción es crítica para la arquitectura del sistema.

### 5.1 Framework (Táctico)
Es una "receta" de ejecución acotada a una etapa específica del ciclo de vida.
*   **Atributos:** Nombre, Lane (ej. Preventivo), Acciones.
*   **Acciones:** Lista ordenada de eventos.
    *   *Trigger:* Días relativos al vencimiento (ej. -2, 0, +5).
    *   *Canal:* Email, SMS, WhatsApp, Call, System Note.
    *   *Costo:* Precio unitario por ejecución.

### 5.2 Playbook (Estratégico)
Es la estrategia completa que orquesta los Frameworks.
*   **Función:** Conecta las etapas del ciclo de vida (Lanes) con los Frameworks disponibles.
*   **Ejemplo:**
    *   *Etapa Preventiva:* Usar Framework "Recordatorio Suave".
    *   *Etapa Día de Pago:* Usar Framework "Urgencia Media".
    *   *Etapa Post Pago:* Usar Framework "Recuperación Multicanal".

---

## 6. Ejecución y Costos

El modelo de negocio es híbrido: Suscripción + Consumo.

### 6.1 Costos de Ejecución (Consumo)
Cada acción ejecutada por un Framework genera un costo.
*   WhatsApp: Alto costo, alta efectividad.
*   SMS: Costo medio.
*   Email: Bajo costo.
*   Call: Costo variable (minutos).

### 6.2 Tiers de Volumen
El sistema aplica descuentos automáticos basados en el volumen acumulado mensual por canal.

### 6.3 Simulador
Herramienta crítica en la UI que permite al usuario previsualizar su factura mensual combinando su Plan Base + Add-ons + Consumo estimado.

---

## 7. Inteligencia Artificial (AI Strategist)

La IA en la plataforma no es un adorno, es funcional.

### 7.1 Global Chat
Un componente flotante accesible desde cualquier vista. Permite consultas rápidas sin perder el contexto de navegación.

### 7.2 Capacidades del Modelo
1.  **Analítica:** "Analiza la caída de pagos en la campaña X". -> Genera Gráfico.
2.  **Generación:** "Crea un playbook para clientes VIP". -> Genera Objeto Playbook (Draft).
3.  **Redacción:** "Escribe un email empático para deuda baja". -> Genera Texto.

---

## 8. Arquitectura Técnica (Alto Nivel)

*   **Frontend:** React (SPA) con TypeScript y Tailwind CSS.
*   **Estado:** Gestión de estado global para autenticación, navegación y datos de simulación.
*   **Estilo:** Diseño atómico, enfocado en "Lanes" temporales.
*   **Animaciones:** Framer Motion para transiciones fluidas de UI.

---

## 9. Glosario Oficial

| Término | Definición |
| :--- | :--- |
| **Lag (Retraso)** | La diferencia en días entre la fecha actual y la fecha de vencimiento. Negativo = Futuro, 0 = Hoy, Positivo = Atrasado. |
| **Lane (Carril)** | Una columna vertical en el Timeline que representa un estado del ciclo de vida (ej. Preventivo, Escalación). |
| **Compromiso** | Acuerdo de pago o acción esperada por parte del usuario final. Sinónimo de Ticket en contextos de UI. |
| **Artefacto** | Un objeto generado por la IA que no es texto plano (ej. un componente de UI renderizado dentro del chat). |
| **Token** | Unidad de moneda virtual interna para consumir servicios de IA avanzados. |
