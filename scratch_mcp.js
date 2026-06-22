import { spawn } from 'child_process';

const child = spawn('npx', ['-y', '@wix/mcp']);

child.stdout.on('data', (data) => {
    const text = data.toString();
    console.log('[stdout]', text);
    
    if (text.includes('Transport connected') || text.includes('Starting server')) {
        // Send a tools/list request
        const request = JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "tools/list"
        });
        child.stdin.write(request + '\r\n');
    }
});

child.stderr.on('data', (data) => {
    console.error('[stderr]', data.toString());
});

setTimeout(() => {
    child.kill();
}, 5000);
