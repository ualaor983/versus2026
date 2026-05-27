import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TeamMember {
  name: string;
  handle: string;
  role: string;
  focus: string;
  color: string;
  initials: string;
}

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './equipo.html',
  styleUrl: './equipo.scss',
})
export class Equipo {
  readonly stack = [
    { label: 'Angular 21', desc: 'SPA con standalone components y Signals API' },
    { label: 'Spring Boot 4', desc: 'API REST + STOMP WebSockets' },
    { label: 'PostgreSQL', desc: 'Base de datos relacional con UUIDs' },
    { label: 'Scrapy', desc: 'Arañas de scraping para preguntas reales' },
    { label: 'Docker', desc: 'Dev containers y despliegue' },
  ];

  readonly members: TeamMember[] = [
    {
      name: 'Raúl Martínez Gutiérrez',
      handle: 'ualrmg429',
      role: 'Backend Lead',
      focus: 'Spring Boot · PostgreSQL · WebSockets',
      color: 'blue',
      initials: 'RM',
    },
    {
      name: 'Alejandro O. R.',
      handle: 'ualaor983',
      role: 'Frontend',
      focus: 'Angular · UI/UX · Animaciones',
      color: 'red',
      initials: 'AO',
    },
    {
      name: 'B. R. L.',
      handle: 'ualbrl973',
      role: 'Frontend',
      focus: 'Angular · Componentes · Integración',
      color: 'gold',
      initials: 'BR',
    },
    {
      name: 'Adrián Martínez Granados',
      handle: 'ualamg538',
      role: 'Backend',
      focus: 'API REST · Autenticación · JPA',
      color: 'purple',
      initials: 'AM',
    },
    {
      name: 'Andrés Ruiz Andújar',
      handle: 'UALara584',
      role: 'Backend',
      focus: 'Lógica de juego · Rankings · ELO',
      color: 'green',
      initials: 'AR',
    },
    {
      name: 'Ilyas El Hamdi',
      handle: 'ilyas2022',
      role: 'Scraping',
      focus: 'Scrapy · Pipelines · Datos reales',
      color: 'blue',
      initials: 'IE',
    },
    {
      name: 'Sergio Gómez Vico',
      handle: 'ualsgv396',
      role: 'QA · DevOps',
      focus: 'Docker · CI/CD · Testing',
      color: 'red',
      initials: 'SG',
    },
  ];
}
