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

  socket.on('addTask', (newTask) => {
      console.log('New task:' + newTask + 'from' + socket.id);
      tasks.push(newTask);
      socket.broadcast.emit('addTask', newTask);
    });

  socket.on('removeTask', (taskToRemove) => {
    console.log('Please remove' + taskToRemove);
    tasks.splice(taskToRemove, 1);
    socket.broadcast.emit('removeTask', taskToRemove);
  });
});
