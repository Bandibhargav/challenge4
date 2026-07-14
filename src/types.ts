/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  REPORTED = 'REPORTED',
  DISPATCHED = 'DISPATCHED',
  ON_SCENE = 'ON_SCENE',
  RESOLVED = 'RESOLVED',
}

export enum SectorStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface StadiumSector {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  status: SectorStatus;
  temperature: number;
  gateFlowRate: number; // people per minute
  coordinates: string; // SVG coordinates path
  category: 'North' | 'South' | 'East' | 'West' | 'Pitch';
}

export interface Incident {
  id: string;
  title: string;
  location: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  description: string;
  assignedUnit?: string;
  aiChecklist?: string[];
}

export interface TransitHub {
  id: string;
  name: string;
  type: 'Metro' | 'Bus Shuttle' | 'Rideshare' | 'Parking';
  status: 'On Time' | 'Delayed' | 'Suspended';
  loadPercentage: number;
  frequencyMinutes: number;
  alerts?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: Array<{ title: string; uri: string }>;
}
