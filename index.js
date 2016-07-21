var cpus = require('os').cpus().length;
var child_process = require('child_process');

console.warn('\n发布静态:');
child_process.execSync('gulp dist', {
  stdio: 'inherit',
  cwd: './assets',
});

console.warn('\n编译ES6:');

child_process.execSync('npm run build', {
  stdio: 'inherit',
});

try {
  child_process.execSync('pm2 delete legend', {
    stdio: 'inherit',
  });
}
catch (e) {}

child_process.execSync('pm2 start server.js --name=legend -i ' + cpus, {
  stdio: 'inherit',
});
