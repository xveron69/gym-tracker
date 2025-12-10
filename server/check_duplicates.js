import { exercises } from './exercises.js';

const names = exercises.map(e => e.name);
const uniqueNames = new Set(names);

if (names.length !== uniqueNames.size) {
    console.log(`Found ${names.length - uniqueNames.size} duplicates!`);
    const counts = {};
    names.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
    });

    Object.entries(counts).filter(([name, count]) => count > 1).forEach(([name, count]) => {
        console.log(`- "${name}" appears ${count} times`);
    });
} else {
    console.log('No duplicates found.');
}

console.log(`Total exercises in file: ${exercises.length}`);
console.log(`Klatka piersiowa: ${exercises.filter(e => e.category === 'Klatka piersiowa').length}`);
console.log(`Nogi: ${exercises.filter(e => e.category === 'Nogi').length}`);
console.log(`Barki: ${exercises.filter(e => e.category === 'Barki').length}`);
console.log(`Biceps: ${exercises.filter(e => e.category === 'Biceps').length}`);
console.log(`Brzuch: ${exercises.filter(e => e.category === 'Brzuch').length}`);
console.log(`Plecy: ${exercises.filter(e => e.category === 'Plecy').length}`);
console.log(`Triceps: ${exercises.filter(e => e.category === 'Triceps').length}`);
console.log(`Przedramiona: ${exercises.filter(e => e.category === 'Przedramiona').length}`);
