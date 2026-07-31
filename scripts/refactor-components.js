import fs from 'fs';
import path from 'path';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('./src');

const replacements = [
  { regex: /var\(--primary-base\)/g, replacement: 'var(--color-brand-500)' },
  { regex: /var\(--primary-light\)/g, replacement: 'var(--color-brand-300)' },
  { regex: /var\(--primary-dark\)/g, replacement: 'var(--color-brand-700)' },
  { regex: /var\(--primary-extra-dark\)/g, replacement: 'var(--color-brand-800)' },
  { regex: /var\(--primary-extra-light\)/g, replacement: 'var(--color-brand-100)' },
  
  { regex: /\b(text|bg|border|ring|fill|stroke)-primary-base\b/g, replacement: '$1-brand-base' },
  { regex: /\b(text|bg|border|ring|fill|stroke)-primary-light\b/g, replacement: '$1-brand-light' },
  { regex: /\b(text|bg|border|ring|fill|stroke)-primary-dark\b/g, replacement: '$1-brand-dark' },
  
  { regex: /var\(--neutral-(\d)\)/g, replacement: 'var(--color-neutral-$1)' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  replacements.forEach(rule => {
    newContent = newContent.replace(rule.regex, rule.replacement);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
