export const sampleWorkers = [
  {
    _id: "worker-1",
    fullName: "Alex Rodriguez",
    email: "alex.rodriguez@example.com",
    phoneNumber: "(555) 123-4567",
    address: "123 Main St, City, State, ZIP",
    primarySpecialization: "Engine Specialist",
    skills: ["Engine Repair", "Diagnostics"],
    certifications: ["ASE Certified"],
    hireDate: "2025-03-16",
    weeklyAvailability: ["Monday", "Wednesday", "Friday"],
    hourlyRate: 30.0,
    additionalNotes: "Experienced engine specialist with 5 years of experience.",
    workload: 1,
  },
  {
    _id: "worker-2",
    fullName: "Maria Garcia",
    email: "maria.garcia@example.com",
    phoneNumber: "(555) 234-5678",
    address: "456 Oak St, City, State, ZIP",
    primarySpecialization: "Brake Specialist",
    skills: ["Brake Repair", "Wheel Alignment"],
    certifications: ["EPA Certified"],
    hireDate: "2025-03-16",
    weeklyAvailability: ["Tuesday", "Thursday", "Saturday"],
    hourlyRate: 28.0,
    additionalNotes: "Specializes in brake systems.",
    workload: 1,
  },
  {
    _id: "worker-3",
    fullName: "Robert Johnson",
    email: "robert.johnson@example.com",
    phoneNumber: "(555) 345-6789",
    address: "789 Pine St, City, State, ZIP",
    primarySpecialization: "Electrical Systems",
    skills: ["Electrical Diagnostics", "Battery Replacement"],
    certifications: ["ASE Certified"],
    hireDate: "2025-03-16",
    weeklyAvailability: ["Monday", "Wednesday", "Friday"],
    hourlyRate: 32.0,
    additionalNotes: "",
    workload: 0,
  },
  {
    _id: "worker-4",
    fullName: "Lisa Chen",
    email: "lisa.chen@example.com",
    phoneNumber: "(555) 456-7890",
    address: "321 Elm St, City, State, ZIP",
    primarySpecialization: "General Mechanic",
    skills: ["Oil Change", "Tire Rotation"],
    certifications: [],
    hireDate: "2025-03-16",
    weeklyAvailability: ["Tuesday", "Thursday"],
    hourlyRate: 25.0,
    additionalNotes: "General mechanic with a focus on routine maintenance.",
    workload: 0,
  },
  {
    _id: "worker-5",
    fullName: "James Wilson",
    email: "james.wilson@example.com",
    phoneNumber: "(555) 567-8901",
    address: "654 Cedar St, City, State, ZIP",
    primarySpecialization: "Transmission Specialist",
    skills: ["Transmission Repair", "Clutch Replacement"],
    certifications: ["ASE Certified"],
    hireDate: "2025-03-16",
    weeklyAvailability: ["Monday", "Friday", "Saturday"],
    hourlyRate: 35.0,
    additionalNotes: "",
    workload: 0,
  },
];

// Sample appointments (unchanged)
export const sampleAppointments = [
  {
    _id: "appt-123",
    customerName: "John Smith",
    carType: "Toyota Camry 2020",
    serviceType: "Oil Change",
    appointmentDate: "2025-03-15T10:00:00Z",
    worker: null,
  },
  {
    _id: "appt-234",
    customerName: "Sarah Johnson",
    carType: "Honda Civic 2019",
    serviceType: "Brake Inspection",
    appointmentDate: "2025-03-15T11:30:00Z",
    worker: null,
  },
  {
    _id: "appt-345",
    customerName: "Michael Brown",
    carType: "Ford F-150 2021",
    serviceType: "Tire Rotation",
    appointmentDate: "2025-03-15T13:00:00Z",
    worker: { _id: "worker-1", fullName: "Alex Rodriguez", primarySpecialization: "Engine Specialist" },
  },
  {
    _id: "appt-456",
    customerName: "Emily Davis",
    carType: "Chevrolet Malibu 2018",
    serviceType: "Full Service",
    appointmentDate: "2025-03-15T14:30:00Z",
    worker: { _id: "worker-3", fullName: "Robert Johnson", primarySpecialization: "Electrical Systems" },
  },
  {
    _id: "appt-567",
    customerName: "David Wilson",
    carType: "BMW X5 2022",
    serviceType: "Diagnostic Check",
    appointmentDate: "2025-03-16T09:00:00Z",
    worker: { _id: "worker-4", fullName: "Lisa Chen", primarySpecialization: "General Mechanic" },
  },
  {
    _id: "appt-678",
    customerName: "Jennifer Martinez",
    carType: "Audi A4 2021",
    serviceType: "AC Service",
    appointmentDate: "2025-03-16T10:30:00Z",
    worker: { _id: "worker-5", fullName: "James Wilson", primarySpecialization: "Transmission Specialist" },
  },
];