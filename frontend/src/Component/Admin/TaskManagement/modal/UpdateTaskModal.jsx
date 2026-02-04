// TaskUpdateModal.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../../../../Pages/config/config";
import api from "../../../../Pages/config/api";

const TaskUpdateModal = ({ show, onHide, task, onUpdate }) => {
  const [updatedTask, setUpdatedTask] = useState({
    Taskname: task.Taskname || "",
    description: task.description || "",
    startDate: task.startDate || "",
    endDate: task.endDate || "",
    managerEmail: task.managerEmail || "",
    duration: task.duration || 0,
    comment: task.comment || "",
  });

  const handleUpdate = async () => {
    try {
      await api.put(
        `/api/tasks/${task._id}`,
        {
          Taskname: updatedTask.Taskname,
          description: updatedTask.description,
          startDate: updatedTask.startDate,
          endDate: updatedTask.endDate,
          managerEmail: updatedTask.managerEmail,
          duration: updatedTask.duration,
          comment: updatedTask.comment,
        },
        
      );
      toast.success("Task updated successfully!");
      onUpdate(); // Callback to fetch updated task list in parent
      onHide(); // Close the modal
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const ShortedText = (text) => {
    return text; // No length restriction or truncation
  };

  const sanitizedDesc = (description) => {
    if (!description) return "";

    return ShortedText(
      description
        .replace(/<img[^>]*>/g, "")
        .replace(/<iframe[^>]*>/g, "")
        .replace(/<h1[^>]*>.*?<\/h1>/gi, "")
        .replace(/<h2[^>]*>.*?<\/h2>/gi, "")
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTaskName">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              value={updatedTask.Taskname}
              onChange={(e) => setUpdatedTask({ ...updatedTask, Taskname: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formTaskDescription">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={updatedTask.description}
              onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formTaskStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={updatedTask.startDate}
              onChange={(e) => setUpdatedTask({ ...updatedTask, startDate: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formTaskEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={updatedTask.endDate}
              onChange={(e) => setUpdatedTask({ ...updatedTask, endDate: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formTaskDuration">
            <Form.Label>Task Duration (in days)</Form.Label>
            <Form.Control
              type="number"
              value={updatedTask.duration}
              onChange={(e) => setUpdatedTask({ ...updatedTask, duration: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formTaskManagerEmail">
            <Form.Label>Manager Email</Form.Label>
            <Form.Control
              type="email"
              value={updatedTask.managerEmail}
              onChange={(e) => setUpdatedTask({ ...updatedTask, managerEmail: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formTaskComment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={updatedTask.comment}
              onChange={(e) => setUpdatedTask({ ...updatedTask, comment: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskUpdateModal;
