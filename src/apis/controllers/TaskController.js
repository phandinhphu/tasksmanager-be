const taskSchema = require('../models/Task');
const statusSchema = require('../models/Status');
const prioritySchema = require('../models/Priority');

class TaskController {
    // [GET] /tasks/me
    async getMyTasks(req, res) {
        try {
            const userId = req.user.id; // Assuming you have user ID in req.user
            const tasks = await taskSchema.find({ userid: userId })
                .populate('status').populate('priority').populate('subtasks.status').populate('subtasks.priority');
            return res.status(200).json(tasks);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error', error  });
        }
    }

    // [POST] /tasks
    async createTask(req, res) {
        try {
            const { task_name, task_description, status, priority, start_date, end_date, subtasks } = req.body;
            const userId = req.user.id; // Assuming you have user ID in req.user

            const newTask = new taskSchema({
                task_name,
                task_description,
                userid: userId,
                status,
                priority,
                start_date,
                end_date,
                subtasks
            });

            await newTask.save();
            return res.status(201).json(newTask);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // [PUT] /tasks/:id
    async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const { task_name, task_description, status, priority, start_date, end_date, subtasks, extend_date } = req.body;

            const updatedTask = await taskSchema.findByIdAndUpdate(taskId, {
                task_name,
                task_description,
                status,
                priority,
                start_date,
                end_date,
                subtasks,
                extend_date
            }, { new: true });

            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }

            return res.status(200).json(updatedTask);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // [DELETE] /tasks/:id
    async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            const deletedTask = await taskSchema.findById(taskId);

            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }

            if (deletedTask.subtasks?.length > 0) {
                const convertedSubtasks = deletedTask.subtasks.map(subtask => ({
                    ...subtask._doc,
                    userid: deletedTask.userid,
                    status: subtask.status._id,
                    priority: subtask.priority._id,
                }));
                await taskSchema.insertMany(convertedSubtasks);
            }

            await taskSchema.findByIdAndDelete(taskId);

            return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // [GET] /tasks/status
    async getAllStatus(req, res) {
        try {
            const statuses = await statusSchema.find();
            return res.status(200).json(statuses);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // [GET] /tasks/priority
    async getAllPriority(req, res) {
        try {
            const priorities = await prioritySchema.find();
            return res.status(200).json(priorities);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = new TaskController();