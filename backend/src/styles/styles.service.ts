import { Injectable } from '@nestjs/common';

@Injectable()
export class StylesService {
   private readonly dressStyles = [
    { name: 'Casual', image: '/casualf.jpg' },
    { name: 'Formal', image: '/formalf.jpg' },
    { name: 'Party', image: '/partyf.jpg' },
    { name: 'Gym', image: '/gymf.jpg' },
  ];
    findAll() {
    return this.dressStyles;
  }
  findByName(name: string) {
    return this.dressStyles.find(style => style.name === name);
  }
}
