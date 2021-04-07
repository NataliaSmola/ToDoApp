import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tasks: [],
        taskName: '',
      };
    }
  componentDidMount() {
    this.socket = io.connect("http://localhost:8000");
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('updateData', (tasks) => this.updateData(tasks));
  };

  addTask(task){
    this.setState({
      tasks: [...this.state.tasks, task],
      taskName: '',
    })
  };

  removeTask(id, local){
    if(local !== undefined){
      this.socket.emit('removeTask', id);
    }
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id)
    })
  };

  updateData(tasks)  {
    this.setState({
      tasks: [...this.state.tasks] });
  };

  submitForm(event){
     event.preventDefault();
     const newTask = {
       name: this.state.taskName,
       id: uuidv4()};
     this.addTask(newTask);
     this.socket.emit('addTask', newTask);
     this.setState({
       task: [...this.state.tasks, newTask]
     })
  };

  render() {
    const {tasks, taskName} = this.state;
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) =>(
            <li key={task.id} className="task">{task.name}<button className="btn btn--red"
            onClick={(local) => this.removeTask(task.id, local)}>Remove</button></li>
          ))}
          </ul>
          <form id="add-task-form" onSubmit={(submit) => this.submitForm(submit)}>
            <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            required='required'
            value={taskName}
            onChange={(event) => this.setState({taskName: event.target.value})}  />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    );
  };
};

export default App;
