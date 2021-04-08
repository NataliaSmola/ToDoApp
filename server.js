const express = require('express');
const socket = require('socket.io');

const app = express();
const tasks = [];
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (task) => {
      tasks.push(task);
      socket.broadcast.emit('addTask', task);
      console.log('Task array:', tasks);
      console.log('New task:' , task ,' from ' + socket.id);
    });

  socket.on('removeTask', (removedTask) => {
    console.log('Please remove ' + removedTask);
    tasks.splice(removedTask, 1);
    socket.broadcast.emit('removeTask', removedTask);
    console.log('Task array:', tasks);
  });
});
