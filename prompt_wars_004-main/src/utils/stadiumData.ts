/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StadiumSector, SectorStatus, Incident, IncidentSeverity, IncidentStatus, TransitHub } from '../types';

export const INITIAL_SECTORS: StadiumSector[] = [
  {
    id: 'SEC-N1',
    name: 'North Stand Lower (N1)',
    capacity: 8500,
    currentOccupancy: 8120,
    status: SectorStatus.NORMAL,
    temperature: 24.5,
    gateFlowRate: 110,
    category: 'North',
    coordinates: 'M 50,50 L 250,50 L 220,120 L 80,120 Z',
  },
  {
    id: 'SEC-N2',
    name: 'North Stand Upper (N2)',
    capacity: 10200,
    currentOccupancy: 9940,
    status: SectorStatus.WARNING,
    temperature: 25.8,
    gateFlowRate: 185,
    category: 'North',
    coordinates: 'M 80,120 L 220,120 L 200,180 L 100,180 Z',
  },
  {
    id: 'SEC-E1',
    name: 'East Corporate Suites (E1)',
    capacity: 4500,
    currentOccupancy: 3800,
    status: SectorStatus.NORMAL,
    temperature: 21.2,
    gateFlowRate: 45,
    category: 'East',
    coordinates: 'M 250,50 L 350,150 L 280,180 L 220,120 Z',
  },
  {
    id: 'SEC-E2',
    name: 'East Grandstand (E2)',
    capacity: 12000,
    currentOccupancy: 11800,
    status: SectorStatus.CRITICAL,
    temperature: 26.5,
    gateFlowRate: 245,
    category: 'East',
    coordinates: 'M 350,150 L 450,250 L 320,250 L 280,180 Z',
  },
  {
    id: 'SEC-S1',
    name: 'South Supporters Lower (S1)',
    capacity: 9000,
    currentOccupancy: 8850,
    status: SectorStatus.NORMAL,
    temperature: 23.9,
    gateFlowRate: 95,
    category: 'South',
    coordinates: 'M 100,180 L 200,180 L 180,240 L 120,240 Z',
  },
  {
    id: 'SEC-S2',
    name: 'South Supporters Upper (S2)',
    capacity: 11500,
    currentOccupancy: 11240,
    status: SectorStatus.NORMAL,
    temperature: 24.1,
    gateFlowRate: 120,
    category: 'South',
    coordinates: 'M 120,240 L 180,240 L 150,310 L 130,310 Z',
  },
  {
    id: 'SEC-W1',
    name: 'West Press Box (W1)',
    capacity: 3500,
    currentOccupancy: 2100,
    status: SectorStatus.NORMAL,
    temperature: 20.8,
    gateFlowRate: 30,
    category: 'West',
    coordinates: 'M 50,50 L 80,120 L 120,180 L 50,150 Z',
  },
  {
    id: 'SEC-W2',
    name: 'West Grandstand (W2)',
    capacity: 12500,
    currentOccupancy: 11950,
    status: SectorStatus.NORMAL,
    temperature: 23.4,
    gateFlowRate: 140,
    category: 'West',
    coordinates: 'M 50,150 L 120,180 L 180,240 L 50,250 Z',
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-101',
    title: 'Gate G Crowding Pressure',
    location: 'Gate G (East Sector)',
    severity: IncidentSeverity.CRITICAL,
    status: IncidentStatus.ON_SCENE,
    timestamp: '2026-07-09T20:45:00Z',
    description: 'RFID turnstile scanner malfunction causing crowd accumulation of approx. 400 people. Secondary queue lines deployed.',
    assignedUnit: 'Crowd Control Team Charlie & Tech Support B',
    aiChecklist: [
      'De-activate faulty turnstile and open manual ticket validation lanes.',
      'Deploy visual stewards 100 meters ahead of Gate G to redirect fans to Gate F and H.',
      'Broadcast regional safety announcements via PA system in English & Spanish.',
      'Form safety-barrier wedge to relieve pressure near initial bottleneck points.'
    ],
  },
  {
    id: 'INC-102',
    title: 'Medical Emergency: Heat Exhaustion',
    location: 'Sector SEC-E2, Row 14',
    severity: IncidentSeverity.MEDIUM,
    status: IncidentStatus.DISPATCHED,
    timestamp: '2026-07-09T20:51:00Z',
    description: 'Elderly fan experiencing severe dizziness and dehydration symptoms. Needs stretcher extraction.',
    assignedUnit: 'Medical Responder Unit 3',
    aiChecklist: [
      'Locate patient at SEC-E2, Row 14, Seat 223.',
      'Provide rapid active-cooling materials and secondary hydration.',
      'Clear designated pathway in corporate corridor for clean stretcher exit.',
      'Log vitals into regional tournament operations medical dashboard.'
    ],
  },
  {
    id: 'INC-103',
    title: 'VIP Corridor Access Obstruction',
    location: 'West Corporate Wing',
    severity: IncidentSeverity.LOW,
    status: IncidentStatus.REPORTED,
    timestamp: '2026-07-09T20:55:00Z',
    description: 'Unauthorised catering cart blocking primary wheelchair-accessible fire egress corridor.',
    assignedUnit: 'Security Post Echo',
    aiChecklist: [
      'Issue immediate instruction to food service contractors to relocate cart.',
      'Verify wheelchair safety bypass routes remain fully unobstructed.',
      'Inspect corporate security post clearance.'
    ],
  }
];

export const TRANSIT_HUBS: TransitHub[] = [
  {
    id: 'TRA-1',
    name: 'Azteca Stadium Metro (Line 2)',
    type: 'Metro',
    status: 'On Time',
    loadPercentage: 88,
    frequencyMinutes: 3,
    alerts: 'Extended double-car trains active. Normal operations.',
  },
  {
    id: 'TRA-2',
    name: 'North Shuttle Terminal (Park & Ride)',
    type: 'Bus Shuttle',
    status: 'Delayed',
    loadPercentage: 94,
    frequencyMinutes: 8,
    alerts: 'Traffic bottleneck near Outer Ring road causing minor delays.',
  },
  {
    id: 'TRA-3',
    name: 'East Uber Zone / Rideshare Plaza',
    type: 'Rideshare',
    status: 'On Time',
    loadPercentage: 72,
    frequencyMinutes: 2,
    alerts: 'Surge controls active. Drop-off lanes running smoothly.',
  },
  {
    id: 'TRA-4',
    name: 'General Parking Hub West',
    type: 'Parking',
    status: 'On Time',
    loadPercentage: 98,
    frequencyMinutes: 0,
    alerts: 'Parking lot 98% full. Directing secondary traffic to lot East.',
  },
];

export const SAMPLE_PROMPTS = [
  'Generate crowd management checklist for Gate G crowding.',
  'Translate operational update to Spanish, French, and Portuguese.',
  'Draft an evacuation protocol draft for Sector SEC-E2.',
  'Formulate an emergency transit rerouting brief for Azteca Bus Shuttle delays.'
];

export const OFFLINE_AI_ANSWERS: Record<string, string> = {
  'crowd management checklist': `### 🚨 Stadium Operations AI Checklist: Crowd Management at Gate G

**Instant Crowd Management Action Plan:**
1. **De-escalate Bottleneck Density:**
   - Immediately transition faulty RFID turnstiles to manual ticketing checks.
   - Deploy high-visibility stewards to partition the crowd queue structure 100m back.
2. **Dynamic Redirection:**
   - Redirect incoming flow to **Gate F** and **Gate H** via digital stadium signage.
   - Update stadium app notification to alert fans of Azteca Sector Azteca East gate flow status.
3. **Safety Barriers:**
   - Establish a steward barrier wedge to relieve direct pressure from main entrance gates.
   - Alert emergency medical units on standby in Sector E.`,
  
  'translate operational update': `### 🌐 Multilingual Operational Translation Brief

**Original Brief:**
*"Security team Charlie has successfully relieved bottleneck pressure at Gate G. High flow is now diverted to Gate F. Turnstiles have resumed manual operation."*

**Español (Spanish):**
*"El equipo de seguridad Charlie ha aliviado con éxito la presión en la Puerta G. El flujo alto ahora se desvía a la Puerta F. Los torniquetes han reanudado el funcionamiento manual."*

**Français (French):**
*"L'équipe de sécurité Charlie a réussi à atténuer la pression à la Porte G. Le flux important est désormais dévié vers la Porte F. Les tourniquets ont repris leur fonctionnement manuel."*

**Português (Portuguese):**
*"A equipe de segurança Charlie reduziu com sucesso a pressão na entrada G. O fluxo intenso agora está desviado para a entrada F. As catracas retomaram a operação manual."*`,

  'evacuation protocol': `### ⚠️ Sector SEC-E2 Evacuation Protocol Brief

**Phase 1: Alert & Communication**
- Activate flashing directional indicators in the East stand corridors.
- Deploy pre-recorded emergency PA announcements in Spanish and English: *"Please proceed calmly to the nearest emergency exits."*

**Phase 2: Flow Segregation**
- Open safety gates E2-A and E2-B leading directly toward Azteca lower ring roads.
- Stewards to block any flow heading backwards into corporate suite hallways.

**Phase 3: Emergency Services Rendezvous**
- Medical Responder Unit 3 and Security Post Echo clear fire routes for Azteca AZ-1 entrance.`,

  'transit rerouting': `### 🚌 Smart Transportation Brief: Azteca Shuttle Delays

**Bottleneck Resolution Strategy:**
1. **Reroute Primary Flow:** Divert incoming shuttle bus convoys from Outer Ring Road to Mexican Federal Route 9 West gate bypass.
2. **Deploy Backup Shuttles:** Activate 8 reserve shuttle buses from Park & Ride Lot North.
3. **Fan Information:** Push real-time transit delay alert (estimated +12 mins) to stadium digital boards and Azteca mobile portal.`
};
