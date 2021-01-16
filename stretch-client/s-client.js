const net = require('net');
process.stdin.setEncoding('utf8')
const readline = require('readline');
const fs = require('fs')

const receiver = net.createConnection({
  host: 'localhost',
  port: 3001
});

receiver.setEncoding('utf8')

receiver.on('data', data => {
  //console.log(data);
  if (data.substring(0,6) === 'sent: ') {
    let fileObj = JSON.parse(data.substring(6));
    fs.writeFile(`./${fileObj.name}`, fileObj.content, err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('file saved:', fileObj.name)      
    })
  } else {
  console.log(data)
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', data => {
  
  receiver.write(data);
  
})

receiver.on('end', () => {
  console.log('Server ended connection.');
  process.exit()
})


