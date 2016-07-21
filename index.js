var cpus = require('os').cpus().length;
var child_process = require('child_process');

console.warn('\n更新代码:');
child_process.execSync('git pull origin master', {
  stdio: 'inherit',
});

console.warn('\n发布静态:');
child_process.execSync('gulp dist', {
  stdio: 'inherit',
  cwd: './assets',
});

console.warn('\n编译代码:');

child_process.execSync('npm run build', {
  stdio: 'inherit',
});

console.warn('\n停止服务:');
try {
  child_process.execSync('pm2 delete legend', {
    stdio: 'inherit',
  });
}
catch (e) {}

console.warn('\n重启服务:');
child_process.execSync('pm2 start server.js --name=legend -i ' + cpus, {
  stdio: 'inherit',
});
