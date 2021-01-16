const net = require('net');
const fs = require('fs');
const server = net.createServer();

server.listen(3001, () => {
  console.log('Server ready..')
});

server.on('connection', client => {
  client.setEncoding('utf8');
  client.write('connected to server!\n')
  
  console.log('client connected.');
  client.on('end', () => {
    console.log('connection ended.')
  });

  //checks data received for file request trigger: "file: "
  client.on('data', data => {
    if (data.substring(0,6) === 'file: ') {
      let filename = data.substring(6);
      client.write(`Requesting file: ${filename}...`)
      fetchFile(filename, (err, data) => {
        if (err) {
          console.log(err);
          client.write('File not found.')
          return;
        }
        client.write(`sent: ${data}`)
      })
    }
    console.log('client: ',data)
  })  
})

const fetchFile = (fileName, callback) => {
  fs.readFile(`./${fileName}`,'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    let sendFile = {
      name: fileName,
      content: data
    };
    callback(null,JSON.stringify(sendFile))
  })
}  


