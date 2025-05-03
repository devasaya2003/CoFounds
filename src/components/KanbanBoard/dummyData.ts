import { Application, ApplicationStatus } from './types';

const randomPastDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
  return date.toISOString();
};

const randomFutureDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + Math.floor(Math.random() * 6) + 1);
  return date.toISOString();
};

const companies = [
  {
    id: "company-9999-zzzz-yyyy-xxxx0000wwww",
    name: "TechNova Inc.",
    url: "https://technova.example.com",
    isActive: true,
    createdAt: "2020-01-01T00:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z"
  },
  {
    id: "company-8888-yyyy-xxxx-wwww7777vvvv",
    name: "DataFlow Systems",
    url: "https://dataflow.example.com",
    isActive: true,
    createdAt: "2019-05-15T00:00:00.000Z",
    updatedAt: "2024-11-20T14:30:00.000Z"
  },
  {
    id: "company-7777-xxxx-wwww-vvvv6666uuuu",
    name: "CloudScale Solutions",
    url: "https://cloudscale.example.com",
    isActive: true,
    createdAt: "2018-11-30T00:00:00.000Z",
    updatedAt: "2024-10-05T09:45:00.000Z"
  }
];

const jobs = [
  {
    id: "job-5678-ijkl-9012-mnop3456qrst",
    title: "Frontend Developer",
    assignmentLink: "https://assignments.example.com/frontend-test",
    location: "Remote",
    package: "12-15 LPA",
    endAt: randomFutureDate(),
    createdAt: randomPastDate(),
    updatedAt: randomPastDate(),
    company: companies[0]
  },
  {
    id: "job-1234-abcd-5678-efgh9012ijkl",
    title: "Backend Engineer",
    assignmentLink: "https://assignments.example.com/backend-test",
    location: "Bangalore",
    package: "18-22 LPA",
    endAt: randomFutureDate(),
    createdAt: randomPastDate(),
    updatedAt: randomPastDate(),
    company: companies[1]
  },
  {
    id: "job-9012-mnop-3456-qrst7890uvwx",
    title: "DevOps Specialist",
    assignmentLink: "https://assignments.example.com/devops-test",
    location: "Hybrid - Delhi",
    package: "20-25 LPA",
    endAt: randomFutureDate(),
    createdAt: randomPastDate(),
    updatedAt: randomPastDate(),
    company: companies[2]
  },
  {
    id: "job-3456-qrst-7890-uvwx1234yzab",
    title: "Full Stack Developer",
    assignmentLink: "https://assignments.example.com/fullstack-test",
    location: "Mumbai",
    package: "15-18 LPA",
    endAt: randomFutureDate(),
    createdAt: randomPastDate(),
    updatedAt: randomPastDate(),
    company: companies[0]
  },
  {
    id: "job-7890-uvwx-1234-yzab5678cdef",
    title: "UI/UX Designer",
    assignmentLink: "https://assignments.example.com/design-test",
    location: "Remote",
    package: "10-14 LPA",
    endAt: randomFutureDate(),
    createdAt: randomPastDate(),
    updatedAt: randomPastDate(),
    company: companies[1]
  }
];

const statuses: ApplicationStatus[] = ['applied', 'under_review', 'inprogress', 'rejected', 'closed'];

const generateId = () => {
  return `a${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
};

const generateUserId = () => {
  return `user-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
};

export const generateDummyApplications = (count = 30): Application[] => {
  const applications: Application[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    applications.push({
      id: generateId(),
      userId: generateUserId(),
      status: randomStatus,
      assignmentLink: randomJob.assignmentLink,
    isActive: Math.random() > 0.1, 
      createdAt: randomPastDate(),
      updatedAt: randomPastDate(),
      job: randomJob
    });
  }
  
  return applications;
};