import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  state = {
    tasks: [
      {name:'dupka', id:1},
      {name:'srobka', id:2},
      {name:'fff', id:3}
  ],
  taskName: '',
};

  componentDidMount() {
    this.socket = io.connect("http://localhost:8000");
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('addTask', (task) => this.addTask(task));
  };

  handleChange(event) {
   this.setState({taskName: event.target.value});
 }

  removeTask(id){
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id)
    })
    this.socket.emit('removeTask', id);
  }

  submitForm(event){
     event.preventDefault();
     const newTask = {
       name: this.state.taskName};
     this.addTask(newTask);
     this.socket.emit('addTask', newTask);
     this.setState({
       task: [...this.state.tasks, newTask]
     })
  }

  addTask(task){
    this.state.tasks.push(task);
    this.setState({
      tasks: this.state.tasks,
    })
  }


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
            onClick={() => this.removeTask(task.id)}>Remove</button></li>
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
