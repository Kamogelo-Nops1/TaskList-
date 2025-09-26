import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [lastDeleted, setLastDeleted] = useState(null);

  const addTask = () => {
    if (task.trim() === '') return;
    setTasks(prev => [...prev, { id: Date.now().toString(), name: task, done: false }]);
    setTask('');
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(item => 
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const deleteTask = (id, name) => {
    const index = tasks.findIndex(item => item.id === id);
    const deletedTask = tasks[index];

    setTasks(prev => prev.filter(item => item.id !== id));
    setLastDeleted({ ...deletedTask, index });

    Alert.alert(
      'Deleted',
      `Task "${name}" has been deleted`,
      [
        { text: 'Undo', onPress: undoDelete },
        { text: 'OK' }
      ]
    );
  };

  const undoDelete = () => {
    if (lastDeleted) {
      setTasks(prev => {
        const newTasks = [...prev];
        newTasks.splice(lastDeleted.index, 0, lastDeleted);
        return newTasks;
      });
      setLastDeleted(null);
    }
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskRow, item.done && styles.taskRowDone]}>
      <TouchableOpacity style={styles.checkbox} onPress={() => toggleTask(item.id)}>
        {item.done && <View style={styles.checkedBox} />}
      </TouchableOpacity>
      <Text style={[styles.taskText, item.done && styles.taskTextDone]}>{item.name}</Text>
      <TouchableOpacity onPress={() => deleteTask(item.id, item.name)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          value={task}
          onChangeText={setTask}
        />
        <Button title="Add" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: 'white' 
  },

  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center', 
    color: 'black' 
  },

  inputRow: { 
    flexDirection: 'row', 
    marginBottom: 15 
  },

  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: 'gray', 
    padding: 8, 
    marginRight: 10, 
    borderRadius: 5 
  },

  taskRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10, 
    backgroundColor: 'lightgray', 
    marginBottom: 8, 
    borderRadius: 5 
  },

  taskRowDone: {
    backgroundColor: 'lightgreen'
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  checkedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'green',
    borderRadius: 2
  },

  taskText: { 
    flex: 1, 
    fontSize: 16, 
    color: 'black' 
  },

  taskTextDone: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },

  delete: { 
    color: 'red', 
    fontWeight: 'bold' 
  }
});
