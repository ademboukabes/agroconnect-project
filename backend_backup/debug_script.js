import fs from 'fs';
import path from 'path';

console.log('CWD:', process.cwd());
try {
    console.log('Files in ./src/modules/users:', fs.readdirSync('./src/modules/users'));
} catch (e) {
    console.error('Error listing files:', e.message);
}
