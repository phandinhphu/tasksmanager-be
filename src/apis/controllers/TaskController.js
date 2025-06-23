const taskSchema = require("../models/Task");
const statusSchema = require("../models/Status");
const prioritySchema = require("../models/Priority");

class TaskController {
  // [GET] /tasks/me
  async getMyTasks(req, res) {
    try {
      const userId = req.user._id;
      const tasks = await taskSchema.find({ userid: userId });

      // Compare the tasks with the current date and update before response
      const currentDate = new Date();

      const inProgressStatus = await statusSchema.findOne({
        name: "In Progress",
      });
      const overdueStatus = await statusSchema.findOne({ name: "Overdue" });

      tasks.forEach((task) => {
        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach((subtask) => {
            const subStart = new Date(subtask.start_date);
            const subEnd = subtask?.extend_date
              ? new Date(subtask.extend_date)
              : new Date(subtask.end_date);

            if (
              !subtask.completed &&
              subStart <= currentDate &&
              currentDate <= subEnd
            ) {
              subtask.status = inProgressStatus._id;
            } else if (!subtask.completed && subEnd < currentDate) {
              subtask.status = overdueStatus._id;
            }
          });
        }

        const taskStart = new Date(task.start_date);
        const taskEnd = task?.extend_date
          ? new Date(task.extend_date)
          : new Date(task.end_date);

        if (
          !task.completed &&
          taskStart <= currentDate &&
          currentDate <= taskEnd
        ) {
          task.status = inProgressStatus._id;
        } else if (!task.completed && taskEnd < currentDate) {
          task.status = overdueStatus._id;
        }
      });

      await Promise.all(tasks.map((task) => task.save()));

      const newTasks = await taskSchema
        .find({ userid: userId })
        .populate("status")
        .populate("priority")
        .populate("subtasks.status")
        .populate("subtasks.priority");

      // Return the tasks
      return res.status(200).json(newTasks);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!", error });
    }
  }

  // [GET] /tasks/:id
  async getTaskById(req, res) {
    try {
      const taskId = req.params.id;
      const task = await taskSchema
        .findById(taskId)
        .populate("status")
        .populate("priority")
        .populate("subtasks.status")
        .populate("subtasks.priority");

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.status(200).json(task);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }

  // [POST] /tasks
  async createTask(req, res) {
    try {
      const {
        task_name,
        task_description,
        status,
        priority,
        start_date,
        end_date,
        subtasks,
      } = req.body;
      const userId = req.user._id;

      const newTask = new taskSchema({
        task_name,
        task_description,
        userid: userId,
        status,
        priority,
        start_date,
        end_date,
        subtasks,
      });

      await newTask.save();
      return res.status(201).json(newTask);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }

  // [PUT] /tasks/:id
  async updateTask(req, res) {
    try {
      const taskId = req.params.id;
      const {
        task_name,
        task_description,
        status,
        priority,
        start_date,
        end_date,
        subtasks,
        extend_date,
      } = req.body;

      const updatedTask = await taskSchema.findByIdAndUpdate(
        taskId,
        {
          task_name,
          task_description,
          status,
          priority,
          start_date,
          end_date,
          subtasks,
          extend_date,
        },
        { new: true },
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.status(200).json(updatedTask);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }

  // [PUT] /tasks/:id/complete
  async completeTask(req, res) {
    try {
      const taskId = req.params.id;

      const completedStatus = await statusSchema.findOne({ name: "Completed" });
      if (!completedStatus) {
        return res.status(404).json({ message: "Status not found" });
      }

      const updatedTask = await taskSchema.findByIdAndUpdate(
        taskId,
        {
          completed: true,
          status: completedStatus._id,
          completed_date: Date.now(),
        },
        { new: true },
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.status(200).json(updatedTask);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!", error });
    }
  }

  // [PUT] /tasks/:id/subtasks/:subtaskId/complete
  async completeSubtask(req, res) {
    try {
      const taskId = req.params.id;
      const subtaskId = req.params.subtaskId;

      const completedSubtask = await statusSchema.findOne({
        name: "Completed",
      });
      if (!completedSubtask) {
        return res.status(404).json({ message: "Status not found" });
      }

      const task = await taskSchema.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const subtask = task.subtasks.id(subtaskId);
      if (!subtask) {
        return res.status(404).json({ message: "Subtask not found" });
      }

      subtask.completed = true;
      subtask.status = completedSubtask._id;
      subtask.completed_date = Date.now();
      await task.save();

      return res.status(200).json(task);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }

  // [DELETE] /tasks/:id
  async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      const deletedTask = await taskSchema.findById(taskId);

      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (deletedTask.subtasks?.length > 0) {
        const convertedSubtasks = deletedTask.subtasks.map((subtask) => ({
          ...subtask._doc,
          userid: deletedTask.userid,
          status: subtask.status._id,
          priority: subtask.priority._id,
        }));
        await taskSchema.insertMany(convertedSubtasks);
      }

      await taskSchema.findByIdAndDelete(taskId);

      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }

  // [GET] /tasks/status
  async getAllStatus(req, res) {
    try {
      const statuses = await statusSchema.find();
      return res.status(200).json(statuses);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }

  // [GET] /tasks/priority
  async getAllPriority(req, res) {
    try {
      const priorities = await prioritySchema.find();
      return res.status(200).json(priorities);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }

  // [GET] /tasks/stats
  async getTaskStats(req, res) {
    try {
      const userId = req.user._id;
      const tasks = await taskSchema
        .find({ userid: userId })
        .populate("status");

      let completed = tasks.filter((task) => task.completed).length;
      let inProgress = tasks.filter(
        (task) => task.status.name === "In Progress",
      ).length;
      let overdue = tasks.filter(
        (task) => task.status.name === "Overdue",
      ).length;
      let subtasks = tasks.reduce(
        (sum, task) => sum + (task.subtasks?.length || 0),
        0,
      );

      tasks.forEach((task) => {
        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach((subtask) => {
            if (subtask.completed) {
              completed++;
            } else if (subtask.status.name === "In Progress") {
              inProgress++;
            } else if (subtask.status.name === "Overdue") {
              overdue++;
            }
          });
        }
      });

      const stats = {
        total: tasks.length + subtasks,
        completed: completed,
        inProgress: inProgress,
        overdue: overdue,
        subtasks: subtasks,
      };

      return res.status(200).json(stats);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }
}

module.exports = new TaskController();
