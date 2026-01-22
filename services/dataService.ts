import { Customer, StageId, ProviderType, Ticket, TicketActivity } from '../types';
import { STAGES, CAMPAIGNS } from '../constants';

const NAMES = [
  "Alice Freeman", "Bob Smith", "Charlie Kim", "Diana Prince", "Evan Wright",
  "Fiona Gallagher", "George Miller", "Hannah Lee", "Ian Scott", "Julia Roberts",
  "Kevin Hart", "Liam Neeson", "Mia Wallace", "Noah Tremblay", "Olivia Wilde",
  "Peter Parker", "Quinn Fabray", "Ryan Gosling", "Sarah Connor", "Tony Stark"
];

const ACTIONS = [
  "Recordatorio 1 enviado",
  "Recordatorio 2 enviado",
  "Llamada pendiente",
  "Promesa de pago",
  "Factura vista",
  "Email entregado",
  "SMS enviado",
  "Intento de cobro fallido",
  "Acuerdo propuesto"
];

const PROVIDERS: ProviderType[] = ['Stripe', 'Link', 'External'];

const generateTicketHistory = (customerName: string): Ticket[] => {
  const tickets: Ticket[] = [];
  const today = new Date();
  const monthsBack = 6;

  for (let i = 1; i <= monthsBack; i++) {
    const dueDate = new Date(today.getFullYear(), today.getMonth() - i, 15);
    const isPaid = Math.random() > 0.1; // 90% paid history
    
    let paidDate: Date | null = null;
    let daysDiff = 0;
    let resolutionStage = StageId.PREVENTIVE;
    let result: Ticket['result'] = 'on_time';
    
    if (isPaid) {
      // Determine if late
      const isLate = Math.random() > 0.7;
      if (isLate) {
        const delay = Math.floor(Math.random() * 20) + 1;
        daysDiff = delay;
        paidDate = new Date(dueDate);
        paidDate.setDate(dueDate.getDate() + delay);
        
        if (delay <= 5) {
          resolutionStage = StageId.POST_PAYMENT;
          result = 'late';
        } else if (delay <= 15) {
          resolutionStage = StageId.REFRAMING;
          result = 'late';
        } else {
          resolutionStage = StageId.ESCALATION;
          result = 'very_late';
        }
      } else {
        // Paid on time or early
        const early = Math.floor(Math.random() * 5);
        daysDiff = -early;
        paidDate = new Date(dueDate);
        paidDate.setDate(dueDate.getDate() - early);
        resolutionStage = StageId.PREVENTIVE;
        result = 'on_time';
      }
    } else {
      // Not paid (rare in history, maybe a skipped month)
      result = 'pending';
      daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
    }

    // Generate activities
    const activities: TicketActivity[] = [
      {
        id: `act-${i}-1`,
        date: new Date(dueDate.getTime() - 1000 * 3600 * 24 * 10),
        type: 'system',
        description: 'Factura generada #INV-' + Math.floor(Math.random() * 10000)
      },
      {
        id: `act-${i}-2`,
        date: new Date(dueDate.getTime() - 1000 * 3600 * 24 * 3),
        type: 'email',
        description: 'Recordatorio automático enviado'
      }
    ];

    if (daysDiff > 0) {
      activities.push({
        id: `act-${i}-3`,
        date: new Date(dueDate.getTime() + 1000 * 3600 * 24 * 1),
        type: 'sms',
        description: 'Aviso de vencimiento'
      });
    }

    if (paidDate) {
       activities.push({
        id: `act-${i}-pay`,
        date: paidDate,
        type: 'payment',
        description: `Pago detectado`
      });
    }

    tickets.push({
      id: `ticket-${i}`,
      period: dueDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      dueDate,
      paidDate,
      status: isPaid ? 'paid' : 'overdue',
      result,
      resolutionStage,
      daysDiff,
      activities: activities.sort((a, b) => b.date.getTime() - a.date.getTime())
    });
  }

  return tickets;
};

export const generateMockCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }).map((_, index) => {
    const randomLag = Math.floor(Math.random() * 40) - 20; // -20 to +20
    const provider = PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)];
    const lastAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const campaign = CAMPAIGNS[Math.floor(Math.random() * CAMPAIGNS.length)];
    const name = NAMES[index % NAMES.length];

    return {
      id: `cust-${index}`,
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      avatarUrl: `https://picsum.photos/seed/${index}/200/200`,
      provider,
      campaign,
      status: 'active',
      dueDate: new Date(),
      currentLag: randomLag,
      stage: determineStage(randomLag),
      riskScore: Math.floor(Math.random() * 100),
      history: [
        { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), action: "Factura Creada" },
        { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), action: "Recordatorio de Pago Enviado" },
        { date: new Date(), action: lastAction }
      ],
      tickets: generateTicketHistory(name)
    };
  });
};

export const determineStage = (lag: number): StageId => {
  const stage = STAGES.find(s => lag >= s.minLag && lag <= s.maxLag);
  return stage ? stage.id : StageId.ESCALATION;
};

// Return type updated to include info about payments made during this tick
export const simulateMovement = (customers: Customer[]): { customers: Customer[], paidCustomers: Customer[] } => {
  const paidCustomers: Customer[] = [];

  const nextCustomers = customers.map(c => {
    // 15% chance to move forward in time (lag increases)
    // 5% chance to pay if they are overdue or due (lag resets or they disappear)
    const moveChance = Math.random();
    let newLag = c.currentLag;
    let paid = false;

    // Movement logic
    if (moveChance > 0.85) {
      newLag += 1;
    } else if (moveChance < 0.05 && c.currentLag >= 0) {
      // Simulate a payment
      paid = true;
      // Push a snapshot of the customer at the moment of payment
      // Generate a unique ID for the paid record to avoid key conflicts in 'All' view
      paidCustomers.push({
        ...c,
        id: `${c.id}-paid-${Date.now()}`,
        status: 'paid',
        history: [...c.history, { date: new Date(), action: "Pago Detectado" }]
      });
      // Reset logic: move them back to a preventive state for next cycle
      newLag = -30;
    }

    // Update history if paid? (In a real app, yes. Here we just return the object)

    return {
      ...c,
      currentLag: newLag,
      stage: determineStage(newLag),
      status: 'active' as const
    };
  });

  return { customers: nextCustomers, paidCustomers };
};