"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Job = {
  id: string;
  title: string;
  company: string;
  status: string;
};

type Column = {
  id: string;
  title: string;
  jobs: Job[];
  color: string;
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "applied",
      title: "Applied",
      color: "border-blue-500/30 bg-blue-500/5",
      jobs: [
        {
          id: "1",
          title: "Software Developer",
          company: "Microsoft Inc.",
          status: "applied",
        },
        {
          id: "2",
          title: "Frontend Engineer",
          company: "Google LLC",
          status: "applied",
        },
        {
          id: "3",
          title: "Data Scientist",
          company: "Amazon",
          status: "applied",
        },
        {
          id: "4",
          title: "Product Manager",
          company: "Airbnb",
          status: "applied",
        },
        {
          id: "5",
          title: "Full Stack Developer",
          company: "Spotify",
          status: "applied",
        },
        {
          id: "6",
          title: "Machine Learning Engineer",
          company: "DeepMind",
          status: "applied",
        },
        {
          id: "7",
          title: "Cloud Engineer",
          company: "Oracle",
          status: "applied",
        },
      ],
    },
    {
      id: "under_review",
      title: "Under Review",
      color: "border-yellow-500/30 bg-yellow-500/5",
      jobs: [
        {
          id: "8",
          title: "Backend Developer",
          company: "Netflix",
          status: "under_review",
        },
        {
          id: "9",
          title: "AI Researcher",
          company: "OpenAI",
          status: "under_review",
        },
        {
          id: "10",
          title: "Software Engineer",
          company: "Facebook",
          status: "under_review",
        },
        {
          id: "11",
          title: "Embedded Systems Engineer",
          company: "Intel",
          status: "under_review",
        },
        {
          id: "12",
          title: "Cybersecurity Engineer",
          company: "Cisco",
          status: "under_review",
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      color: "border-green-500/30 bg-green-500/5",
      jobs: [
        {
          id: "13",
          title: "DevOps Engineer",
          company: "Meta",
          status: "inprogress",
        },
        {
          id: "14",
          title: "Product Manager",
          company: "Airbnb",
          status: "inprogress",
        },
        {
          id: "15",
          title: "Data Analyst",
          company: "Uber",
          status: "inprogress",
        },
      ],
    },
    {
      id: "rejected",
      title: "Rejected",
      color: "border-red-500/30 bg-red-500/5",
      jobs: [
        {
          id: "16",
          title: "Cybersecurity Analyst",
          company: "Tesla",
          status: "rejected",
        },
        {
          id: "17",
          title: "Blockchain Engineer",
          company: "Coinbase",
          status: "rejected",
        },
        {
          id: "18",
          title: "AI Engineer",
          company: "Nvidia",
          status: "rejected",
        },
        {
          id: "19",
          title: "Game Developer",
          company: "Epic Games",
          status: "rejected",
        },
        {
          id: "20",
          title: "Data Engineer",
          company: "Stripe",
          status: "rejected",
        },
        {
          id: "21",
          title: "Software Architect",
          company: "IBM",
          status: "rejected",
        },
      ],
    },
    {
      id: "closed",
      title: "Closed",
      color: "border-gray-500/30 bg-gray-500/5",
      jobs: [
        {
          id: "22",
          title: "Cloud Architect",
          company: "IBM",
          status: "closed",
        },
        {
          id: "23",
          title: "UI/UX Designer",
          company: "Adobe",
          status: "closed",
        },
        {
          id: "24",
          title: "System Administrator",
          company: "Dell",
          status: "closed",
        },
        {
          id: "25",
          title: "Network Engineer",
          company: "Cisco",
          status: "closed",
        },
        {
          id: "26",
          title: "IT Support Engineer",
          company: "HP",
          status: "closed",
        },
      ],
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setColumns((prevColumns) => {
      const updatedColumns = [...prevColumns];

      // Find source and destination columns
      const sourceColIndex = updatedColumns.findIndex(
        (col) => col.id === source.droppableId
      );
      const destColIndex = updatedColumns.findIndex(
        (col) => col.id === destination.droppableId
      );

      if (sourceColIndex === -1 || destColIndex === -1) return prevColumns;

      const sourceCol = updatedColumns[sourceColIndex];
      const destCol = updatedColumns[destColIndex];

      // Create new job arrays to maintain immutability
      const sourceJobs = [...sourceCol.jobs];
      const destJobs =
        source.droppableId === destination.droppableId
          ? sourceJobs
          : [...destCol.jobs];

      // Remove the dragged job
      const [movedJob] = sourceJobs.splice(source.index, 1);
      destJobs.splice(destination.index, 0, movedJob);

      // Update columns
      updatedColumns[sourceColIndex] = { ...sourceCol, jobs: sourceJobs };
      updatedColumns[destColIndex] = { ...destCol, jobs: destJobs };

      return updatedColumns;
    });
  };

  return (
    <div className="p-4 max-w-7xl ">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col overflow-x-scroll  pb-4 md:grid md:grid-cols-5 md:gap-4 gap-2 md:overflow-visible">
          {columns.map((column) => (
            <div
              key={column.id}
              className="md:min-h-[500px]  min-h-max min-w-[75vw] md:min-w-0"
            >
              <Card className={`h-full border ${column.color} `}>
                <CardHeader className="p-4">
                  <CardTitle
                    className={`text-sm font-medium ${
                      column.id === "applied"
                        ? "text-blue-400"
                        : column.id === "under_review"
                        ? "text-yellow-400"
                        : column.id === "inprogress"
                        ? "text-green-400"
                        : column.id === "rejected"
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {column.title}
                  </CardTitle>
                </CardHeader>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <CardContent
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="h-full p-2"
                    >
                      {column.jobs.map((job, index) => (
                        <Draggable
                          key={job.id}
                          draggableId={job.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 mb-2 rounded-lg bg-white border ${
                                column.id === "applied"
                                  ? "border-blue-700/20 hover:border-blue-700/40"
                                  : column.id === "under_review"
                                  ? "border-yellow-700/20 hover:border-yellow-700/40"
                                  : column.id === "inprogress"
                                  ? "border-green-700/20 hover:border-green-700/40"
                                  : column.id === "rejected"
                                  ? "border-red-700/20 hover:border-red-700/40"
                                  : "border-gray-700/20 hover:border-gray-700/40"
                              }`}
                            >
                              <h3
                                className={`text-sm font-medium ${
                                  column.id === "applied"
                                    ? "text-blue-700"
                                    : column.id === "under_review"
                                    ? "text-yellow-700"
                                    : column.id === "inprogress"
                                    ? "text-green-700"
                                    : column.id === "rejected"
                                    ? "text-red-700"
                                    : "text-gray-700"
                                }`}
                              >
                                {job.title}
                              </h3>
                              <p className="text-xs text-gray-400">
                                {job.company}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  )}
                </Droppable>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
