const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const readmePath = path.join(__dirname, '..', 'README.md');

try {
  // Obtener logs de git
  const gitLog = execSync('git log --pretty=format:"%h - %an, %ar : %s" -n 15', { encoding: 'utf-8' });
  const lines = gitLog.trim().split('\n');

  // Formatear en una tabla markdown o lista elegante
  let commitHistoryMarkdown = '\n| Hash | Autor | Hace cuánto | Mensaje de Commit |\n| :--- | :--- | :--- | :--- |\n';
  
  lines.forEach(line => {
    const match = line.match(/^([a-f0-9]+) - ([^,]+), (.+?) : (.+)$/);
    if (match) {
      const [_, hash, author, when, message] = match;
      // Añadir badges de tipo (feat, fix, refactor, style, docs)
      let typeBadge = '';
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.startsWith('feat')) {
        typeBadge = '✨ `feat`';
      } else if (lowerMsg.startsWith('fix')) {
        typeBadge = '🐛 `fix`';
      } else if (lowerMsg.startsWith('docs')) {
        typeBadge = '📝 `docs`';
      } else if (lowerMsg.startsWith('style') || lowerMsg.startsWith('design') || lowerMsg.startsWith('ui')) {
        typeBadge = '🎨 `style`';
      } else if (lowerMsg.startsWith('refactor')) {
        typeBadge = '♻️ `refactor`';
      } else {
        typeBadge = '🔧 `other`';
      }

      commitHistoryMarkdown += `| \`${hash}\` | ${author} | _${when}_ | ${typeBadge} ${message} |\n`;
    }
  });

  commitHistoryMarkdown += '\n_Actualizado automáticamente el ' + new Date().toLocaleString('es-ES') + '_\n';

  // Leer README.md
  let readmeContent = fs.readFileSync(readmePath, 'utf8');

  // Si no existen los marcadores, los agregamos al final
  if (!readmeContent.includes('<!-- COMMITS_START -->')) {
    readmeContent += '\n\n## 🛠️ Historial de Commits\n\n<!-- COMMITS_START -->\n<!-- COMMITS_END -->\n';
  }

  // Reemplazar el contenido entre los marcadores
  const regex = /(<!-- COMMITS_START -->)[\s\S]*?(<!-- COMMITS_END -->)/g;
  const updatedReadme = readmeContent.replace(regex, `$1\n${commitHistoryMarkdown}\n$2`);

  fs.writeFileSync(readmePath, updatedReadme, 'utf8');
  console.log('✅ ¡README.md actualizado con el historial de commits exitosamente!');
} catch (error) {
  console.error('❌ Error al actualizar el historial de commits:', error.message);
  process.exit(1);
}
