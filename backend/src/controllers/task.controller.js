const Task = require('../models/task.model.js');

const createTask = async (req, res) => {
    const user = req.user;

    if (Array.isArray(req.body.tasks)) {
        const payloadTasks = req.body.tasks
            .map((task) => ({
                title: typeof task.title === 'string' ? task.title.trim() : '',
                description: task.description,
                dueDate: task.dueDate || null,
                status: task.status,
                user: user.id
            }))
            .filter((task) => task.title);

        if (!payloadTasks.length) {
            return res.status(400).json({ message: 'At least one task title is required' });
        }

        const tasks = await Task.insertMany(payloadTasks);

        return res.status(201).json({
            message: 'Tasks created successfully',
            tasks
        });
    }

    const { title, description, dueDate, status } = req.body;
    const trimmedTitle = typeof title === 'string' ? title.trim() : '';

    if (!trimmedTitle) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
        title: trimmedTitle,
        description,
        dueDate,
        status,
        user: user.id
    });

    return res.status(201).json({
        message: 'Task created successfully',
        task
    });
}

const getTasks = async (req, res) => {
    const user = req.user;

    const tasks = await Task.find({ user: user.id });

    return res.status(200).json({
        message: "Tasks fetched successfully",
        tasks
    });
}

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, dueDate, status } = req.body;

    const user = req.user;

    const task = await Task.findOne({ _id: taskId, user: user.id });

    if(!task){
        return res.status(401).json({
            message: "Task not found or you are not authorized to update this task"
        })
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description, dueDate, status }, { returnDocument: 'after' });

    return res.status(200).json({
        message: "Task updated successfully",
        task: updatedTask
    });
}

const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    const user = req.user;

    const task = await Task.findOne({ _id: taskId, user: user.id });

    if(!task){
        return res.status(401).json({
            message: "Task not found or you are not authorized to delete this task"
        })
    }

    await Task.findByIdAndDelete(taskId);

    return res.status(200).json({
        message: "Task deleted successfully"
    });
}

module.exports = { createTask, getTasks, updateTask, deleteTask };