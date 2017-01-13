import * as SocketIO from 'socket.io-client'

const socket = SocketIO('ws://localhost:3000')

socket.on('connected', () => {
  console.log('connected')
  socket.emit('request', JSON.stringify({
    type: 'create',
    payload: new Buffer('Sign this').toString('hex')
  }))
})

socket.on('message', (payload: any) => {
  console.log('received', payload)
  const body = JSON.parse(payload)
  if (body.status === "created") {
    console.log('created request', JSON.parse(body.encoded).id)
  }
})
